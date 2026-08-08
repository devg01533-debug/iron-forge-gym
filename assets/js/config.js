// ============================================================
// Gym Lead Capture Platform - Configuration
// ============================================================

const CONFIG = {
    // n8n Webhook URL - UPDATE THIS with your n8n webhook URL
    WEBHOOK_URL: 'http://localhost:5678/webhook/gym-lead-capture',

    // Site metadata
    SITE_NAME: 'Iron Forge Gym',
    SITE_TAGLINE: 'Transform Your Body, Transform Your Life',
    SUPPORT_EMAIL: 'support@ironforgegym.com',
    SUPPORT_PHONE: '+1 (555) 123-4567',

    // Business hours
    BUSINESS_HOURS: {
        'Monday-Friday': '5:00 AM - 11:00 PM',
        'Saturday': '6:00 AM - 9:00 PM',
        'Sunday': '7:00 AM - 6:00 PM'
    },

    // Address
    ADDRESS: {
        street: '123 Fitness Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA'
    },

    // Social media
    SOCIAL: {
        facebook: 'https://facebook.com/ironforgegym',
        instagram: 'https://instagram.com/ironforgegym',
        twitter: 'https://twitter.com/ironforgegym',
        youtube: 'https://youtube.com/@ironforgegym'
    },

    // Features
    FEATURES: {
        ENABLE_ANIMATIONS: true,
        ENABLE_DARK_MODE_DEFAULT: false,
        ENABLE_LAZY_LOADING: true,
        FORM_TIMEOUT_MS: 30000
    },

    // Pricing plans
    PLANS: [
        { name: 'Basic', price: 29, period: 'month', features: ['Gym Access', 'Locker Room', 'Basic Equipment'] },
        { name: 'Standard', price: 49, period: 'month', features: ['Gym Access', 'Group Classes', 'Locker + Towel', 'Nutrition Guide'] },
        { name: 'Premium', price: 79, period: 'month', features: ['Unlimited Access', 'Personal Training', 'All Classes', 'Diet Plan', 'Sauna Access'] },
        { name: 'Annual', price: 599, period: 'year', features: ['All Premium Features', '2 PT Sessions/Week', 'Free Merchandise', 'Priority Support', 'Health Assessment'] }
    ],

    // Trainer profiles
    TRAINERS: [
        {
            name: 'Alex Johnson',
            title: 'Head Coach',
            specialties: ['Strength Training', 'Bodybuilding', 'Powerlifting'],
            experience: '12 years',
            image: 'assets/images/trainer-1.jpg',
            bio: 'Former national powerlifting champion. Specializes in strength and hypertrophy programs.'
        },
        {
            name: 'Sarah Williams',
            title: 'Yoga & Flexibility Coach',
            specialties: ['Yoga', 'Pilates', 'Rehabilitation'],
            experience: '8 years',
            image: 'assets/images/trainer-2.jpg',
            bio: 'Certified yoga instructor with expertise in injury recovery and mobility training.'
        },
        {
            name: 'Mike Chen',
            title: 'HIIT & Cardio Specialist',
            specialties: ['HIIT', 'Cardio', 'Weight Loss'],
            experience: '10 years',
            image: 'assets/images/trainer-3.jpg',
            bio: 'NSCA certified. Transformed 500+ clients through high-intensity programs.'
        },
        {
            name: 'Emily Rodriguez',
            title: 'Nutrition & Wellness Coach',
            specialties: ['Nutrition', 'Wellness', 'Hormone Health'],
            experience: '7 years',
            image: 'assets/images/trainer-4.jpg',
            bio: 'Registered dietitian combining nutrition science with practical fitness coaching.'
        }
    ],

    // Testimonials
    TESTIMONIALS: [
        {
            name: 'James Wilson',
            age: 34,
            image: 'assets/images/testimonial-1.jpg',
            text: 'Lost 30 lbs in 3 months. The trainers here are incredibly supportive and knowledgeable.',
            achievement: '30 lbs Weight Loss',
            membership: 'Premium Member'
        },
        {
            name: 'Lisa Park',
            age: 28,
            image: 'assets/images/testimonial-2.jpg',
            text: 'Best decision I ever made. The community and atmosphere keep me coming back every day.',
            achievement: 'First Marathon',
            membership: 'Standard Member'
        },
        {
            name: 'David Thompson',
            age: 45,
            image: 'assets/images/testimonial-3.jpg',
            text: 'After trying multiple gyms, Iron Forge is the only one that delivered real results. Period.',
            achievement: '50% Strength Increase',
            membership: 'Annual Member'
        }
    ]
};
