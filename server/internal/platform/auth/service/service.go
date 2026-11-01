package service

import (
	"context"

	"go-react-admin/server/internal/platform/auth/dto"
	"go-react-admin/server/internal/shared/authjwt"
)

type Service struct {
	jwt *authjwt.Manager
}

func New(jwtMgr *authjwt.Manager) *Service {
	return &Service{jwt: jwtMgr}
}

// LoginExample issues a JWT without real credential checks.
func (s *Service) LoginExample(_ context.Context, req dto.LoginRequest) (*dto.LoginResult, error) {
	token, err := s.jwt.Sign("user-"+req.Username, req.Username, "tenant-demo")
	if err != nil {
		return nil, err
	}
	return &dto.LoginResult{
		Token:      token,
		UserName:   req.Username,
		TenantID:   "tenant-demo",
		TenantName: "Demo 租户",
		Note:       "example login only; wire IAM later",
	}, nil
}
