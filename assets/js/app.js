// ============================================================
// Iron Forge Gym - Main Application Script
// ============================================================

(function () {
    'use strict';

    // ===== DOM REFS =====
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const navbar = $('#navbar');
    const navbarToggle = $('#navbarToggle');
    const navbarMenu = $('#navbarMenu');
    const themeToggle = $('#themeToggle');
    const backToTop = $('#backToTop');
    const preloader = $('#preloader');
    const form = $('#leadForm');
    const formContainer = $('#formContainer');
    const formSuccess = $('#formSuccess');
    const formError = $('#formErrorMessage');
    const submitBtn = $('#formSubmit');
    const successMessage = $('#successMessage');
    const successDetails = $('#successDetails');

    // ===== CONFIG =====
    const WEBHOOK_URL = CONFIG.WEBHOOK_URL;
    const FORM_TIMEOUT = CONFIG.FEATURES.FORM_TIMEOUT_MS || 30000;

    // ============================================================
    // PRELOADER
    // ============================================================
    function initPreloader() {
        const fill = $('.preloader-bar-fill');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => preloader.classList.add('hidden'), 300);
            }
            fill.style.width = progress + '%';
        }, 150);

        window.addEventListener('load', () => {
            progress = 100;
            clearInterval(interval);
            fill.style.width = '100%';
            setTimeout(() => preloader.classList.add('hidden'), 300);
        });

        setTimeout(() => {
            clearInterval(interval);
            preloader.classList.add('hidden');
        }, 3000);
    }

    // ============================================================
    // THEME TOGGLE
    // ============================================================
    function initTheme() {
        const saved = localStorage.getItem('gym-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = CONFIG.FEATURES.ENABLE_DARK_MODE_DEFAULT ? 'dark' : (prefersDark ? 'dark' : 'light');

        const theme = saved || defaultTheme;
        document.documentElement.setAttribute('data-theme', theme);

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('gym-theme', next);
        });
    }

    // ============================================================
    // NAVBAR
    // ============================================================
    function initNavbar() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        });

        navbarToggle.addEventListener('click', () => {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });

        $$('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });

        // Active link tracking
        const sections = $$('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop - 120;
                if (window.scrollY >= top) {
                    current = section.getAttribute('id');
                }
            });
            $$('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ============================================================
    // COUNTER ANIMATION
    // ============================================================
    function initCounters() {
        const counters = $$('.hero-stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    function animateCounter(el, target) {
        let current = 0;
        const increment = Math.ceil(target / 60);
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 25);
    }

    // ============================================================
    // DYNAMIC CONTENT
    // ============================================================
    function initTrainers() {
        const grid = $('#trainersGrid');
        if (!grid || !CONFIG.TRAINERS) return;

        grid.innerHTML = CONFIG.TRAINERS.map(t => `
            <div class="trainer-card fade-in">
                <div class="trainer-image">
                    <i class="fas fa-user"></i>
                </div>
                <div class="trainer-info">
                    <h3>${t.name}</h3>
                    <p class="trainer-title">${t.title}</p>
                    <div class="trainer-specialties">
                        ${t.specialties.map(s => `<span class="trainer-specialty">${s}</span>`).join('')}
                    </div>
                    <span class="trainer-exp">${t.experience} experience</span>
                </div>
                <p class="trainer-bio">${t.bio}</p>
            </div>
        `).join('');
    }

    function initPricing() {
        const grid = $('#pricingGrid');
        if (!grid || !CONFIG.PLANS) return;

        function render(annual) {
            grid.innerHTML = CONFIG.PLANS.map((plan, i) => {
                const price = annual ? plan.price : (plan.period === 'year' ? Math.round(plan.price / 12) : plan.price);
                const period = annual ? '/year' : '/month';
                const displayPrice = annual && plan.period === 'year' ? plan.price : price;
                const featured = i === 2;

                return `
                    <div class="pricing-card${featured ? ' featured' : ''} fade-in">
                        ${featured ? '<span class="pricing-card-badge">Most Popular</span>' : ''}
                        <h3 class="pricing-card-name">${plan.name}</h3>
                        <div class="pricing-card-price">
                            <span class="pricing-card-currency">$</span>
                            <span class="pricing-card-amount">${displayPrice}</span>
                            <span class="pricing-card-period">${period}</span>
                        </div>
                        <ul class="pricing-card-features">
                            ${plan.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                        </ul>
                        <a href="#lead-form" class="btn ${featured ? 'btn-primary' : 'btn-outline'}">Get Started</a>
                    </div>
                `;
            }).join('');
            initFadeIn();
        }

        const toggle = $('#pricingToggle');
        render(false);

        toggle.addEventListener('change', () => {
            render(toggle.checked);
            $$('.pricing-toggle-label').forEach(l => l.classList.toggle('active', toggle.checked ? l.dataset.period === 'year' : l.dataset.period === 'month'));
        });
    }

    function initTestimonials() {
        const slider = $('#testimonialsSlider');
        const dots = $('#testimonialsDots');
        if (!slider || !CONFIG.TESTIMONIALS) return;

        slider.innerHTML = CONFIG.TESTIMONIALS.map(t => `
            <div class="testimonial-card fade-in">
                <div class="testimonial-stars">
                    ${'<i class="fas fa-star"></i>'.repeat(5)}
                </div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <p class="testimonial-name">${t.name}</p>
                        <p class="testimonial-meta">${t.membership}</p>
                        <span class="testimonial-achievement">${t.achievement}</span>
                    </div>
                </div>
            </div>
        `).join('');

        if (dots) {
            dots.innerHTML = CONFIG.TESTIMONIALS.map((_, i) =>
                `<span class="${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
            ).join('');
        }
    }

    // ============================================================
    // FADE IN ANIMATION
    // ============================================================
    function initFadeIn() {
        const elements = $$('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    // ============================================================
    // BACK TO TOP
    // ============================================================
    function initBackToTop() {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // FORM VALIDATION
    // ============================================================
    const validators = {
        firstName: {
            validate: (v) => v.trim().length >= 2,
            message: 'First name must be at least 2 characters'
        },
        lastName: {
            validate: (v) => v.trim().length >= 2,
            message: 'Last name must be at least 2 characters'
        },
        phone: {
            validate: (v) => /^\+?[\d\s\-()]{10,15}$/.test(v.replace(/[\s\-()]/g, '')),
            message: 'Please enter a valid phone number (10-15 digits)'
        },
        email: {
            validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Please enter a valid email address'
        },
        age: {
            validate: (v) => !v || (Number(v) >= 1 && Number(v) <= 120),
            message: 'Age must be between 1 and 120'
        },
        height: {
            validate: (v) => !v || (Number(v) > 0 && Number(v) <= 300),
            message: 'Height must be between 1-300 cm'
        },
        weight: {
            validate: (v) => !v || (Number(v) > 0 && Number(v) <= 500),
            message: 'Weight must be between 1-500 kg'
        },
        goal: {
            validate: (v) => v !== '',
            message: 'Please select a fitness goal'
        },
        pincode: {
            validate: (v) => !v || v.trim().length >= 3,
            message: 'Please enter a valid pincode'
        }
    };

    function validateField(fieldId) {
        const field = $(`#${fieldId}`);
        const errorEl = $(`#${fieldId}Error`);
        const validator = validators[fieldId];
        if (!field || !validator) return true;

        const value = field.value;
        const isValid = validator.validate(value);

        field.closest('.form-group').classList.toggle('input-error', !isValid && value !== '');
        if (errorEl) {
            errorEl.textContent = !isValid && value !== '' ? validator.message : '';
        }
        return isValid;
    }

    function validateForm() {
        let isValid = true;
        Object.keys(validators).forEach(key => {
            if (!validateField(key)) isValid = false;
        });
        return isValid;
    }

    function initFormValidation() {
        Object.keys(validators).forEach(key => {
            const field = $(`#${key}`);
            if (!field) return;

            field.addEventListener('blur', () => validateField(key));
            field.addEventListener('input', () => {
                if (field.closest('.form-group').classList.contains('input-error')) {
                    validateField(key);
                }
            });
        });

        // Phone input formatting
        const phoneInput = $('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                let val = this.value.replace(/[^\d+]/g, '');
                if (val.startsWith('+')) {
                    val = '+' + val.slice(1).replace(/\D/g, '');
                }
                if (val.length > 15) val = val.slice(0, 15);
                this.value = val;
            });
        }

        // Age input constraints
        const ageInput = $('#age');
        if (ageInput) {
            ageInput.addEventListener('input', function () {
                if (this.value.length > 3) this.value = this.value.slice(0, 3);
            });
        }
    }

    // ============================================================
    // FORM SUBMISSION
    // ============================================================
    async function submitForm(data) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FORM_TIMEOUT);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    function getFormData() {
        const fd = new FormData(form);
        const data = {};
        fd.forEach((value, key) => { data[key] = value; });
        data.marketing_consent = $('#marketingConsent').checked;
        return data;
    }

    function showSuccess(result) {
        formContainer.style.display = 'none';
        formError.style.display = 'none';
        formSuccess.style.display = 'block';

        if (result && result.message) {
            successMessage.textContent = result.message;
        }

        if (result) {
            let detailsHTML = '';
            if (result.lead_id) detailsHTML += `<p><strong>Lead ID:</strong> ${result.lead_id}</p>`;
            if (result.lead_score) detailsHTML += `<p><strong>Lead Score:</strong> ${result.lead_score}/100</p>`;
            if (result.priority) detailsHTML += `<p><strong>Priority:</strong> ${result.priority}</p>`;
            if (result.next_action) detailsHTML += `<p><strong>Next Step:</strong> ${result.next_action}</p>`;
            if (result.follow_up_timeframe) detailsHTML += `<p><strong>Response Time:</strong> ${result.follow_up_timeframe}</p>`;
            successDetails.innerHTML = detailsHTML;
        }

        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showError(error) {
        formContainer.style.display = 'none';
        formSuccess.style.display = 'none';
        formError.style.display = 'block';
        $('#errorMessage').textContent = error.message || 'Something went wrong. Please try again or call us directly.';

        if (CONFIG.SUPPORT_PHONE) {
            $('#errorMessage').textContent += ` Call us at ${CONFIG.SUPPORT_PHONE}`;
        }
    }

    function resetForm() {
        form.reset();
        formContainer.style.display = 'block';
        formSuccess.style.display = 'none';
        formError.style.display = 'none';
        submitBtn.classList.remove('loading');
        $$('.form-group.input-error').forEach(el => el.classList.remove('input-error'));
        $$('.form-error').forEach(el => el.textContent = '');
        window.scrollTo({ top: $('#lead-form').offsetTop - 100, behavior: 'smooth' });
    }

    function initForm() {
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                const firstError = $('.form-group.input-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.querySelector('input, select, textarea')?.focus();
                }
                return;
            }

            if (submitBtn.classList.contains('loading')) return;

            submitBtn.classList.add('loading');
            const data = getFormData();

            try {
                const result = await submitForm(data);
                showSuccess(result);
            } catch (error) {
                if (error.name === 'AbortError') {
                    showError(new Error('Request timed out. Please try again.'));
                } else {
                    showError(error);
                }
            } finally {
                submitBtn.classList.remove('loading');
            }
        });
    }

    // ============================================================
    // INIT ALL
    // ============================================================
    function init() {
        initPreloader();
        initTheme();
        initNavbar();
        initCounters();
        initTrainers();
        initPricing();
        initTestimonials();
        initFadeIn();
        initBackToTop();
        initFormValidation();
        initForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
