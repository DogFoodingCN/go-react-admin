package app

import (
	"Go-React-Admin/server/internal/module"
	"Go-React-Admin/server/internal/platform/app/handler"
	"Go-React-Admin/server/internal/platform/app/repo"
	"Go-React-Admin/server/internal/platform/app/service"
)

type Module struct {
	h *handler.Handler
}

func NewModule(deps module.Deps) *Module {
	r := repo.New(deps.DB)
	return &Module{h: handler.New(service.New(r))}
}

func (m *Module) Name() string { return "platform.app" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Secured.Group("/platform/apps"))
}
