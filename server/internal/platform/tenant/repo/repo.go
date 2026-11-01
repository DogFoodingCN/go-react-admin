package repo

import (
	"context"

	"gorm.io/gorm"

	"go-react-admin/server/internal/platform/tenant/model"
)

type Repo struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Repo {
	return &Repo{db: db}
}

// ListExample returns stub rows until real queries exist.
func (r *Repo) ListExample(_ context.Context) ([]model.Tenant, error) {
	return []model.Tenant{
		{ID: "tenant-demo", Name: "Demo 租户", Status: "active"},
	}, nil
}
