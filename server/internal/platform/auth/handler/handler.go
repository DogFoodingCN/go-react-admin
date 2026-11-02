package handler

import (
	"errors"

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
	out, err := h.svc.Login(c.Request.Context(), req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidCredentials):
			response.Unauthorized(c, err.Error())
		case errors.Is(err, service.ErrAuthUnavailable):
			response.ServiceUnavailable(c, err.Error())
		default:
			response.Internal(c, "login failed")
		}
		return
	}
	response.OK(c, out)
}

func (h *Handler) Register(r gin.IRoutes) {
	r.POST("/login", h.Login)
}
