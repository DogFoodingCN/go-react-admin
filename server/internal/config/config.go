package config

import (
	"fmt"
	"os"
	"strconv"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server   ServerConfig   `yaml:"server"`
	Database DatabaseConfig `yaml:"database"`
	Auth     AuthConfig     `yaml:"auth"`
	CORS     CORSConfig     `yaml:"cors"`

	// LocalConfigPath is the gitignored overlay used to persist DSN after setup.
	LocalConfigPath string `yaml:"-"`
}

type ServerConfig struct {
	Addr string `yaml:"addr"`
	Mode string `yaml:"mode"`
}

type DatabaseConfig struct {
	DSN string `yaml:"dsn"`
}

type AuthConfig struct {
	JWTSecret     string `yaml:"jwt_secret"`
	TokenTTLHours int    `yaml:"token_ttl_hours"`
}

type CORSConfig struct {
	AllowOrigins []string `yaml:"allow_origins"`
}

func Load(path string) (*Config, error) {
	cfg := defaultConfig()

	if path == "" {
		path = os.Getenv("GRA_CONFIG")
	}
	if path != "" {
		raw, err := os.ReadFile(path)
		if err != nil {
			return nil, fmt.Errorf("read config: %w", err)
		}
		if err := yaml.Unmarshal(raw, cfg); err != nil {
			return nil, fmt.Errorf("parse config: %w", err)
		}
	}

	cfg.LocalConfigPath = ResolveLocalPath(path)

	// Local overlay (gitignored) supplies DSN after first-time setup.
	if err := MergeLocalFile(cfg, cfg.LocalConfigPath); err != nil {
		return nil, err
	}

	applyEnv(cfg)
	return cfg, nil
}

func defaultConfig() *Config {
	return &Config{
		Server: ServerConfig{Addr: ":8080", Mode: "debug"},
		Auth: AuthConfig{
			JWTSecret:     "dev-secret-change-me",
			TokenTTLHours: 24,
		},
		CORS: CORSConfig{
			AllowOrigins: []string{"http://localhost:5173"},
		},
	}
}

func applyEnv(cfg *Config) {
	if v := os.Getenv("GRA_SERVER_ADDR"); v != "" {
		cfg.Server.Addr = v
	}
	if v := os.Getenv("GRA_SERVER_MODE"); v != "" {
		cfg.Server.Mode = v
	}
	if v := os.Getenv("GRA_DB_DSN"); v != "" {
		cfg.Database.DSN = v
	}
	if v := os.Getenv("GRA_JWT_SECRET"); v != "" {
		cfg.Auth.JWTSecret = v
	}
	if v := os.Getenv("GRA_TOKEN_TTL_HOURS"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			cfg.Auth.TokenTTLHours = n
		}
	}
}
