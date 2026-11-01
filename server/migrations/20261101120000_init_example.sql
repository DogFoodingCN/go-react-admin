-- +goose Up
-- Example schema only. Real business tables land with later requirements.

CREATE TABLE IF NOT EXISTS tenants (
    id           VARCHAR(64) PRIMARY KEY,
    name         VARCHAR(128) NOT NULL,
    status       VARCHAR(32)  NOT NULL DEFAULT 'active',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS demo_items (
    id           BIGSERIAL PRIMARY KEY,
    tenant_id    VARCHAR(64)  NOT NULL,
    title        VARCHAR(256) NOT NULL,
    remark       TEXT         NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_items_tenant ON demo_items (tenant_id);

-- +goose Down
DROP TABLE IF EXISTS demo_items;
DROP TABLE IF EXISTS tenants;
