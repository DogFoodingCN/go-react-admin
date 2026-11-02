package audit

import (
	"Go-React-Admin/server/internal/module"
	"Go-React-Admin/server/internal/platform/audit/handler"
	"Go-React-Admin/server/internal/platform/audit/repo"
	"Go-React-Admin/server/internal/platform/audit/service"
)

type Module struct {
	h *handler.Handler
}

func NewModule(deps module.Deps) *Module {
	r := repo.New(deps.DB)
	return &Module{h: handler.New(service.New(r))}
}

func (m *Module) Name() string { return "platform.audit" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Secured.Group("/platform/audit"))
}
