package model

import "time"

// SysSetup stores the one-time platform initialization marker.
type SysSetup struct {
	ID            uint       `gorm:"primaryKey"`
	Completed     bool       `gorm:"not null;default:false"`
	CompletedAt   *time.Time `gorm:""`
	AdminUsername string     `gorm:"size:64"`
}

func (SysSetup) TableName() string { return "sys_setup" }

// PlatformUser is a platform-level account (super admin lives here).
type PlatformUser struct {
	ID           string    `gorm:"primaryKey;size:36"`
	Username     string    `gorm:"uniqueIndex;size:64;not null"`
	PasswordHash string    `gorm:"size:255;not null"`
	DisplayName  string    `gorm:"size:128"`
	Role         string    `gorm:"size:32;not null;default:super_admin"`
	CreatedAt    time.Time `gorm:""`
	UpdatedAt    time.Time `gorm:""`
}

func (PlatformUser) TableName() string { return "platform_users" }

// Tenant is an optional bootstrap tenant created during setup.
type Tenant struct {
	ID        string    `gorm:"primaryKey;size:36"`
	Name      string    `gorm:"size:128;not null"`
	Status    string    `gorm:"size:32;not null;default:active"`
	CreatedAt time.Time `gorm:""`
	UpdatedAt time.Time `gorm:""`
}

func (Tenant) TableName() string { return "tenants" }
