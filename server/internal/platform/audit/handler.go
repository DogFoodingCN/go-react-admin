package audit

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/shared/pagination"
	"go-react-admin/server/internal/shared/response"
)

type Handler struct{}

// List placeholder audit logs.
func (h *Handler) List(c *gin.Context) {
	var q pagination.Query
	_ = c.ShouldBindQuery(&q)
	q.Normalize()

	response.OK(c, pagination.Result[gin.H]{
		List:     []gin.H{},
		Total:    0,
		Page:     q.Page,
		PageSize: q.PageSize,
	})
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("", h.List)
}
