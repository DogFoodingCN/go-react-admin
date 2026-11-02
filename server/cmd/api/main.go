package main

import (
	"log/slog"
	"os"

	"Go-React-Admin/server/internal/bootstrap"
	"Go-React-Admin/server/internal/config"
	"Go-React-Admin/server/internal/shared/db"
)

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})))

	cfgPath := ""
	if len(os.Args) > 1 {
		cfgPath = os.Args[1]
	}

	cfg, err := config.Load(cfgPath)
	if err != nil {
		slog.Error("load config failed", "err", err)
		os.Exit(1)
	}

	// Empty DSN is allowed: Open returns nil and setup wizard can provision later.
	// config.Load already merges configs/config.local.yaml when present.
	gdb, err := db.Open(cfg.Database.DSN)
	if err != nil {
		slog.Error("open database failed", "err", err)
		os.Exit(1)
	}

	holder := db.NewHolder(gdb)
	router := bootstrap.NewRouter(cfg, holder)
	slog.Info("api listening", "addr", cfg.Server.Addr, "dsn_configured", cfg.Database.DSN != "")
	if err := router.Run(cfg.Server.Addr); err != nil {
		slog.Error("server stopped", "err", err)
		os.Exit(1)
	}
}
