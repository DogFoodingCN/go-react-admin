package service

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"regexp"
	"strings"
	"sync/atomic"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"go-react-admin/server/internal/config"
	"go-react-admin/server/internal/platform/setup/dto"
	"go-react-admin/server/internal/platform/setup/model"
	"go-react-admin/server/internal/platform/setup/repo"
	"go-react-admin/server/internal/shared/db"
)

var (
	ErrAlreadyInitialized = errors.New("setup already completed")
	ErrWeakPassword       = errors.New("admin password too short (min 6)")
	ErrInvalidDSN         = errors.New("dsn is required")
	ErrInvalidAdmin       = errors.New("admin_username required")
)

var passwordInDSN = regexp.MustCompile(`(?i)(password|pwd)=([^&\s]+)`)

type Service struct {
	cfg       *config.Config
	holder    *db.Holder
	repo      *repo.Repo
	localPath string
	completed atomic.Bool
}

func New(cfg *config.Config, holder *db.Holder, r *repo.Repo) *Service {
	localPath := config.ResolveLocalPath("")
	if cfg != nil && cfg.LocalConfigPath != "" {
		localPath = cfg.LocalConfigPath
	}
	svc := &Service{
		cfg:       cfg,
		holder:    holder,
		repo:      r,
		localPath: localPath,
	}
	if config.LocalDSNPersisted(svc.localPath) {
		svc.completed.Store(true)
	}
	return svc
}

func (s *Service) Status(ctx context.Context) dto.StatusResponse {
	dsnPersisted := strings.TrimSpace(s.cfg.Database.DSN) != "" || config.LocalDSNPersisted(s.localPath)
	gdb := s.holder.Get()

	dbReachable := false
	if gdb != nil {
		if err := db.Ping(gdb); err == nil {
			dbReachable = true
		}
	}

	migrationsPending := true
	hasAdmin := false
	setupDone := false

	if dbReachable && gdb != nil {
		migrationsPending = !s.repo.TablesReady(gdb)
		if !migrationsPending {
			if ok, err := s.repo.SetupCompleted(ctx, gdb); err == nil {
				setupDone = ok
			}
			if ok, err := s.repo.HasAdmin(ctx, gdb); err == nil {
				hasAdmin = ok
			}
		}
	}

	initialized := dsnPersisted && dbReachable && !migrationsPending && setupDone && hasAdmin

	out := dto.StatusResponse{
		Initialized:       initialized,
		DSNPersisted:      dsnPersisted,
		DBReachable:       dbReachable,
		MigrationsPending: migrationsPending,
		HasAdmin:          hasAdmin,
	}

	switch {
	case initialized:
		out.State = "ready"
		out.Message = "platform initialized"
	case dsnPersisted && !dbReachable:
		out.State = "db_unreachable"
		out.Message = "persisted DSN present but database ping failed"
	default:
		out.State = "need_setup"
		out.Message = "database and admin not initialized"
	}
	return out
}

func (s *Service) TestConnection(ctx context.Context, req dto.TestConnectionRequest) (*dto.TestConnectionResponse, error) {
	if err := s.assertWritable(); err != nil {
		return nil, err
	}
	dsn := strings.TrimSpace(req.DSN)
	if dsn == "" {
		return nil, ErrInvalidDSN
	}

	gdb, err := db.Open(dsn)
	if err != nil {
		return &dto.TestConnectionResponse{OK: false, Message: sanitizeErr(err)}, nil
	}
	defer db.Close(gdb)

	if err := db.Ping(gdb); err != nil {
		return &dto.TestConnectionResponse{OK: false, Message: sanitizeErr(err)}, nil
	}
	_ = ctx
	return &dto.TestConnectionResponse{OK: true, Message: "connection ok"}, nil
}

