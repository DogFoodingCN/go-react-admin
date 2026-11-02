package repo

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"Go-React-Admin/server/internal/platform/setup/model"
	"Go-React-Admin/server/internal/shared/db"
)

type Repo struct {
	holder *db.Holder
}

func New(holder *db.Holder) *Repo {
	return &Repo{holder: holder}
}

func (r *Repo) DB() *gorm.DB {
	if r == nil || r.holder == nil {
		return nil
	}
	return r.holder.Get()
}

func (r *Repo) TablesReady(gdb *gorm.DB) bool {
	if gdb == nil {
		return false
	}
	return gdb.Migrator().HasTable(&model.SysSetup{}) &&
		gdb.Migrator().HasTable(&model.PlatformUser{})
}

func (r *Repo) AutoMigrate(gdb *gorm.DB) error {
	if gdb == nil {
		return errors.New("database is nil")
	}
	return gdb.AutoMigrate(&model.SysSetup{}, &model.PlatformUser{}, &model.Tenant{})
}

func (r *Repo) SetupCompleted(ctx context.Context, gdb *gorm.DB) (bool, error) {
	if gdb == nil || !gdb.Migrator().HasTable(&model.SysSetup{}) {
		return false, nil
	}
	var row model.SysSetup
	err := gdb.WithContext(ctx).Where("completed = ?", true).First(&row).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return row.Completed, nil
}

func (r *Repo) HasAdmin(ctx context.Context, gdb *gorm.DB) (bool, error) {
	if gdb == nil || !gdb.Migrator().HasTable(&model.PlatformUser{}) {
		return false, nil
	}
	var count int64
	if err := gdb.WithContext(ctx).Model(&model.PlatformUser{}).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *Repo) FindUserByUsername(ctx context.Context, gdb *gorm.DB, username string) (*model.PlatformUser, error) {
	if gdb == nil || !gdb.Migrator().HasTable(&model.PlatformUser{}) {
		return nil, gorm.ErrRecordNotFound
	}
	var user model.PlatformUser
	err := gdb.WithContext(ctx).Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repo) SeedInitialize(ctx context.Context, gdb *gorm.DB, user model.PlatformUser, tenant *model.Tenant, setup model.SysSetup) error {
	return gdb.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if tenant != nil {
			if err := tx.Create(tenant).Error; err != nil {
				return err
			}
		}
		if err := tx.Create(&user).Error; err != nil {
			return err
		}
		if err := tx.Create(&setup).Error; err != nil {
			return err
		}
		return nil
	})
}
