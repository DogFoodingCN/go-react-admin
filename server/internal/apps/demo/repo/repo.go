package repo

import "gorm.io/gorm"

// Repo is a placeholder for demo persistence.
// Use db.WithTenant(gdb, tenantID) for all tenant-owned queries.
type Repo struct {
	db *gorm.DB
}

func New(db *gorm.DB) *Repo {
	return &Repo{db: db}
}

// Example: future List would look like:
//
//	func (r *Repo) List(tenantID string) ([]Model, error) {
//		var rows []Model
//		err := db.WithTenant(r.db, tenantID).Find(&rows).Error
//		return rows, err
//	}
