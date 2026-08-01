-- ============================================================
-- Seed data for testing
-- ============================================================

INSERT INTO gym_leads (
    first_name, last_name, phone, email, age, gender, height, weight,
    goal, membership, preferred_time, experience, medical_conditions,
    address, city, state, pincode, source, marketing_consent, notes,
    lead_score, ai_summary, status
) VALUES
(
    'Rahul', 'Sharma', '9876543210', 'rahul@email.com', 28, 'Male', 175.00, 82.50,
    'Weight Loss', 'Monthly', 'Morning', 'Intermediate', 'None',
    '123 Main St', 'Mumbai', 'Maharashtra', '400001',
    'Google', TRUE, 'Looking for personal training',
    85, 'High intent lead. BMI indicates overweight. Recommended: Premium plan with PT.',
    'New'
),
(
    'Priya', 'Patel', '9876543211', 'priya@email.com', 32, 'Female', 162.00, 68.00,
    'Muscle Building', 'Quarterly', 'Evening', 'Beginner', 'Mild asthma',
    '456 Oak Ave', 'Delhi', 'Delhi', '110001',
    'Instagram', TRUE, 'Wants female trainer',
    72, 'Moderate intent. Prefers female trainer. Evening time slot. Quarterly commitment.',
    'New'
),
(
    'Amit', 'Verma', '9876543212', 'amit@email.com', 45, 'Male', 180.00, 95.00,
    'General Fitness', 'Premium', 'Flexible', 'Advanced', 'Knee pain',
    '789 Pine Rd', 'Bangalore', 'Karnataka', '560001',
    'Referral', FALSE, 'Previous gym experience',
    65, 'Low urgency. Referral source. Knee concerns need physio consult first.',
    'Contacted'
);
