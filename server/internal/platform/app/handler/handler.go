package handler

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/platform/app/service"
	"go-react-admin/server/internal/shared/response"
)

type Handler struct {
	svc *service.Service
}

func New(svc *service.Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) List(c *gin.Context) {
	list, err := h.svc.List(c.Request.Context())
	if err != nil {
		response.Internal(c, "list apps failed")
		return
	}
	response.OK(c, list)
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("", h.List)
}
