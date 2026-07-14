// src/db/migrate.js
require("dotenv").config();
const { getDB } = require("./database");

function migrate() {
  const db = getDB();

  // ── Users ──────────────────────────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      role        TEXT NOT NULL DEFAULT 'agent' CHECK(role IN ('super_admin','admin','agent')),
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Customers ──────────────────────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE,
      phone         TEXT,
      company       TEXT,
      address       TEXT,
      notes         TEXT,
      created_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Leads ──────────────────────────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id              TEXT PRIMARY KEY,
      first_name      TEXT NOT NULL,
      last_name       TEXT NOT NULL,
      email           TEXT,
      phone           TEXT,
      company         TEXT,
      source          TEXT CHECK(source IN ('website','referral','cold_call','social_media','email_campaign','other')),
      status          TEXT NOT NULL DEFAULT 'new'
                        CHECK(status IN ('new','converted-leads','assigned-leads')),
      priority        TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low','medium','high')),
      estimated_value REAL DEFAULT 0,
      notes           TEXT,
      closed_at       TEXT,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Lead Activities (audit trail) ──────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS lead_activities (
      id          TEXT PRIMARY KEY,
      lead_id     TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      type        TEXT NOT NULL CHECK(type IN ('note','call','email','meeting','status_change','assignment')),
      description TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Indexes ────────────────────────────────────────────────────────────────
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_leads_status      ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_activities_lead   ON lead_activities(lead_id);
  `);

  console.log("✅ Migrations complete");
}

migrate();
