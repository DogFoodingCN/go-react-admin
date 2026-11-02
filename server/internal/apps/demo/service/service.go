package service

import (
	"context"

	"Go-React-Admin/server/internal/apps/demo/dto"
	"Go-React-Admin/server/internal/apps/demo/repo"
	apctx "Go-React-Admin/server/internal/shared/ctx"
)

type Service struct {
	repo *repo.Repo
}

func New(r *repo.Repo) *Service {
	return &Service{repo: r}
}

func (s *Service) ListItems(ctx context.Context) ([]dto.Item, error) {
	tenantID := apctx.TenantID(ctx)
	rows, err := s.repo.ListExample(ctx, tenantID)
	if err != nil {
		return nil, err
	}
	out := make([]dto.Item, 0, len(rows))
	for _, row := range rows {
		out = append(out, dto.Item{ID: row.ID, Title: row.Title, Remark: row.Remark})
	}
	return out, nil
}
