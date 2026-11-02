package config

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

const defaultLocalConfigPath = "configs/config.local.yaml"

// ResolveLocalPath returns the gitignored local overlay next to the base config file.
func ResolveLocalPath(baseConfigPath string) string {
	if baseConfigPath == "" {
		return defaultLocalConfigPath
	}
	dir := filepath.Dir(baseConfigPath)
	return filepath.Join(dir, "config.local.yaml")
}

// MergeLocalFile overlays database.dsn (and future local-only keys) from config.local.yaml.
// Missing file is ignored.
func MergeLocalFile(cfg *Config, localPath string) error {
	if localPath == "" {
		localPath = defaultLocalConfigPath
	}
	raw, err := os.ReadFile(localPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("read local config: %w", err)
	}
	var overlay Config
	if err := yaml.Unmarshal(raw, &overlay); err != nil {
		return fmt.Errorf("parse local config: %w", err)
	}
	if overlay.Database.DSN != "" {
		cfg.Database.DSN = overlay.Database.DSN
	}
	return nil
}

// PersistDSN writes database.dsn into config.local.yaml (gitignored).
func PersistDSN(localPath, dsn string) error {
	if localPath == "" {
		localPath = defaultLocalConfigPath
	}
	if err := os.MkdirAll(filepath.Dir(localPath), 0o755); err != nil {
		return fmt.Errorf("mkdir local config: %w", err)
	}

	payload := map[string]any{
		"database": map[string]string{
			"dsn": dsn,
		},
	}
	raw, err := yaml.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal local config: %w", err)
	}
	if err := os.WriteFile(localPath, raw, 0o600); err != nil {
		return fmt.Errorf("write local config: %w", err)
	}
	return nil
}

// LocalDSNPersisted reports whether a local overlay file with a non-empty DSN exists.
func LocalDSNPersisted(localPath string) bool {
	if localPath == "" {
		localPath = defaultLocalConfigPath
	}
	raw, err := os.ReadFile(localPath)
	if err != nil {
		return false
	}
	var overlay Config
	if err := yaml.Unmarshal(raw, &overlay); err != nil {
		return false
	}
	return overlay.Database.DSN != ""
}
