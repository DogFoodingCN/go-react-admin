package bootstrap_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"go-react-admin/server/internal/bootstrap"
	"go-react-admin/server/internal/config"
)

func TestIAMMeWithDevToken(t *testing.T) {
	cfg := &config.Config{}
	cfg.Server.Mode = "release"
	cfg.Auth.JWTSecret = "test-secret"
	cfg.Auth.TokenTTLHours = 1
	cfg.CORS.AllowOrigins = []string{"http://localhost:5173"}

	r := bootstrap.NewRouter(cfg, nil) // nil holder → empty DB mode
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/v1/platform/iam/me", nil)
	req.Header.Set("Authorization", "Bearer dev-token")
	req.Header.Set("X-Tenant-Id", "tenant-x")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("code=%d body=%s", w.Code, w.Body.String())
	}

	var body struct {
		Code int `json:"code"`
		Data struct {
			UserID   string `json:"user_id"`
			TenantID string `json:"tenant_id"`
		} `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if body.Data.UserID != "user-dev" || body.Data.TenantID != "tenant-x" {
		t.Fatalf("body=%s", w.Body.String())
	}
}
