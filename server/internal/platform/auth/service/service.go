package service

import (
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"go-react-admin/server/internal/platform/auth/dto"
	"go-react-admin/server/internal/platform/auth/repo"
	"go-react-admin/server/internal/shared/authjwt"
)

var (
	ErrInvalidCredentials = errors.New("invalid username or password")
	ErrAuthUnavailable    = errors.New("auth unavailable: database not ready")
)

type Service struct {
	jwt  *authjwt.Manager
	repo *repo.Repo
}

func New(jwtMgr *authjwt.Manager, r *repo.Repo) *Service {
	return &Service{jwt: jwtMgr, repo: r}
}

// Login verifies platform_users with bcrypt when DB is ready; otherwise keeps stub login.
func (s *Service) Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResult, error) {
	if s.repo == nil || !s.repo.HasUsersTable() {
		return s.loginStub(req)
	}

	n, err := s.repo.CountUsers(ctx)
	if err != nil {
		return nil, err
	}
	if n == 0 {
		return nil, ErrAuthUnavailable
	}

	user, err := s.repo.FindByUsername(ctx, req.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	tenantID, tenantName, err := s.repo.FindDefaultTenantName(ctx)
	if err != nil {
		return nil, err
	}

	token, err := s.jwt.Sign(user.ID, user.Username, tenantID)
	if err != nil {
		return nil, err
	}
	return &dto.LoginResult{
		Token:      token,
		UserName:   user.Username,
		TenantID:   tenantID,
		TenantName: tenantName,
		Note:       "platform admin login",
	}, nil
}

func (s *Service) loginStub(req dto.LoginRequest) (*dto.LoginResult, error) {
	token, err := s.jwt.Sign("user-"+req.Username, req.Username, "tenant-demo")
	if err != nil {
		return nil, err
	}
	return &dto.LoginResult{
		Token:      token,
		UserName:   req.Username,
		TenantID:   "tenant-demo",
		TenantName: "Demo 租户",
		Note:       "example login only; wire IAM later",
	}, nil
}
