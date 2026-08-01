# Supabase Setup

Iron Forge Gym uses Supabase (PostgreSQL) as the lead database.

## 1. Create The Project

1. Go to https://supabase.com and sign in
2. **New Project** → name it (e.g. `iron-forge-gym`) → choose region → set a strong database password → create

## 2. Run The Schema

1. In the Supabase dashboard open **SQL Editor** → **New Query**
2. Paste the contents of `database/schema.sql`
3. Click **Run** — you should see success with no errors

## 3. Get The Connection String

1. **Project Settings → Database**
2. Under **Connection string** copy the **URI** (or use the pooled `:6543` port version)
3. It looks like:
   ```
   postgresql://postgres.yourref:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
   ```

This string is what you paste into n8n's Postgres credential (see `docs/N8N_SETUP.md`).

## 4. What The Schema Creates

| Object | Purpose |
|--------|---------|
| `gym_leads` | All lead form fields + AI analysis columns (`lead_score`, `priority`, `status`, `summary`, `recommended_membership`, `recommended_trainer`, `follow_up_time`, `internal_notes`) |
| `lead_audit_log` | Optional audit trail for lead changes |
| Indexes | Fast duplicate checks (email/phone), status & priority filters |
| Trigger | Auto-updates `updated_at` on every update |

## 5. Security Notes

- n8n connects with the **service role** credentials, which bypasses Row Level
  Security — never expose these credentials to the frontend.
- The public anon key from the dashboard is **not needed** by this project.
- If you enable RLS later, the `gym_leads` table must get a policy for the
  service role or the workflow's INSERT/UPDATE will fail.

## 6. Verify

Run this in the SQL editor:

```sql
SELECT COUNT(*) FROM gym_leads;
```

It should return `0`. Submit a test lead through the website and run it again —
it should now return `1`, and after the AI step the row should have
`status = 'AI Analyzed'`, a `lead_score`, `priority` and `summary`.