func (s *Service) Initialize(ctx context.Context, req dto.InitializeRequest) (*dto.InitializeResponse, error) {
	if err := s.assertWritable(); err != nil {
		return nil, err
	}

	dsn := strings.TrimSpace(req.DSN)
	username := strings.TrimSpace(req.AdminUsername)
	password := req.AdminPassword
	if dsn == "" {
		return nil, ErrInvalidDSN
	}
	if username == "" {
		return nil, ErrInvalidAdmin
	}
	if utf8.RuneCountInString(password) < 6 {
		return nil, ErrWeakPassword
	}

	gdb, err := db.Open(dsn)
	if err != nil {
		return nil, fmt.Errorf("connect: %s", sanitizeErr(err))
	}

	if err := db.Ping(gdb); err != nil {
		_ = db.Close(gdb)
		return nil, fmt.Errorf("ping: %s", sanitizeErr(err))
	}

	if err := s.repo.AutoMigrate(gdb); err != nil {
		_ = db.Close(gdb)
		return nil, fmt.Errorf("migrate: %s", sanitizeErr(err))
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		_ = db.Close(gdb)
		return nil, fmt.Errorf("hash password: %w", err)
	}

	display := strings.TrimSpace(req.AdminDisplayName)
	if display == "" {
		display = username
	}

	now := time.Now().UTC()
	user := model.PlatformUser{
		ID:           uuid.NewString(),
		Username:     username,
		PasswordHash: string(hash),
		DisplayName:  display,
		Role:         "super_admin",
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	var tenant *model.Tenant
	tenantName := strings.TrimSpace(req.BootstrapTenantName)
	if tenantName == "" {
		tenantName = "默认租户"
	}
	tenant = &model.Tenant{
		ID:        uuid.NewString(),
		Name:      tenantName,
		Status:    "active",
		CreatedAt: now,
		UpdatedAt: now,
	}

	setupRow := model.SysSetup{
		Completed:     true,
		CompletedAt:   &now,
		AdminUsername: username,
	}

	if err := s.repo.SeedInitialize(ctx, gdb, user, tenant, setupRow); err != nil {
		_ = db.Close(gdb)
		return nil, fmt.Errorf("seed: %s", sanitizeErr(err))
	}

	if err := config.PersistDSN(s.localPath, dsn); err != nil {
		_ = db.Close(gdb)
		return nil, fmt.Errorf("persist dsn: %w", err)
	}

	s.cfg.Database.DSN = dsn
	prev := s.holder.Get()
	s.holder.Replace(gdb)
	s.completed.Store(true)
	if prev != nil && prev != gdb {
		if err := db.Close(prev); err != nil {
			slog.Warn("close previous db failed", "err", sanitizeErr(err))
		}
	}

	slog.Info("platform setup completed", "admin", username, "tenant", tenantName)
	return &dto.InitializeResponse{
		Initialized: true,
		Message:     "setup completed",
	}, nil
}

func (s *Service) assertWritable() error {
	if s.completed.Load() {
		return ErrAlreadyInitialized
	}
	// Local overlay is only written after a successful initialize.
	if config.LocalDSNPersisted(s.localPath) {
		return ErrAlreadyInitialized
	}
	st := s.Status(context.Background())
	if st.Initialized {
		return ErrAlreadyInitialized
	}
	return nil
}

// FindPlatformUser exposes credential lookup for auth when DB is ready.
func (s *Service) FindPlatformUser(ctx context.Context, username string) (*model.PlatformUser, error) {
	gdb := s.holder.Get()
	if gdb == nil {
		return nil, gorm.ErrRecordNotFound
	}
	return s.repo.FindUserByUsername(ctx, gdb, username)
}

func (s *Service) HasAnyAdmin(ctx context.Context) (bool, error) {
	gdb := s.holder.Get()
	if gdb == nil {
		return false, nil
	}
	return s.repo.HasAdmin(ctx, gdb)
}

func sanitizeErr(err error) string {
	if err == nil {
		return ""
	}
	msg := err.Error()
	msg = passwordInDSN.ReplaceAllString(msg, "${1}=***")
	// strip raw password-like fragments that postgres drivers may echo
	msg = strings.ReplaceAll(msg, "\n", " ")
	if len(msg) > 240 {
		msg = msg[:240] + "..."
	}
	return msg
}
