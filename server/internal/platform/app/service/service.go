package service

import (
	"context"

	"Go-React-Admin/server/internal/platform/app/dto"
	"Go-React-Admin/server/internal/platform/app/repo"
	apctx "Go-React-Admin/server/internal/shared/ctx"
)

type Service struct {
	repo *repo.Repo
}

func New(r *repo.Repo) *Service {
	return &Service{repo: r}
}

func (s *Service) List(ctx context.Context) ([]dto.Item, error) {
	return s.repo.ListExample(ctx, apctx.TenantID(ctx))
}
