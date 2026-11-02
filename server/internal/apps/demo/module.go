package demo

import (
	"Go-React-Admin/server/internal/apps/demo/handler"
	"Go-React-Admin/server/internal/apps/demo/repo"
	"Go-React-Admin/server/internal/apps/demo/service"
	"Go-React-Admin/server/internal/module"
)

type Module struct {
	h *handler.Handler
}

func NewModule(deps module.Deps) *Module {
	r := repo.New(deps.DB)
	return &Module{h: handler.New(service.New(r))}
}

func (m *Module) Name() string { return "apps.demo" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Secured.Group("/apps/demo"))
}
