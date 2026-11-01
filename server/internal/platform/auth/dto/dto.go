package dto

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResult struct {
	Token      string `json:"token"`
	UserName   string `json:"user_name"`
	TenantID   string `json:"tenant_id"`
	TenantName string `json:"tenant_name"`
	Note       string `json:"note"`
}
