package handler

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/platform/iam/service"
	"go-react-admin/server/internal/shared/response"
)

type Handler struct {
	svc *service.Service
}

func New(svc *service.Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) Me(c *gin.Context) {
	response.OK(c, h.svc.Me(c.Request.Context()))
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("/me", h.Me)
}
