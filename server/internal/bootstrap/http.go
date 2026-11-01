package bootstrap

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	demoHandler "go-react-admin/server/internal/apps/demo/handler"
	demoService "go-react-admin/server/internal/apps/demo/service"
	"go-react-admin/server/internal/config"
	platformApp "go-react-admin/server/internal/platform/app"
	platformAudit "go-react-admin/server/internal/platform/audit"
	platformAuth "go-react-admin/server/internal/platform/auth"
	platformIAM "go-react-admin/server/internal/platform/iam"
	platformTenant "go-react-admin/server/internal/platform/tenant"
	"go-react-admin/server/internal/shared/middleware"
	"go-react-admin/server/internal/shared/response"
)

type Deps struct {
	Config *config.Config
	DB     *gorm.DB
}

func NewRouter(deps Deps) *gin.Engine {
	gin.SetMode(deps.Config.Server.Mode)
	r := gin.New()
	r.Use(gin.Recovery(), middleware.RequestID(), middleware.CORS(deps.Config.CORS.AllowOrigins))

	r.GET("/healthz", func(c *gin.Context) {
		dbOK := deps.DB != nil
		response.OK(c, gin.H{
			"status":   "up",
			"database": dbOK,
		})
	})

	api := r.Group("/api/v1")

	authH := &platformAuth.Handler{
		JWTSecret: deps.Config.Auth.JWTSecret,
		TTLHours:  deps.Config.Auth.TokenTTLHours,
	}
	authH.Register(api.Group("/auth"))

	secured := api.Group("")
	secured.Use(middleware.AuthJWT(deps.Config.Auth.JWTSecret))

	(&platformTenant.Handler{}).Register(secured.Group("/platform/tenants"))
	(&platformApp.Handler{}).Register(secured.Group("/platform/apps"))
	(&platformIAM.Handler{}).Register(secured.Group("/platform/iam"))
	(&platformAudit.Handler{}).Register(secured.Group("/platform/audit"))

	demoH := demoHandler.New(demoService.New())
	demoH.Register(secured.Group("/apps/demo"))

	r.NoRoute(func(c *gin.Context) {
		response.Fail(c, http.StatusNotFound, 40400, "route not found")
	})

	slog.Info("routes registered", "db", deps.DB != nil)
	return r
}
