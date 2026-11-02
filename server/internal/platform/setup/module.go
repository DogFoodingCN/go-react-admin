package setup

import (
	"go-react-admin/server/internal/module"
	"go-react-admin/server/internal/platform/setup/handler"
	"go-react-admin/server/internal/platform/setup/repo"
	"go-react-admin/server/internal/platform/setup/service"
)

type Module struct {
	h   *handler.Handler
	Svc *service.Service
}

func NewModule(deps module.Deps) *Module {
	r := repo.New(deps.DBHolder)
	svc := service.New(deps.Config, deps.DBHolder, r)
	return &Module{
		h:   handler.New(svc),
		Svc: svc,
	}
}

func (m *Module) Name() string { return "platform.setup" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Public.Group("/setup"))
}
