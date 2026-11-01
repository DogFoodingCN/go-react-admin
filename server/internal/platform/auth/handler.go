package auth

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"go-react-admin/server/internal/shared/middleware"
	"go-react-admin/server/internal/shared/response"
)

type Handler struct {
	JWTSecret string
	TTLHours  int
}

type loginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type loginResp struct {
	Token      string `json:"token"`
	UserName   string `json:"user_name"`
	TenantID   string `json:"tenant_id"`
	TenantName string `json:"tenant_name"`
	Note       string `json:"note"`
}

// Login is an example endpoint. Replace with real credential checks later.
func (h *Handler) Login(c *gin.Context) {
	var req loginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "username and password required")
		return
	}

	ttl := h.TTLHours
	if ttl <= 0 {
		ttl = 24
	}

	claims := middleware.Claims{
		UserID:   "user-" + req.Username,
		UserName: req.Username,
		TenantID: "tenant-demo",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(ttl) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(h.JWTSecret))
	if err != nil {
		response.Internal(c, "sign token failed")
		return
	}

	response.OK(c, loginResp{
		Token:      signed,
		UserName:   req.Username,
		TenantID:   "tenant-demo",
		TenantName: "Demo 租户",
		Note:       "example login only; wire IAM later",
	})
}

func (h *Handler) Register(r gin.IRoutes) {
	r.POST("/login", h.Login)
}
