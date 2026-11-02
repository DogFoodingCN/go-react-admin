package db

import (
	"sync"

	"gorm.io/gorm"
)

// Holder is a process-wide mutable *gorm.DB reference.
// Setup initialize can Replace after first-time provisioning without restart.
type Holder struct {
	mu sync.RWMutex
	db *gorm.DB
}

func NewHolder(gdb *gorm.DB) *Holder {
	return &Holder{db: gdb}
}

func (h *Holder) Get() *gorm.DB {
	if h == nil {
		return nil
	}
	h.mu.RLock()
	defer h.mu.RUnlock()
	return h.db
}

// Replace swaps the live DB handle. Callers should Close the previous SQL DB if needed.
func (h *Holder) Replace(gdb *gorm.DB) {
	if h == nil {
		return
	}
	h.mu.Lock()
	defer h.mu.Unlock()
	h.db = gdb
}
