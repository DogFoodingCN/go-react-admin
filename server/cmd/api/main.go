package main

import (
	"log/slog"
	"os"

	"go-react-admin/server/internal/bootstrap"
	"go-react-admin/server/internal/config"
	"go-react-admin/server/internal/shared/db"
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

	gdb, err := db.Open(cfg.Database.DSN)
	if err != nil {
		slog.Error("open database failed", "err", err)
		os.Exit(1)
	}

	router := bootstrap.NewRouter(bootstrap.Deps{Config: cfg, DB: gdb})
	slog.Info("api listening", "addr", cfg.Server.Addr)
	if err := router.Run(cfg.Server.Addr); err != nil {
		slog.Error("server stopped", "err", err)
		os.Exit(1)
	}
}
