package service

import (
	"context"

	"Go-React-Admin/server/internal/platform/iam/dto"
	"Go-React-Admin/server/internal/platform/iam/repo"
	apctx "Go-React-Admin/server/internal/shared/ctx"
)

type Service struct {
	repo *repo.Repo
}

func New(r *repo.Repo) *Service {
	return &Service{repo: r}
}

func (s *Service) Me(ctx context.Context) dto.Me {
	_ = s.repo
	return dto.Me{
		UserID:   apctx.UserID(ctx),
		UserName: apctx.UserName(ctx),
		TenantID: apctx.TenantID(ctx),
		Permissions: []string{
			"platform:tenant:read",
			"platform:app:read",
			"demo:item:read",
		},
		Note: "example only; replace with IAM service",
	}
}
