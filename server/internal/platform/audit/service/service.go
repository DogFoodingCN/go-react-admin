package service

import (
	"context"

	"go-react-admin/server/internal/platform/audit/dto"
	"go-react-admin/server/internal/platform/audit/repo"
	apctx "go-react-admin/server/internal/shared/ctx"
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
