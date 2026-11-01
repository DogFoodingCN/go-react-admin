package audit

import (
	"go-react-admin/server/internal/module"
	"go-react-admin/server/internal/platform/audit/handler"
	"go-react-admin/server/internal/platform/audit/repo"
	"go-react-admin/server/internal/platform/audit/service"
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
