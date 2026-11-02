package model

import "time"

// Tenant maps to the shared tenants table (also used by setup bootstrap).
type Tenant struct {
	ID        string    `gorm:"primaryKey;size:36"`
	Name      string    `gorm:"size:128;not null"`
	Status    string    `gorm:"size:32;not null;default:active"`
	CreatedAt time.Time `gorm:""`
	UpdatedAt time.Time `gorm:""`
}

func (Tenant) TableName() string { return "tenants" }
