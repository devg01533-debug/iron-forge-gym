-- ============================================================
-- Iron Forge Gym - AI Lead Capture Platform
-- Engine: PostgreSQL (Supabase)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- GYM LEADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS gym_leads (
    id                      BIGSERIAL PRIMARY KEY,
    lead_id                 UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    request_id              UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at            TIMESTAMPTZ,

    first_name              VARCHAR(100) NOT NULL,
    last_name               VARCHAR(100) NOT NULL,
    phone                   VARCHAR(20) NOT NULL,
    email                   VARCHAR(255) NOT NULL,

    age                     INTEGER CHECK (age >= 13 AND age <= 90),
    gender                  VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),

    height                  DECIMAL(5,2) CHECK (height BETWEEN 100 AND 250),
    weight                  DECIMAL(5,2) CHECK (weight BETWEEN 30 AND 300),

    fitness_goal            VARCHAR(100),
    membership_plan         VARCHAR(50) CHECK (membership_plan IN ('Essential', 'Pro', 'Elite')),
    workout_time            VARCHAR(50),
    experience_level        VARCHAR(50) CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')),
    medical_conditions      TEXT,

    address                 TEXT,
    city                    VARCHAR(100),
    state                   VARCHAR(100),
    pincode                 VARCHAR(10),

    marketing_consent       BOOLEAN NOT NULL DEFAULT FALSE,
    source                  VARCHAR(50) NOT NULL DEFAULT 'website',
    notes                   TEXT,

    lead_score              INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),
    priority                VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
    status                  VARCHAR(30) NOT NULL DEFAULT 'New'
                            CHECK (status IN ('New', 'AI Analyzed', 'Contacted', 'Qualified',
                                              'Tour Scheduled', 'Enrolled', 'Not Interested', 'Lost')),
    summary                 TEXT,
    recommended_membership  VARCHAR(50),
    recommended_trainer     VARCHAR(100),
    follow_up_time          VARCHAR(100),
    internal_notes          TEXT,

    ip_address              VARCHAR(45),
    user_agent              TEXT
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_gym_leads_lead_id ON gym_leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_gym_leads_email ON gym_leads(email);
CREATE INDEX IF NOT EXISTS idx_gym_leads_phone ON gym_leads(phone);
CREATE INDEX IF NOT EXISTS idx_gym_leads_status ON gym_leads(status);
CREATE INDEX IF NOT EXISTS idx_gym_leads_priority ON gym_leads(priority);
CREATE INDEX IF NOT EXISTS idx_gym_leads_created_at ON gym_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gym_leads_city ON gym_leads(city);

-- ============================================================
-- DUPLICATE CHECK
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_gym_leads_email_phone
    ON gym_leads (LOWER(email), phone);

-- Hard duplicate prevention (email is normalized to lowercase in the workflow)
CREATE UNIQUE INDEX IF NOT EXISTS uq_gym_leads_email
    ON gym_leads (LOWER(email));

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gym_leads_updated_at ON gym_leads;
CREATE TRIGGER trg_gym_leads_updated_at
    BEFORE UPDATE ON gym_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    lead_id         UUID NOT NULL REFERENCES gym_leads(lead_id),
    action          VARCHAR(50) NOT NULL,
    previous_data   JSONB,
    new_data        JSONB,
    changed_by      VARCHAR(255),
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_audit_log_lead_id ON lead_audit_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_audit_log_changed_at ON lead_audit_log(changed_at DESC);
