package bootstrap

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"go-react-admin/server/internal/apps/demo"
	"go-react-admin/server/internal/config"
	"go-react-admin/server/internal/module"
	platformApp "go-react-admin/server/internal/platform/app"
	platformAudit "go-react-admin/server/internal/platform/audit"
	platformAuth "go-react-admin/server/internal/platform/auth"
	platformIAM "go-react-admin/server/internal/platform/iam"
	platformSetup "go-react-admin/server/internal/platform/setup"
	platformTenant "go-react-admin/server/internal/platform/tenant"
	"go-react-admin/server/internal/shared/authjwt"
	"go-react-admin/server/internal/shared/db"
	"go-react-admin/server/internal/shared/middleware"
	"go-react-admin/server/internal/shared/response"
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
