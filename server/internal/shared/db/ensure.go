package db

import (
	"fmt"
	"log/slog"
	"strings"

	"gorm.io/gorm"
)

// OpenEnsuring connects with dsn. If the target database is missing, it connects
// to the maintenance DB (postgres), CREATE DATABASE, then opens the original DSN.
// created=true when a new database was created in this call.
//
// Intended for Setup test-connection / initialize only — not process boot Open().
func OpenEnsuring(dsn string) (gdb *gorm.DB, created bool, err error) {
	dsn = strings.TrimSpace(dsn)
	if dsn == "" {
		return nil, false, fmt.Errorf("empty dsn")
	}

	created, err = EnsureDatabase(dsn)
	if err != nil {
		return nil, false, err
	}

	gdb, err = Open(dsn)
	if err != nil {
		return nil, created, err
	}
	if gdb == nil {
		return nil, created, fmt.Errorf("open returned nil db")
	}
	if err := Ping(gdb); err != nil {
		_ = Close(gdb)
		return nil, created, err
	}
	return gdb, created, nil
}

// EnsureDatabase creates the database named in dsn when it does not exist.
// No-op when dbname is empty or a system database (postgres / template0 / template1).
func EnsureDatabase(dsn string) (created bool, err error) {
	name, err := ExtractDBName(dsn)
	if err != nil {
		return false, err
	}
	name = strings.TrimSpace(name)
	if name == "" {
		return false, fmt.Errorf("dsn missing dbname/database")
	}
	if isSystemDatabase(name) {
		return false, nil
	}

	adminDSN, err := WithDBName(dsn, "postgres")
	if err != nil {
		return false, fmt.Errorf("build maintenance dsn: %w", err)
	}

	admin, err := Open(adminDSN)
	if err != nil {
		// Fallback: some installs revoke connect on postgres; try template1.
		adminDSN, err2 := WithDBName(dsn, "template1")
		if err2 != nil {
			return false, fmt.Errorf("connect maintenance db (postgres): %w", err)
		}
		admin, err = Open(adminDSN)
		if err != nil {
			return false, fmt.Errorf("connect maintenance db (postgres/template1): %w", err)
		}
	}
	defer func() { _ = Close(admin) }()

	var exists bool
	if err := admin.Raw(`SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = ?)`, name).Scan(&exists).Error; err != nil {
		return false, fmt.Errorf("check database exists: %w", err)
	}
	if exists {
		return false, nil
	}

	// CREATE DATABASE cannot run inside a transaction / prepared statement with params for the name.
	sql := "CREATE DATABASE " + quoteIdent(name)
	if err := admin.Exec(sql).Error; err != nil {
		return false, fmt.Errorf("create database %q: %w", name, err)
	}
	slog.Info("created missing postgres database", "database", name)
	return true, nil
}
