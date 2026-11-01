package ctx

import "context"

type key int

const (
	keyUserID key = iota + 1
	keyUserName
	keyTenantID
)

func WithUser(parent context.Context, userID, userName string) context.Context {
	ctx := context.WithValue(parent, keyUserID, userID)
	return context.WithValue(ctx, keyUserName, userName)
}

func WithTenant(parent context.Context, tenantID string) context.Context {
	return context.WithValue(parent, keyTenantID, tenantID)
}

func UserID(ctx context.Context) string {
	v, _ := ctx.Value(keyUserID).(string)
	return v
}

func UserName(ctx context.Context) string {
	v, _ := ctx.Value(keyUserName).(string)
	return v
}

func TenantID(ctx context.Context) string {
	v, _ := ctx.Value(keyTenantID).(string)
	return v
}
