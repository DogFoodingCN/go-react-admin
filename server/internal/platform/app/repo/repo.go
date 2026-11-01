package repo

import (
	"context"

	"gorm.io/gorm"

	"go-react-admin/server/internal/platform/app/dto"
)

type Repo struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Repo {
	return &Repo{db: db}
}

func (r *Repo) ListExample(_ context.Context, _ string) ([]dto.Item, error) {
	return []dto.Item{
		{Code: "demo", Name: "Demo 应用", Enabled: true},
	}, nil
}
