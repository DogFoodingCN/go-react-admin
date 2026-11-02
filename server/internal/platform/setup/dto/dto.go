package dto

// StatusResponse is returned by GET /setup/status.
type StatusResponse struct {
	State             string `json:"state"` // need_setup | ready | db_unreachable
	Initialized       bool   `json:"initialized"`
	DSNPersisted      bool   `json:"dsn_persisted"`
	DBReachable       bool   `json:"db_reachable"`
	MigrationsPending bool   `json:"migrations_pending"`
	HasAdmin          bool   `json:"has_admin"`
	Message           string `json:"message,omitempty"`
}

type TestConnectionRequest struct {
	DSN string `json:"dsn" binding:"required"`
}

type TestConnectionResponse struct {
	OK      bool   `json:"ok"`
	Message string `json:"message,omitempty"`
}

type InitializeRequest struct {
	DSN                 string `json:"dsn" binding:"required"`
	AdminUsername       string `json:"admin_username" binding:"required"`
	AdminPassword       string `json:"admin_password" binding:"required"`
	AdminDisplayName    string `json:"admin_display_name"`
	BootstrapTenantName string `json:"bootstrap_tenant_name"`
}

type InitializeResponse struct {
	Initialized bool   `json:"initialized"`
	Message     string `json:"message"`
}
