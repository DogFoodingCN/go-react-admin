package module

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"Go-React-Admin/server/internal/config"
	"Go-React-Admin/server/internal/shared/authjwt"
	"Go-React-Admin/server/internal/shared/db"
)

// Deps is the shared runtime dependency bag for HTTP modules.
type Deps struct {
	Config   *config.Config
	DB       *gorm.DB // snapshot at boot; prefer DBHolder.Get() for live handle
	DBHolder *db.Holder
	JWT      *authjwt.Manager
}

// MountPoints separates public and authenticated route groups under /api/v1.
type MountPoints struct {
	Public  *gin.RouterGroup
	Secured *gin.RouterGroup
}

// Module is a self-contained platform or app feature pack.
type Module interface {
	Name() string
	RegisterHTTP(mp MountPoints, deps Deps)
}
