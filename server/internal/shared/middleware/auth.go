package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"

	"Go-React-Admin/server/internal/shared/authjwt"
	apctx "Go-React-Admin/server/internal/shared/ctx"
	"Go-React-Admin/server/internal/shared/response"
)

const HeaderTenantID = "X-Tenant-Id"

// AuthJWT validates Bearer token and injects user/tenant into request context.
// Stub-friendly: accepts web bootstrap token "dev-token".
func AuthJWT(jwtMgr *authjwt.Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			response.Unauthorized(c, "missing authorization")
			return
		}

		token := strings.TrimSpace(strings.TrimPrefix(header, "Bearer"))
		token = strings.TrimSpace(token)
		if token == "" {
			response.Unauthorized(c, "invalid authorization")
			return
		}

		var (
			userID   string
			userName string
			tenantID string
		)

		if token == "dev-token" {
			userID = "user-dev"
			userName = "admin"
			tenantID = c.GetHeader(HeaderTenantID)
			if tenantID == "" {
				tenantID = "tenant-demo"
			}
		} else {
			claims, err := jwtMgr.Parse(token)
			if err != nil {
				response.Unauthorized(c, "invalid token")
				return
			}
			userID = claims.UserID
			userName = claims.UserName
			tenantID = c.GetHeader(HeaderTenantID)
			if tenantID == "" {
				tenantID = claims.TenantID
			}
			if tenantID == "" {
				response.Unauthorized(c, "missing tenant")
				return
			}
		}

		ctx := apctx.WithUser(c.Request.Context(), userID, userName)
		ctx = apctx.WithTenant(ctx, tenantID)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}
