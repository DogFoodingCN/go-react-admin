package handler

import (
	"errors"

	"github.com/gin-gonic/gin"

	"Go-React-Admin/server/internal/platform/tenant/dto"
	"Go-React-Admin/server/internal/platform/tenant/repo"
	"Go-React-Admin/server/internal/platform/tenant/service"
	"Go-React-Admin/server/internal/shared/pagination"
	"Go-React-Admin/server/internal/shared/response"
)

type Handler struct {
	svc *service.Service
}

func New(svc *service.Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) List(c *gin.Context) {
	var q pagination.Query
	_ = c.ShouldBindQuery(&q)
	q.Normalize()

	list, err := h.svc.List(c.Request.Context())
	if err != nil {
		response.Internal(c, "list tenants failed")
		return
	}
	response.OK(c, pagination.Result[dto.Item]{
		List:     list,
		Total:    int64(len(list)),
		Page:     q.Page,
		PageSize: q.PageSize,
	})
}

func (h *Handler) Get(c *gin.Context) {
	item, err := h.svc.Get(c.Request.Context(), c.Param("id"))
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			response.NotFound(c, "tenant not found")
			return
		}
		response.Internal(c, "get tenant failed")
		return
	}
	response.OK(c, item)
}

func (h *Handler) Create(c *gin.Context) {
	var req dto.CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "name required")
		return
	}
	item, err := h.svc.Create(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidInput) {
			response.BadRequest(c, err.Error())
			return
		}
		response.Internal(c, "create tenant failed")
		return
	}
	response.OK(c, item)
}

func (h *Handler) Update(c *gin.Context) {
	var req dto.UpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "name and status required")
		return
	}
	item, err := h.svc.Update(c.Request.Context(), c.Param("id"), req)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			response.NotFound(c, "tenant not found")
			return
		}
		if errors.Is(err, service.ErrInvalidInput) {
			response.BadRequest(c, err.Error())
			return
		}
		response.Internal(c, "update tenant failed")
		return
	}
	response.OK(c, item)
}

func (h *Handler) Register(r gin.IRoutes) {
	r.GET("", h.List)
	r.POST("", h.Create)
	r.GET("/:id", h.Get)
	r.PATCH("/:id", h.Update)
}
