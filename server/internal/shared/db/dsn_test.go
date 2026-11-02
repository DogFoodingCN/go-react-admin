package db

import (
	"strings"
	"testing"
)

func TestExtractDBName_libpq(t *testing.T) {
	t.Parallel()
	dsn := `host=127.0.0.1 port=5432 user=gra password=secret dbname=gra_admin sslmode=disable`
	got, err := ExtractDBName(dsn)
	if err != nil {
		t.Fatal(err)
	}
	if got != "gra_admin" {
		t.Fatalf("got %q", got)
	}
}

func TestExtractDBName_url(t *testing.T) {
	t.Parallel()
	dsn := `postgres://gra:secret@127.0.0.1:5432/gra_admin?sslmode=disable`
	got, err := ExtractDBName(dsn)
	if err != nil {
		t.Fatal(err)
	}
	if got != "gra_admin" {
		t.Fatalf("got %q", got)
	}
}

func TestWithDBName_libpq(t *testing.T) {
	t.Parallel()
	dsn := `host=127.0.0.1 user=gra password=x dbname=gra_admin sslmode=disable`
	got, err := WithDBName(dsn, "postgres")
	if err != nil {
		t.Fatal(err)
	}
	name, err := ExtractDBName(got)
	if err != nil {
		t.Fatal(err)
	}
	if name != "postgres" {
		t.Fatalf("rewritten dsn dbname=%q, full=%q", name, got)
	}
	for _, part := range []string{"host=127.0.0.1", "user=gra", "sslmode=disable"} {
		if !strings.Contains(got, part) {
			t.Fatalf("lost %q in %q", part, got)
		}
	}
}

func TestWithDBName_url(t *testing.T) {
	t.Parallel()
	dsn := `postgres://gra:secret@127.0.0.1:5432/gra_admin?sslmode=disable`
	got, err := WithDBName(dsn, "postgres")
	if err != nil {
		t.Fatal(err)
	}
	name, err := ExtractDBName(got)
	if err != nil {
		t.Fatal(err)
	}
	if name != "postgres" {
		t.Fatalf("got path db=%q full=%q", name, got)
	}
}

func TestQuoteIdent(t *testing.T) {
	t.Parallel()
	if quoteIdent(`a"b`) != `"a""b"` {
		t.Fatal(quoteIdent(`a"b`))
	}
}

func TestIsSystemDatabase(t *testing.T) {
	t.Parallel()
	if !isSystemDatabase("postgres") || !isSystemDatabase("Template1") {
		t.Fatal("expected system dbs")
	}
	if isSystemDatabase("gra_admin") {
		t.Fatal("gra_admin should not be system")
	}
}
