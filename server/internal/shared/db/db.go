package db

import (
	"fmt"
	"log/slog"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Open connects to PostgreSQL. Empty DSN means "no database" mode for stub APIs.
func Open(dsn string) (*gorm.DB, error) {
	if dsn == "" {
		slog.Warn("database dsn empty: running without DB (example handlers use stubs)")
		return nil, nil
	}

	gdb, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}
	return gdb, nil
}

// WithTenant returns a session that scopes queries by tenant_id.
// Callers must use this for tenant-owned tables once real repos are implemented.
func WithTenant(gdb *gorm.DB, tenantID string) *gorm.DB {
	if gdb == nil {
		return nil
	}
	return gdb.Where("tenant_id = ?", tenantID)
}
