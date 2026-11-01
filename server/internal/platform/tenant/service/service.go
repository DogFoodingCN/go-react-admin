package service

import (
	"context"

	"go-react-admin/server/internal/platform/tenant/dto"
	"go-react-admin/server/internal/platform/tenant/repo"
)

type Service struct {
	repo *repo.Repo
}

func New(r *repo.Repo) *Service {
	return &Service{repo: r}
}

func (s *Service) List(ctx context.Context) ([]dto.Item, error) {
	rows, err := s.repo.ListExample(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dto.Item, 0, len(rows))
	for _, row := range rows {
		out = append(out, dto.Item{ID: row.ID, Name: row.Name, Status: row.Status})
	}
	return out, nil
}
