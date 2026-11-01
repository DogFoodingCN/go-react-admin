package service

import (
	"go-react-admin/server/internal/apps/demo/dto"
	"go-react-admin/server/internal/shared/middleware"

	"github.com/gin-gonic/gin"
)

// Service holds demo business rules. Fill in when requirements arrive.
type Service struct{}

func New() *Service {
	return &Service{}
}

// ListExample returns stub rows scoped conceptually to the request tenant.
func (s *Service) ListExample(c *gin.Context) []dto.Item {
	tenantID := middleware.TenantID(c)
	return []dto.Item{
		{
			ID:     "1",
			Title:  "首个业务应用切片",
			Remark: "tenant=" + tenantID + "; replace with repo query later",
		},
	}
}
