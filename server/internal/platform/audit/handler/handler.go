package handler

import (
	"github.com/gin-gonic/gin"

	"Go-React-Admin/server/internal/platform/audit/dto"
	"Go-React-Admin/server/internal/platform/audit/service"
	"Go-React-Admin/server/internal/shared/pagination"
	"Go-React-Admin/server/internal/shared/response"
)

type Handler struct {
	svc *service.Service
}

func New(svc *service.Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) List(c *gin.Context) {
	var q pagination.Query
	_ = c.ShouldBindQuery(&q)
	q.Normalize()

	list, err := h.svc.List(c.Request.Context())
	if err != nil {
		response.Internal(c, "list audit failed")
		return
	}
	response.OK(c, pagination.Result[dto.Item]{
		List:     list,
		Total:    int64(len(list)),
		Page:     q.Page,
		PageSize: q.PageSize,
	})
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("", h.List)
}
