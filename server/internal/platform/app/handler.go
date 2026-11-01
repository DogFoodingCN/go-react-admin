package app

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/shared/response"
)

type Handler struct{}

type item struct {
	Code    string `json:"code"`
	Name    string `json:"name"`
	Enabled bool   `json:"enabled"`
}

// List example apps bound to current tenant context.
func (h *Handler) List(c *gin.Context) {
	response.OK(c, []item{
		{Code: "demo", Name: "Demo 应用", Enabled: true},
	})
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("", h.List)
}
