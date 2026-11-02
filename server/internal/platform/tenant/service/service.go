package service

import (
	"context"
	"errors"
	"strings"

	"Go-React-Admin/server/internal/platform/tenant/dto"
	"Go-React-Admin/server/internal/platform/tenant/repo"
)

var ErrInvalidInput = errors.New("invalid tenant input")

type Service struct {
	repo *repo.Repo
}

func New(r *repo.Repo) *Service {
	return &Service{repo: r}
}

func (s *Service) List(ctx context.Context) ([]dto.Item, error) {
	rows, err := s.repo.List(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]dto.Item, 0, len(rows))
	for _, row := range rows {
		out = append(out, dto.Item{ID: row.ID, Name: row.Name, Status: row.Status})
	}
	return out, nil
}

func (s *Service) Get(ctx context.Context, id string) (*dto.Item, error) {
	row, err := s.repo.Get(ctx, id)
	if err != nil {
		return nil, err
	}
	return &dto.Item{ID: row.ID, Name: row.Name, Status: row.Status}, nil
}

func (s *Service) Create(ctx context.Context, req dto.CreateRequest) (*dto.Item, error) {
	name := strings.TrimSpace(req.Name)
	if name == "" {
		return nil, ErrInvalidInput
	}
	status := strings.TrimSpace(req.Status)
	if status == "" {
		status = "active"
	}
	row, err := s.repo.Create(ctx, name, status)
	if err != nil {
		return nil, err
	}
	return &dto.Item{ID: row.ID, Name: row.Name, Status: row.Status}, nil
}

func (s *Service) Update(ctx context.Context, id string, req dto.UpdateRequest) (*dto.Item, error) {
	name := strings.TrimSpace(req.Name)
	status := strings.TrimSpace(req.Status)
	if name == "" || status == "" {
		return nil, ErrInvalidInput
	}
	row, err := s.repo.Update(ctx, id, name, status)
	if err != nil {
		return nil, err
	}
	return &dto.Item{ID: row.ID, Name: row.Name, Status: row.Status}, nil
}
