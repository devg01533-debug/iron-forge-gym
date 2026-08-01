# n8n Workflow Setup

Workflow: **Gym Lead Capture** — `n8n/gym-lead-capture-workflow.json`

## Pipeline

```
Webhook → Prepare Lead → Validate → Save Lead → Build Success → Respond
                        \      └→ Build Error ───────┘ /        /
                         \─────→ Save error →──────────/───────/
```

Production-grade but simple: the website POSTs a lead, it is normalized and
validated, saved to **Supabase** (PostgreSQL), and the website gets a clean,
consistent JSON response — success or a categorized error.

## Database (Supabase)

The workflow saves leads to **Supabase** (managed PostgreSQL) via n8n's native
Supabase node (REST — only needs the project URL + service role key).

1. Create a free project at <https://supabase.com>
2. Open **SQL Editor** and run the whole `database/schema.sql`
   (creates `gym_leads`, the audit log table, indexes, and a **unique index on
   email** for duplicate prevention)
3. Project Settings → API: copy the **Project URL** and the **service_role**
   key

## Nodes

| Node | Purpose |
|------|---------|
| Receive Lead | POST webhook at `/webhook/gym-lead-capture` |
| Prepare Lead | Trims all fields, lowercases email, normalizes phone, validates email format / required fields / age, generates `request_id` + `lead_id` (UUID), sets timestamps, IP & user agent, builds the clean DB row |
| Validate Request | Passes only valid requests to the save step |
| Save Lead | Supabase `create` on `gym_leads` (explicit column mapping); on failure continues and routes to the error branch |
| Build Success Response | `{ success, request_id, lead_id, message, timestamp }` |
| Build Error Response | Centralized error envelope — categorizes validation, duplicate, and save failures with one consistent shape |
| Respond to Webhook | Sends the response JSON back to the website |

Error handling is **Try/Catch style**: `Save Lead` is the only node that can
throw; `onError: continueRegularOutput` catches it and the error branch builds a
clean response. Every response contains `request_id` for support tracing.

## Setup

1. Open n8n → **Workflows** → **Gym Lead Capture** (or import from
   `n8n/gym-lead-capture-workflow.json`)
2. Create the credential: **Credentials → New → Supabase** → Host URL + Service
   Role key
3. Open the **Save Lead** node → select the Supabase credential → ensure
   **Table** is `gym_leads`
4. From the `Receive Lead` node, copy the webhook URL:
   ```
   http://localhost:5678/webhook/gym-lead-capture
   ```
5. Update `config.js`:
   ```js
   WEBHOOK_URL: "http://localhost:5678/webhook/gym-lead-capture",
   ```
6. Toggle the workflow **Active**

## Testing With curl

```bash
curl -X POST http://localhost:5678/webhook/gym-lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1 555 123 4567",
    "email": "JOHN@Example.com",
    "age": "28",
    "gender": "Male",
    "height": "180",
    "weight": "82",
    "fitness_goal": "Build Muscle",
    "membership_plan": "Pro",
    "workout_time": "Evening (3-7 PM)",
    "experience_level": "Intermediate",
    "medical_conditions": "None",
    "address": "128 Titan Avenue",
    "city": "Los Angeles",
    "state": "CA",
    "pincode": "90001",
    "marketing_consent": true,
    "notes": "Wants to compete in powerlifting"
  }'
```

Expected response:

```json
{
  "success": true,
  "request_id": "c9e2e4a3-1b3d-4a5f-8b0e-7c2d6a9f1e4b",
  "lead_id": "f8d5c2b1-6a4e-4c3d-9a1b-2e3f4a5b6c7d",
  "message": "Application received. A coach will contact you shortly.",
  "timestamp": "2026-08-01T12:00:00.000Z"
}
```

Duplicate test — send the same email again:

```json
{
  "success": false,
  "request_id": "...",
  "error_code": "duplicate",
  "message": "This email is already registered. Our team will contact you shortly.",
  "timestamp": "..."
}
```

Check the saved row: Supabase dashboard → Table Editor → `gym_leads`.

## Future Integration Points

- **Supabase webhooks / AI**: `gym_leads.status` column already supports
  `'AI Analyzed'` → connect an AI agent (Claude) to score the lead
- **WhatsApp / Email / Calendar / CRM**: listen on Supabase insert events, or
  add nodes after `Save Lead` in the main flow
- The lead row includes `request_id`, `ip_address`, `user_agent` for auditing
