package repo

import (
	"context"

	"gorm.io/gorm"

	"Go-React-Admin/server/internal/platform/audit/dto"
)

type Repo struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Repo {
	return &Repo{db: db}
}

func (r *Repo) ListExample(_ context.Context, _ string) ([]dto.Item, error) {
	return []dto.Item{}, nil
}
