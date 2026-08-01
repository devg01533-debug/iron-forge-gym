-- ============================================================
-- Iron Forge Gym - SQLite Schema
-- Used by the n8n workflow (SQLite node) - zero setup, no server
-- ============================================================

CREATE TABLE IF NOT EXISTS gym_leads (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id             TEXT NOT NULL,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    phone               TEXT NOT NULL,
    email               TEXT NOT NULL,
    age                 INTEGER,
    gender              TEXT,
    height              REAL,
    weight              REAL,
    fitness_goal        TEXT,
    membership_plan     TEXT,
    workout_time        TEXT,
    experience_level    TEXT,
    medical_conditions  TEXT,
    address             TEXT,
    city                TEXT,
    state               TEXT,
    pincode             TEXT,
    marketing_consent   INTEGER DEFAULT 0,
    source              TEXT DEFAULT 'website',
    notes               TEXT,
    submitted_at        TEXT DEFAULT (datetime('now')),
    created_at          TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON gym_leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON gym_leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_created ON gym_leads(created_at);
