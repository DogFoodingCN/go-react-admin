package repo

import (
	"context"

	"gorm.io/gorm"

	"go-react-admin/server/internal/apps/demo/model"
)

type Repo struct {
	db *gorm.DB
}

func New(gdb *gorm.DB) *Repo {
	return &Repo{db: gdb}
}

// ListExample returns stubs.
// Real implementation should query via:
//
//	db.WithTenant(r.db, tenantID).Find(&rows)
func (r *Repo) ListExample(_ context.Context, tenantID string) ([]model.Item, error) {
	_ = r.db
	return []model.Item{
		{
			ID:       "1",
			TenantID: tenantID,
			Title:    "首个业务应用切片",
			Remark:   "tenant=" + tenantID + "; replace with repo query later",
		},
	}, nil
}
