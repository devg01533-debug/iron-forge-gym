(() => {
  "use strict";

  const CONFIG = window.APP_CONFIG || {};
  const DEBUG = CONFIG.DEBUG === true;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const log = {
    info: (...a) => DEBUG && console.info("[IronForge]", ...a),
    warn: (...a) => DEBUG && console.warn("[IronForge]", ...a),
    error: (...a) => DEBUG && console.error("[IronForge]", ...a)
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function applyConfig() {
    document.title = `${CONFIG.APP_NAME} - AI-Powered Fitness`;
    $("#brand-name").textContent = CONFIG.APP_NAME;
    $("#footer-brand").textContent = `${CONFIG.APP_NAME} · ${CONFIG.APP_TAGLINE}`;
    $("#footer-meta").textContent = `${new Date().getFullYear()} ${CONFIG.APP_NAME}. v${CONFIG.VERSION} · Forged with intelligence.`;

    if (CONFIG.CONTACT) {
      $("#contact-address").textContent = CONFIG.CONTACT.ADDRESS;
      $("#contact-phone").textContent = CONFIG.CONTACT.PHONE;
      $("#contact-email").textContent = CONFIG.CONTACT.EMAIL;
      $("#contact-hours").textContent = CONFIG.CONTACT.HOURS;
      const socials = $("#socials");
      socials.innerHTML = [
        ["Instagram", CONFIG.CONTACT.INSTAGRAM],
        ["YouTube", CONFIG.CONTACT.YOUTUBE],
        ["X", CONFIG.CONTACT.TWITTER]
      ]
        .map(
          ([name, url]) =>
            `<a href="${url}" target="_blank" rel="noopener" aria-label="${name}">` +
            `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/></svg></a>`
        )
        .join("");
    }
  }

  function preloader() {
    const el = $("#preloader");
    if (!el) return;
    const hide = () => el.classList.add("done");
    if (REDUCED) {
      hide();
      return;
    }
    window.addEventListener("load", () => setTimeout(hide, 450));
    setTimeout(hide, 3000);
  }

  function initNav() {
    const nav = $("#nav");
    const toggle = $("#nav-toggle");
    const menu = $("#mobile-menu");

    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    on(toggle, "click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    $$("a", menu).forEach((link) =>
      on(link, "click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  function initReveals() {
    const items = $$(".reveal");
    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function animateCount(el, target, suffix = "", duration = 1800) {
    const start = performance.now();
    const fmt = (v) => Math.round(v).toLocaleString("en-US");
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target) + (suffix || "");
    };
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = $$("[data-count]");
    if (REDUCED) {
      counters.forEach((el) => {
        el.textContent = parseInt(el.dataset.count, 10).toLocaleString("en-US");
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCount(el, target);
          io.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => io.observe(el));
  }

  function initMagnetic() {
    const els = $$("[data-magnetic], .btn[data-ripple], .btn");
    if (REDUCED || !window.matchMedia("(pointer: fine)").matches) return;
    els.forEach((el) => {
      on(el, "mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const mx = Math.max(-10, Math.min(10, x * 0.14));
        const my = Math.max(-10, Math.min(10, y * 0.22));
        el.style.transform = `translate(${mx}px, ${my}px)`;
      });
      on(el, "mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  function initRipple() {
    $$("[data-ripple]").forEach((btn) => {
      on(btn, "click", (e) => {
        const r = btn.getBoundingClientRect();
        const d = Math.max(r.width, r.height);
        const span = document.createElement("span");
        span.className = "ripple";
        span.style.width = span.style.height = `${d}px`;
        span.style.left = `${e.clientX - r.left - d / 2}px`;
        span.style.top = `${e.clientY - r.top - d / 2}px`;
        btn.appendChild(span);
        setTimeout(() => span.remove(), 750);
      });
    });
  }

  function initAccordion() {
    $$(".acc-head").forEach((head) => {
      on(head, "click", () => {
        const item = head.parentElement;
        const body = $(".acc-body", item);
        const isOpen = item.classList.contains("open");
        $$(".acc-item.open").forEach((other) => {
          other.classList.remove("open");
          $(".acc-body", other).style.maxHeight = "0px";
          $(".acc-head", other).setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          body.style.maxHeight = `${body.scrollHeight}px`;
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initSlider() {
    const track = $("#slider-track");
    const prev = $("#slider-prev");
    const next = $("#slider-next");
    const dotsWrap = $("#slider-dots");
    if (!track) return;
    const slides = $$(".slide", track);
    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      on(dot, "click", () => go(i));
      dotsWrap.appendChild(dot);
    });
    const dots = $$("button", dotsWrap);

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle("active", j === index));
    }

    function autoplay() {
      stop();
      timer = setInterval(() => go(index + 1), 6000);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }

    on(prev, "click", () => { go(index - 1); autoplay(); });
    on(next, "click", () => { go(index + 1); autoplay(); });

    const slider = $("#slider");
    on(slider, "mouseenter", stop);
    on(slider, "mouseleave", autoplay);

    go(0);
    autoplay();
  }

  function initPricing() {
    const grid = $("#pricing-grid");
    const btns = $$(".toggle-btn");
    if (!grid || !CONFIG.PRICING) return;

    btns.forEach((btn) => {
      on(btn, "click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const period = btn.dataset.period;
        const prices = CONFIG.PRICING[period];
        if (!prices) return;
        $$("[data-amount]", grid).forEach((el) => {
          const plan = el.closest("[data-plan]").dataset.plan;
          const value = prices[plan];
          if (value == null) return;
          const start = performance.now();
          const from = parseInt(el.textContent, 10) || value;
          const tick = (now) => {
            const p = Math.min((now - start) / 400, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(from + (value - from) * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      });
    });
  }

  const VALIDATORS = {
    first_name: (v) => (v.length >= 2 ? "" : "Please enter your first name."),
    last_name: (v) => (v.length >= 2 ? "" : "Please enter your last name."),
    phone: (v) => (/^\+?[0-9\s\-()]{7,16}$/.test(v) ? "" : "Enter a valid phone number."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address."),
    age: (v) => {
      const n = Number(v);
      if (!v || Number.isNaN(n)) return "Please enter your age.";
      if (n < 13 || n > 90) return "Age must be between 13 and 90.";
      return "";
    },
    gender: (v) => (v ? "" : "Please select your gender."),
    height: (v) => {
      const n = Number(v);
      if (!v || Number.isNaN(n) || n < 100 || n > 250) return "Height must be 100-250 cm.";
      return "";
    },
    weight: (v) => {
      const n = Number(v);
      if (!v || Number.isNaN(n) || n < 30 || n > 300) return "Weight must be 30-300 kg.";
      return "";
    },
    fitness_goal: (v) => (v ? "" : "Select your primary fitness goal."),
    membership_plan: (v) => (v ? "" : "Select a membership plan."),
    workout_time: (v) => (v ? "" : "Select a preferred workout time."),
    experience_level: (v) => (v ? "" : "Select your experience level."),
    address: (v) => (v.length >= 4 ? "" : "Enter your street address."),
    city: (v) => (v.length >= 2 ? "" : "Enter your city."),
    state: (v) => (v.length >= 2 ? "" : "Enter your state."),
    pincode: (v) => (/^[0-9]{4,10}$/.test(v) ? "" : "Enter a valid pincode."),
    marketing_consent: (v) => (v ? "" : "Consent is required to submit.")
  };

  function initForm() {
    const form = $("#lead-form");
    if (!form) return;

    const status = $("#form-status");
    const submitBtn = $("#submit-btn");
    const successBox = $("#form-success");
    const checkedBoxes = () =>
      $$('input[name="medical_conditions"]:checked').map((c) => c.value);

    function fieldError(name, message) {
      const group = form.elements[name];
      const field = group && group.closest ? group.closest(".field") : null;
      if (field) {
        field.classList.toggle("error", Boolean(message));
        field.classList.toggle("shake", Boolean(message));
        const err = $(".field-error", field);
        if (err) err.textContent = message || "";
        setTimeout(() => field.classList.remove("shake"), 600);
      }
      return !message;
    }

    function validateAll() {
      let firstInvalid = null;
      for (const name of Object.keys(VALIDATORS)) {
        const el = form.elements[name];
        if (!el) continue;
        let value;
        if (name === "medical_conditions") {
          const sel = $$('input[name="medical_conditions"]:checked', form);
          const none = sel.some((c) => c.value === "None");
          value = none || sel.length ? true : "";
          if (!value) {
            const grid = $("#medical_conditions");
            grid.classList.add("invalid");
            const err = $('[data-error-for="medical_conditions"]');
            if (err) err.textContent = "Select a condition or 'None'.";
            const field = grid.closest(".field");
            field.classList.add("error");
            if (!firstInvalid) firstInvalid = grid;
          } else {
            $("#medical_conditions").classList.remove("invalid");
          }
        } else {
          value = el.type === "checkbox" ? el.checked : el.value.trim();
          const ok = fieldError(name, VALIDATORS[name](value));
          if (!ok && !firstInvalid) firstInvalid = el;
        }
      }
      return firstInvalid;
    }

    function bindLiveValidation() {
      Object.keys(VALIDATORS).forEach((name) => {
        const el = form.elements[name];
        if (!el) return;
        on(el, "blur", () => {
          if (!el.value && name !== "marketing_consent") return;
          const value = el.type === "checkbox" ? el.checked : el.value.trim();
          fieldError(name, VALIDATORS[name](value));
        });
        on(el, "input", () => {
          const value = el.type === "checkbox" ? el.checked : el.value.trim();
          if (el.closest(".field").classList.contains("error")) {
            fieldError(name, VALIDATORS[name](value));
          }
        });
      });

      $$('input[name="medical_conditions"]', form).forEach((c) =>
        on(c, "change", () => {
          const sel = $$('input[name="medical_conditions"]:checked', form);
          const field = $("#medical_conditions").closest(".field");
          const valid = sel.some((x) => x.value === "None") || sel.length > 0;
          $("#medical_conditions").classList.remove("invalid");
          field.classList.remove("error");
          const err = $('[data-error-for="medical_conditions"]');
          if (err) err.textContent = "";
          if (c.value === "None" && c.checked) {
            $$('input[name="medical_conditions"]', form).forEach((x) => {
              if (x !== c) x.checked = false;
            });
          } else if (c.value !== "None" && c.checked) {
            const none = $$('input[name="medical_conditions"]', form).find(
              (x) => x.value === "None"
            );
            if (none) none.checked = false;
          }
          if (!valid) field.classList.add("error");
        })
      );
    }

    function collectPayload() {
      const payload = { source: "website", submitted_at: new Date().toISOString() };
      for (const name of Object.keys(VALIDATORS)) {
        const el = form.elements[name];
        if (!el) continue;
        if (name === "medical_conditions") {
          payload.medical_conditions = checkedBoxes().join(", ");
        } else {
          payload[name] = el.type === "checkbox" ? el.checked : el.value.trim();
        }
      }
      payload.notes = form.elements.notes.value.trim();
      return payload;
    }

    function setStatus(msg, isError) {
      status.textContent = msg;
      status.classList.toggle("error", Boolean(isError));
    }

    async function submit(payload) {
      if (!CONFIG.WEBHOOK_URL) {
        log.warn("WEBHOOK_URL is empty - running in preview mode. Configure config.js.");
        await new Promise((r) => setTimeout(r, 1100));
        return { ok: true, preview: true };
      }
      const controller = new AbortController();
      const timer = setTimeout(
        () => controller.abort(),
        CONFIG.REQUEST_TIMEOUT || 15000
      );
      try {
        const res = await fetch(CONFIG.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          /* non-JSON body */
        }
        if (!res.ok) {
          const err = new Error(
            (data && data.message) || `Server responded ${res.status}`
          );
          err.name = "HttpError";
          throw err;
        }
        if (data && data.success === false) {
          const err = new Error(
            data.message || "Your application could not be processed."
          );
          err.name = "WorkflowError";
          throw err;
        }
        return { ok: true, data };
      } finally {
        clearTimeout(timer);
      }
    }

    on(form, "submit", async (e) => {
      e.preventDefault();
      setStatus("");
      const firstInvalid = validateAll();
      if (firstInvalid) {
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
        setStatus("Please fix the highlighted fields.", true);
        firstInvalid.focus && firstInvalid.focus();
        return;
      }

      submitBtn.classList.add("loading");
      submitBtn.setAttribute("aria-busy", "true");
      setStatus("Forging your profile...");

      try {
        const result = await submit(collectPayload());
        if (result.preview) {
          log.info("Preview submission accepted:", collectPayload());
        }
        form.hidden = true;
        successBox.hidden = false;
        setTimeout(() => successBox.classList.add("show"), 30);
        successBox.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
      } catch (err) {
        log.error("Submission failed:", err);
        if (err.name === "AbortError") {
          setStatus("The request timed out. Please try again.", true);
        } else if (err.name === "HttpError" || err.name === "WorkflowError") {
          setStatus(err.message, true);
        } else {
          setStatus("Something went wrong. Please check your connection and retry.", true);
        }
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
      } finally {
        submitBtn.classList.remove("loading");
        submitBtn.removeAttribute("aria-busy");
      }
    });

    on($("#success-reset"), "click", () => {
      successBox.classList.remove("show");
      successBox.hidden = true;
      form.reset();
      form.hidden = false;
      $$(".field", form).forEach((f) => {
        f.classList.remove("error", "shake");
        const err = $(".field-error", f);
        if (err) err.textContent = "";
      });
      $("#medical_conditions").classList.remove("invalid");
      form.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
    });

    bindLiveValidation();
  }

  ready(() => {
    applyConfig();
    preloader();
    initNav();
    initReveals();
    initCounters();
    initMagnetic();
    initRipple();
    initAccordion();
    initSlider();
    initPricing();
    initForm();
    log.info("ready", { version: CONFIG.VERSION });
  });
})();
