package auth

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

type Mode string

const (
	ModePassword Mode = "password"
	ModeEmail    Mode = "email"
)

type SMTPConfig struct {
	Host          string
	Port          int
	Username      string
	Password      string
	SenderAddress string
	SenderName    string
}

type Config struct {
	Mode Mode
	SMTP SMTPConfig
}

func (c Config) EmailAuthEnabled() bool { return c.Mode == ModeEmail }

// LoadConfig reads AUTH_MODE (default "password") and, in email mode,
// the SMTP_* variables. It has no side effects.
func LoadConfig() (Config, error) {
	cfg := Config{Mode: Mode(strings.ToLower(strings.TrimSpace(os.Getenv("AUTH_MODE"))))}

	switch cfg.Mode {
	case "":
		cfg.Mode = ModePassword
	case ModePassword, ModeEmail:
	default:
		return Config{}, fmt.Errorf("invalid AUTH_MODE %q (allowed: %q, %q)", cfg.Mode, ModePassword, ModeEmail)
	}

	if cfg.Mode == ModePassword {
		return cfg, nil
	}

	var missing []string
	get := func(key string) string {
		v := strings.TrimSpace(os.Getenv(key))
		if v == "" {
			missing = append(missing, key)
		}
		return v
	}

	cfg.SMTP.Host = get("SMTP_HOST")
	portStr := get("SMTP_PORT")
	cfg.SMTP.Username = get("SMTP_USERNAME")
	cfg.SMTP.Password = get("SMTP_PASSWORD")
	cfg.SMTP.SenderAddress = get("SMTP_SENDER_ADDRESS")
	cfg.SMTP.SenderName = strings.TrimSpace(os.Getenv("SMTP_SENDER_NAME"))
	if cfg.SMTP.SenderName == "" {
		cfg.SMTP.SenderName = "Origo"
	}

	if len(missing) > 0 {
		return Config{}, fmt.Errorf("AUTH_MODE=email requires: %s", strings.Join(missing, ", "))
	}

	port, err := strconv.Atoi(portStr)
	if err != nil || port <= 0 {
		return Config{}, fmt.Errorf("SMTP_PORT must be a positive integer, got %q", portStr)
	}
	cfg.SMTP.Port = port

	return cfg, nil
}

func (c Config) ApplySMTP(app core.App) error {
	s := app.Settings()

	if !c.EmailAuthEnabled() {
		if !s.SMTP.Enabled {
			return nil
		}
		s.SMTP.Enabled = false
		return app.Save(s)
	}

	s.SMTP.Enabled = true
	s.SMTP.Host = c.SMTP.Host
	s.SMTP.Port = c.SMTP.Port
	s.SMTP.Username = c.SMTP.Username
	s.SMTP.Password = c.SMTP.Password
	s.SMTP.TLS = c.SMTP.Port == 465 // implicit TLS; 587 uses STARTTLS automatically
	s.Meta.SenderAddress = c.SMTP.SenderAddress
	s.Meta.SenderName = c.SMTP.SenderName
	return app.Save(s)
}
