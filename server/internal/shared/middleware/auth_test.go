package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	"Go-React-Admin/server/internal/shared/authjwt"
	apctx "Go-React-Admin/server/internal/shared/ctx"
	"Go-React-Admin/server/internal/shared/middleware"
	"Go-React-Admin/server/internal/shared/response"
)

func TestAuthJWTDevToken(t *testing.T) {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(middleware.AuthJWT(authjwt.NewManager("secret", 1)))
	r.GET("/me", func(c *gin.Context) {
		ctx := c.Request.Context()
		response.OK(c, gin.H{
			"user_id": apctx.UserID(ctx),
			"tenant_id": apctx.TenantID(ctx),
		})
	})
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/me", nil)
	req.Header.Set("Authorization", "Bearer dev-token")
	req.Header.Set("X-Tenant-Id", "tenant-x")
	r.ServeHTTP(w, req)
	t.Log(w.Body.String())
	if w.Code != 200 {
		t.Fatalf("code=%d body=%s", w.Code, w.Body.String())
	}
}
