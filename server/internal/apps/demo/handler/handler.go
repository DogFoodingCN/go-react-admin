package handler

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/apps/demo/dto"
	"go-react-admin/server/internal/apps/demo/service"
	"go-react-admin/server/internal/shared/pagination"
	"go-react-admin/server/internal/shared/response"
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

	list := h.svc.ListExample(c)
	response.OK(c, pagination.Result[dto.Item]{
		List:     list,
		Total:    int64(len(list)),
		Page:     q.Page,
		PageSize: q.PageSize,
	})
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("/items", h.List)
}
