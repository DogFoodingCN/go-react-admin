package tenant

import (
	"Go-React-Admin/server/internal/module"
	"Go-React-Admin/server/internal/platform/tenant/handler"
	"Go-React-Admin/server/internal/platform/tenant/repo"
	"Go-React-Admin/server/internal/platform/tenant/service"
)

type Module struct {
	h *handler.Handler
}

func NewModule(deps module.Deps) *Module {
	r := repo.New(deps.DB)
	svc := service.New(r)
	return &Module{h: handler.New(svc)}
}

func (m *Module) Name() string { return "platform.tenant" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Secured.Group("/platform/tenants"))
}
