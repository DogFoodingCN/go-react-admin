package db

import (
	"fmt"
	"net/url"
	"regexp"
	"strings"
)

// Matches libpq keyword assignments, including single-quoted values.
var kvPair = regexp.MustCompile(`(?i)(^|\s)(dbname|database)\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s]+))`)

var systemDatabases = map[string]struct{}{
	"postgres":  {},
	"template0": {},
	"template1": {},
}

// ExtractDBName returns the database name from a PostgreSQL URL or libpq keyword DSN.
func ExtractDBName(dsn string) (string, error) {
	dsn = strings.TrimSpace(dsn)
	if dsn == "" {
		return "", fmt.Errorf("empty dsn")
	}
	if strings.Contains(dsn, "://") {
		u, err := url.Parse(dsn)
		if err != nil {
			return "", fmt.Errorf("parse dsn url: %w", err)
		}
		name := strings.TrimPrefix(u.Path, "/")
		if i := strings.IndexByte(name, '/'); i >= 0 {
			name = name[:i]
		}
		if unesc, err := url.PathUnescape(name); err == nil {
			name = unesc
		}
		return name, nil
	}
	m := kvPair.FindStringSubmatch(dsn)
	if m == nil {
		return "", nil
	}
	for _, g := range m[3:] {
		if g != "" {
			return g, nil
		}
	}
	return "", nil
}

// WithDBName returns a DSN pointing at newDB, preserving other connection params.
func WithDBName(dsn, newDB string) (string, error) {
	dsn = strings.TrimSpace(dsn)
	newDB = strings.TrimSpace(newDB)
	if dsn == "" {
		return "", fmt.Errorf("empty dsn")
	}
	if newDB == "" {
		return "", fmt.Errorf("empty database name")
	}

	if strings.Contains(dsn, "://") {
		u, err := url.Parse(dsn)
		if err != nil {
			return "", fmt.Errorf("parse dsn url: %w", err)
		}
		u.Path = "/" + newDB
		// url.String may re-encode userinfo; fine for driver consumption.
		return u.String(), nil
	}

	quoted := quoteLibpqValue(newDB)
	if kvPair.MatchString(dsn) {
		return kvPair.ReplaceAllString(dsn, `${1}dbname=`+quoted), nil
	}
	return strings.TrimSpace(dsn + " dbname=" + quoted), nil
}

func quoteLibpqValue(v string) string {
	if strings.ContainsAny(v, " \t\r\n'\\") {
		return "'" + strings.ReplaceAll(v, `'`, `\'`) + "'"
	}
	return v
}

func quoteIdent(name string) string {
	return `"` + strings.ReplaceAll(name, `"`, `""`) + `"`
}

func isSystemDatabase(name string) bool {
	_, ok := systemDatabases[strings.ToLower(strings.TrimSpace(name))]
	return ok
}
