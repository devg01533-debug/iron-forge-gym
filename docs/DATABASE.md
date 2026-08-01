# Database Documentation

## Overview

PostgreSQL database for storing gym leads with AI analysis results.

## Schema: `gym_leads`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing ID |
| `lead_id` | UUID | UNIQUE, NOT NULL | Unique lead identifier |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| `first_name` | VARCHAR(100) | NOT NULL | Lead's first name |
| `last_name` | VARCHAR(100) | NOT NULL | Lead's last name |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone number |
| `email` | VARCHAR(255) | - | Email address |
| `age` | INTEGER | CHECK (1-120) | Age |
| `gender` | VARCHAR(20) | CHECK enum | Gender |
| `height` | DECIMAL(5,2) | CHECK > 0 | Height in cm |
| `weight` | DECIMAL(5,2) | CHECK > 0 | Weight in kg |
| `goal` | VARCHAR(100) | NOT NULL | Fitness goal |
| `membership` | VARCHAR(50) | - | Preferred membership |
| `preferred_time` | VARCHAR(50) | - | Preferred workout time |
| `experience` | VARCHAR(50) | CHECK enum | Experience level |
| `medical_conditions` | TEXT | - | Medical conditions |
| `address` | TEXT | - | Street address |
| `city` | VARCHAR(100) | - | City |
| `state` | VARCHAR(100) | - | State |
| `pincode` | VARCHAR(20) | - | ZIP/Pincode |
| `source` | VARCHAR(100) | - | Marketing source |
| `marketing_consent` | BOOLEAN | DEFAULT FALSE | Marketing opt-in |
| `notes` | TEXT | - | Additional notes |
| `lead_score` | INTEGER | CHECK (0-100) | AI-calculated score |
| `ai_summary` | TEXT | - | AI summary text |
| `ai_analysis_json` | JSONB | - | Full AI analysis |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT 'New' | Lead status |
| `ip_address` | VARCHAR(45) | - | Submitter IP |
| `user_agent` | TEXT | - | Browser user agent |
| `submission_source` | VARCHAR(50) | DEFAULT 'website' | Form source |

## Status Values

| Status | Description |
|--------|-------------|
| `New` | Fresh lead, not contacted |
| `Contacted` | Sales team has reached out |
| `Qualified` | Lead meets qualification criteria |
| `Tour Scheduled` | Gym tour booked |
| `Enrolled` | Signed up as member |
| `Not Interested` | Declined membership |
| `Lost` | No longer reachable |

## Indexes

- `idx_gym_leads_lead_id` - Fast lookup by lead ID
- `idx_gym_leads_email` - Duplicate detection by email
- `idx_gym_leads_phone` - Duplicate detection by phone
- `idx_gym_leads_status` - Status-based queries
- `idx_gym_leads_created_at` - Time-based sorting
- `idx_gym_leads_city` - Location-based analysis
- `idx_gym_leads_goal` - Goal-based reporting

## Audit Log

The `lead_audit_log` table tracks all changes to leads for compliance and analysis.

## SQLite Compatibility

SQLite is no longer used — n8n 2.x removed the SQLite node. Leads are saved to
**Supabase** (managed PostgreSQL); run `database/schema.sql` in the Supabase
SQL Editor. The old `database/schema.sqlite.sql` file is kept for reference
only.
