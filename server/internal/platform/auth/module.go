package auth

import (
	"go-react-admin/server/internal/module"
	"go-react-admin/server/internal/platform/auth/handler"
	"go-react-admin/server/internal/platform/auth/repo"
	"go-react-admin/server/internal/platform/auth/service"
)

type Module struct {
	h *handler.Handler
}

func NewModule(deps module.Deps) *Module {
	r := repo.New(deps.DBHolder)
	svc := service.New(deps.JWT, r)
	return &Module{h: handler.New(svc)}
}

func (m *Module) Name() string { return "platform.auth" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Public.Group("/auth"))
}
