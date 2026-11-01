package handler

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/platform/auth/dto"
	"go-react-admin/server/internal/platform/auth/service"
	"go-react-admin/server/internal/shared/response"
)

type Handler struct {
	svc *service.Service
}

func New(svc *service.Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "username and password required")
		return
	}
	out, err := h.svc.LoginExample(c.Request.Context(), req)
	if err != nil {
		response.Internal(c, "sign token failed")
		return
	}
	response.OK(c, out)
}

func (h *Handler) Register(r gin.IRoutes) {
	r.POST("/login", h.Login)
}
