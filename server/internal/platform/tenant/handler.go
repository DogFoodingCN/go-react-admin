package tenant

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/shared/pagination"
	"go-react-admin/server/internal/shared/response"
)

type Handler struct{}

type item struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

// List returns example tenants. Replace with service/repo when requirements arrive.
func (h *Handler) List(c *gin.Context) {
	var q pagination.Query
	_ = c.ShouldBindQuery(&q)
	q.Normalize()

	list := []item{
		{ID: "tenant-demo", Name: "Demo 租户", Status: "active"},
	}
	response.OK(c, pagination.Result[item]{
		List:     list,
		Total:    int64(len(list)),
		Page:     q.Page,
		PageSize: q.PageSize,
	})
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("", h.List)
}
