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
	_ = repo.New(deps.DB) // wired for future credential store
	svc := service.New(deps.JWT)
	return &Module{h: handler.New(svc)}
}

func (m *Module) Name() string { return "platform.auth" }

func (m *Module) RegisterHTTP(mp module.MountPoints, _ module.Deps) {
	m.h.Register(mp.Public.Group("/auth"))
}
