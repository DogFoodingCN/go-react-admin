package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"Go-React-Admin/server/internal/platform/setup/dto"
	"Go-React-Admin/server/internal/platform/setup/service"
	"Go-React-Admin/server/internal/shared/response"
)

type Handler struct {
	svc *service.Service
}

func New(svc *service.Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) Status(c *gin.Context) {
	response.OK(c, h.svc.Status(c.Request.Context()))
}

func (h *Handler) TestConnection(c *gin.Context) {
	var req dto.TestConnectionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "dsn required")
		return
	}
	out, err := h.svc.TestConnection(c.Request.Context(), req)
	if err != nil {
		mapSetupErr(c, err)
		return
	}
	if out != nil && !out.OK {
		response.Fail(c, http.StatusBadRequest, 40000, out.Message)
		return
	}
	response.OK(c, out)
}

func (h *Handler) Initialize(c *gin.Context) {
	var req dto.InitializeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "dsn, admin_username and admin_password required")
		return
	}
	out, err := h.svc.Initialize(c.Request.Context(), req)
	if err != nil {
		mapSetupErr(c, err)
		return
	}
	response.OK(c, out)
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("/status", h.Status)
	r.POST("/test-connection", h.TestConnection)
	r.POST("/initialize", h.Initialize)
}

func mapSetupErr(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrAlreadyInitialized):
		response.Conflict(c, "setup already completed")
	case errors.Is(err, service.ErrWeakPassword),
		errors.Is(err, service.ErrInvalidDSN),
		errors.Is(err, service.ErrInvalidAdmin):
		response.BadRequest(c, err.Error())
	default:
		response.Fail(c, http.StatusBadRequest, 40000, err.Error())
	}
}
