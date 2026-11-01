package repo

import "gorm.io/gorm"

// Repo will hold credential lookups. Empty stub for now.
type Repo struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Repo {
	return &Repo{db: db}
}
