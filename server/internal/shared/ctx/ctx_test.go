package ctx_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	apctx "Go-React-Admin/server/internal/shared/ctx"
)

func TestWithUserTenant(t *testing.T) {
	ctx := context.Background()
	ctx = apctx.WithUser(ctx, "u1", "n1")
	ctx = apctx.WithTenant(ctx, "t1")
	if apctx.UserID(ctx) != "u1" || apctx.UserName(ctx) != "n1" || apctx.TenantID(ctx) != "t1" {
		t.Fatalf("got %q %q %q", apctx.UserID(ctx), apctx.UserName(ctx), apctx.TenantID(ctx))
	}
}

func TestGinRequestContext(t *testing.T) {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(func(c *gin.Context) {
		ctx := apctx.WithUser(c.Request.Context(), "user-dev", "admin")
		ctx = apctx.WithTenant(ctx, "tenant-x")
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	})
	r.GET("/t", func(c *gin.Context) {
		ctx := c.Request.Context()
		c.JSON(200, gin.H{"uid": apctx.UserID(ctx), "tid": apctx.TenantID(ctx)})
	})
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/t", nil)
	r.ServeHTTP(w, req)
	body := w.Body.String()
	if body != `{"tid":"tenant-x","uid":"user-dev"}` && body != `{"uid":"user-dev","tid":"tenant-x"}` {
		t.Fatalf("body=%s", body)
	}
}
