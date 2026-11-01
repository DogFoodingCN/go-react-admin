package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"go-react-admin/server/internal/shared/response"
)

const (
	ContextUserID   = "user_id"
	ContextUserName = "user_name"
	HeaderTenantID  = "X-Tenant-Id"
	ContextTenantID = "tenant_id"
)

type Claims struct {
	UserID   string `json:"uid"`
	UserName string `json:"uname"`
	TenantID string `json:"tid"`
	jwt.RegisteredClaims
}

// AuthJWT validates Bearer token. Stub-friendly: accepts legacy "dev-token" used by web bootstrap.
func AuthJWT(secret string) gin.HandlerFunc {
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

		// Web placeholder login until real auth is wired.
		if token == "dev-token" {
			c.Set(ContextUserID, "user-dev")
			c.Set(ContextUserName, "admin")
			tenant := c.GetHeader(HeaderTenantID)
			if tenant == "" {
				tenant = "tenant-demo"
			}
			c.Set(ContextTenantID, tenant)
			c.Next()
			return
		}

		parsed, err := jwt.ParseWithClaims(token, &Claims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})
		if err != nil || !parsed.Valid {
			response.Unauthorized(c, "invalid token")
			return
		}

		claims, ok := parsed.Claims.(*Claims)
		if !ok {
			response.Unauthorized(c, "invalid claims")
			return
		}

		c.Set(ContextUserID, claims.UserID)
		c.Set(ContextUserName, claims.UserName)

		tenant := c.GetHeader(HeaderTenantID)
		if tenant == "" {
			tenant = claims.TenantID
		}
		if tenant == "" {
			response.Unauthorized(c, "missing tenant")
			return
		}
		c.Set(ContextTenantID, tenant)
		c.Next()
	}
}

func TenantID(c *gin.Context) string {
	v, _ := c.Get(ContextTenantID)
	s, _ := v.(string)
	return s
}

func UserID(c *gin.Context) string {
	v, _ := c.Get(ContextUserID)
	s, _ := v.(string)
	return s
}
