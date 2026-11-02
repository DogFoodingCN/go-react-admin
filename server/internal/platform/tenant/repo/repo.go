package repo

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"go-react-admin/server/internal/platform/tenant/model"
)

var ErrNotFound = errors.New("tenant not found")

type Repo struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Repo {
	return &Repo{db: db}
}

func (r *Repo) List(ctx context.Context) ([]model.Tenant, error) {
	if r.db == nil {
		return []model.Tenant{
			{ID: "tenant-demo", Name: "Demo 租户", Status: "active"},
		}, nil
	}
	var rows []model.Tenant
	if err := r.db.WithContext(ctx).Order("created_at desc").Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return []model.Tenant{}, nil
	}
	return rows, nil
}

func (r *Repo) Get(ctx context.Context, id string) (*model.Tenant, error) {
	if r.db == nil {
		if id == "tenant-demo" {
			return &model.Tenant{ID: id, Name: "Demo 租户", Status: "active"}, nil
		}
		return nil, ErrNotFound
	}
	var row model.Tenant
	if err := r.db.WithContext(ctx).First(&row, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &row, nil
}

func (r *Repo) Create(ctx context.Context, name, status string) (*model.Tenant, error) {
	if status == "" {
		status = "active"
	}
	row := model.Tenant{
		ID:        uuid.NewString(),
		Name:      name,
		Status:    status,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if r.db == nil {
		return &row, nil
	}
	if err := r.db.WithContext(ctx).Create(&row).Error; err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *Repo) Update(ctx context.Context, id, name, status string) (*model.Tenant, error) {
	row, err := r.Get(ctx, id)
	if err != nil {
		return nil, err
	}
	row.Name = name
	row.Status = status
	row.UpdatedAt = time.Now()
	if r.db == nil {
		return row, nil
	}
	if err := r.db.WithContext(ctx).Save(row).Error; err != nil {
		return nil, err
	}
	return row, nil
}
