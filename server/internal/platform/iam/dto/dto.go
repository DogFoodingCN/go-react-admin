package dto

type Me struct {
	UserID      string   `json:"user_id"`
	UserName    string   `json:"user_name"`
	TenantID    string   `json:"tenant_id"`
	Permissions []string `json:"permissions"`
	Note        string   `json:"note"`
}
