package iam

import (
	"go-react-admin/server/internal/module"
	"go-react-admin/server/internal/platform/iam/handler"
	"go-react-admin/server/internal/platform/iam/repo"
	"go-react-admin/server/internal/platform/iam/service"
)

type Module struct {
	h *handler.Handler
}

func NewModule(deps module.Deps) *Module {
	r := repo.New(deps.DB)
	return &Module{h: handler.New(service.New(r))}
}

func (m *Module) Name() string { return "platform.iam" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Secured.Group("/platform/iam"))
}
