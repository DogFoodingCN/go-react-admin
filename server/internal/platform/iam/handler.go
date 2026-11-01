package iam

import (
	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/shared/response"
)

type Handler struct{}

// Me returns example profile + permission codes for the current user.
func (h *Handler) Me(c *gin.Context) {
	response.OK(c, gin.H{
		"permissions": []string{
			"platform:tenant:read",
			"platform:app:read",
			"demo:item:read",
		},
		"note": "example only; replace with IAM service",
	})
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("/me", h.Me)
}
