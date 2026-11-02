package bootstrap

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"Go-React-Admin/server/internal/apps/demo"
	"Go-React-Admin/server/internal/config"
	"Go-React-Admin/server/internal/module"
	platformApp "Go-React-Admin/server/internal/platform/app"
	platformAudit "Go-React-Admin/server/internal/platform/audit"
	platformAuth "Go-React-Admin/server/internal/platform/auth"
	platformIAM "Go-React-Admin/server/internal/platform/iam"
	platformSetup "Go-React-Admin/server/internal/platform/setup"
	platformTenant "Go-React-Admin/server/internal/platform/tenant"
	"Go-React-Admin/server/internal/shared/authjwt"
	"Go-React-Admin/server/internal/shared/db"
	"Go-React-Admin/server/internal/shared/middleware"
	"Go-React-Admin/server/internal/shared/response"
)

func NewRouter(cfg *config.Config, holder *db.Holder) *gin.Engine {
	if holder == nil {
		holder = db.NewHolder(nil)
	}
	gdb := holder.Get()

	gin.SetMode(cfg.Server.Mode)
	r := gin.New()
	r.Use(gin.Recovery(), middleware.RequestID(), middleware.CORS(cfg.CORS.AllowOrigins))

	r.GET("/healthz", func(c *gin.Context) {
		response.OK(c, gin.H{"status": "up", "database": holder.Get() != nil})
	})

	deps := module.Deps{
		Config:   cfg,
		DB:       gdb,
		DBHolder: holder,
		JWT:      authjwt.NewManager(cfg.Auth.JWTSecret, cfg.Auth.TokenTTLHours),
	}

	api := r.Group("/api/v1")
	mp := module.MountPoints{
		Public:  api.Group(""),
		Secured: api.Group(""),
	}
	mp.Secured.Use(middleware.AuthJWT(deps.JWT))

	modules := []module.Module{
		platformSetup.NewModule(deps),
		platformAuth.NewModule(deps),
		platformTenant.NewModule(deps),
		platformApp.NewModule(deps),
		platformIAM.NewModule(deps),
		platformAudit.NewModule(deps),
		demo.NewModule(deps),
	}

	names := make([]string, 0, len(modules))
	for _, m := range modules {
		m.RegisterHTTP(mp, deps)
		names = append(names, m.Name())
	}

	r.NoRoute(func(c *gin.Context) {
		response.Fail(c, http.StatusNotFound, 40400, "route not found")
	})

	slog.Info("modules registered", "modules", names, "db", gdb != nil)
	return r
}
