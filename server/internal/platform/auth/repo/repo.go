package repo

import (
	"context"
	"errors"

	"gorm.io/gorm"

	setupmodel "Go-React-Admin/server/internal/platform/setup/model"
	"Go-React-Admin/server/internal/shared/db"
)

// Repo looks up platform_users for login when the DB is available.
type Repo struct {
	holder *db.Holder
}

func New(holder *db.Holder) *Repo {
	return &Repo{holder: holder}
}

func (r *Repo) db() *gorm.DB {
	if r == nil || r.holder == nil {
		return nil
	}
	return r.holder.Get()
}

func (r *Repo) HasUsersTable() bool {
	gdb := r.db()
	if gdb == nil {
		return false
	}
	return gdb.Migrator().HasTable(&setupmodel.PlatformUser{})
}

func (r *Repo) CountUsers(ctx context.Context) (int64, error) {
	gdb := r.db()
	if gdb == nil || !r.HasUsersTable() {
		return 0, nil
	}
	var n int64
	err := gdb.WithContext(ctx).Model(&setupmodel.PlatformUser{}).Count(&n).Error
	return n, err
}

func (r *Repo) FindByUsername(ctx context.Context, username string) (*setupmodel.PlatformUser, error) {
	gdb := r.db()
	if gdb == nil || !r.HasUsersTable() {
		return nil, gorm.ErrRecordNotFound
	}
	var user setupmodel.PlatformUser
	err := gdb.WithContext(ctx).Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repo) FindDefaultTenantName(ctx context.Context) (id, name string, err error) {
	gdb := r.db()
	if gdb == nil || !gdb.Migrator().HasTable(&setupmodel.Tenant{}) {
		return "tenant-demo", "Demo 租户", nil
	}
	var t setupmodel.Tenant
	err = gdb.WithContext(ctx).Order("created_at asc").First(&t).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return "tenant-demo", "Demo 租户", nil
	}
	if err != nil {
		return "", "", err
	}
	return t.ID, t.Name, nil
}
