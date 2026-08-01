# AI Agent Configuration

## Overview

The AI Agent uses Anthropic's Claude API to analyze gym leads. It performs intelligent lead scoring, intent detection, and generates actionable recommendations for the sales team.

## Model Configuration

| Parameter | Value |
|-----------|-------|
| Model | `claude-sonnet-4-20250514` |
| Max Tokens | 1024 |
| Temperature | 0.1 (low for consistent structured output) |
| API Version | `2023-06-01` |

## System Prompt

```
You are an expert gym sales and fitness AI assistant.
```

## Input Structure

The agent receives normalized lead data:

```json
{
  "leadId": "GYM-20260730-A3B9K",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@email.com",
  "age": 28,
  "gender": "Male",
  "height": 175.0,
  "weight": 82.5,
  "goal": "Weight Loss",
  "membership": "Monthly",
  "preferredTime": "Morning",
  "experience": "Intermediate",
  "medicalConditions": "None",
  "city": "Mumbai",
  "state": "Maharashtra",
  "source": "Google"
}
```

## Output Structure

The agent must return pure JSON only:

```json
{
  "lead_score": 85,
  "priority": "High",
  "customer_summary": "28-year-old male looking for weight loss. BMI 26.9 indicates overweight. Morning preference suggests disciplined routine.",
  "primary_intent": "Weight loss with personal training support",
  "recommended_plan": "Premium Monthly",
  "recommended_plan_reason": "Premium plan includes personal training which aligns with weight loss goals and need for accountability",
  "follow_up_priority": "Immediate",
  "follow_up_timeframe": "Within 30 minutes",
  "recommended_trainer": "Mike Chen - HIIT & Cardio Specialist",
  "recommended_trainer_reason": "Specializes in weight loss programs with high success rate",
  "suggested_slot": "6:00 AM - 7:00 AM (Morning preferred)",
  "sales_team_notes": "High motivation level. Responded to Google ad. Emphasize PT benefits and success stories during call.",
  "next_action": "Call lead immediately. Offer free trial session with Mike Chen. Discuss Premium plan pricing."
}
```

## Scoring Criteria

| Factor | Weight |
|--------|--------|
| Fitness Goal Alignment | 25% |
| Membership Budget | 20% |
| Location Proximity | 15% |
| Urgency/Source | 15% |
| Experience Level | 10% |
| Medical Considerations | 10% |
| Referral Quality | 5% |

## Priority Levels

| Score Range | Priority | Response Time |
|-------------|----------|---------------|
| 75-100 | High | Immediate - 30 min |
| 50-74 | Medium | Same day |
| 0-49 | Low | Within 48 hours |

## n8n Integration

The AI Agent is triggered via the HTTP Request node in n8n:

1. **Prepare AI Prompt** node builds the structured prompt
2. **Call Claude AI** node sends to Anthropic API
3. **Parse AI Response** node extracts and validates JSON
4. **Update DB with AI Result** node stores analysis in database

### Required Credential

In n8n, create a **Header Auth** credential named `Claude API Key`:

- **Header Name**: `x-api-key`
- **Header Value**: Your Anthropic API key
