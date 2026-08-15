/* ============================================================
   Lucky Kumar Yadav — Portfolio frontend
   Renders from /api/profile (Node or PHP). Falls back to
   embedded data so the page works even without a server.
   ============================================================ */
(function () {
  "use strict";

  /* Embedded fallback (mirrors data/profile.json) */
  const FALLBACK = {
    basics: {
      name: "Lucky Kumar Yadav",
      title: "Software Development Engineer in Test (SDET) / Automation Engineer",
      tagline: "Automation-first engineer building reliable web, real-time & AI-powered products.",
      location: "Noida, Uttar Pradesh, India",
      email: "lucky902657@gmail.com",
      phone: "+91 9026575414",
      linkedin: "https://www.linkedin.com/in/yadav-lucky",
      resumeFile: "resume-source/Lucky Kumar Yadav (1).pdf"
    },
    summary: "Software professional with 2.7+ years of experience in automation engineering and software development environments, with hands-on experience in JavaScript, Node.js, web applications, SQL/MySQL, REST APIs, and automation.",
    highlights: [
      "2.7+ years building automation, web & real-time systems",
      "JavaScript & Node.js across development and test workflows",
      "REST API integration, SQL/MySQL data operations",
      "Playwright + Postman API testing & quality automation",
      "Docker, Git/GitHub, and AI-powered CLI tooling"
    ],
    experience: [
      {
        role: "Software Development Engineer in Test (SDET)",
        company: "Webkul Software Pvt. Ltd.",
        location: "Noida, Uttar Pradesh",
        period: "Dec 2023 — Present",
        points: [
          "2.7+ years working across web applications, e-commerce platforms, real-time systems, and AI-powered solutions.",
          "Developed automation solutions using JavaScript, Playwright, API Testing, Postman, SQL/MySQL, and REST APIs.",
          "Worked with Node.js, HTML, CSS, OOP concepts, Git, GitHub, Docker, and AI-powered CLI tools.",
          "Collaborated with development teams on requirements, application workflows, database operations, troubleshooting, and software delivery."
        ]
      }
    ],
    education: [
      { degree: "Master of Computer Applications (MCA)", school: "CSJM University, Kanpur, Uttar Pradesh", score: "74.34%", period: "July 2023" }
    ],
    projects: [
      { id: "realtime-chat", title: "Real-Time Chat System", category: "Web / Real-Time", tech: ["JavaScript", "Node.js", "HTML", "CSS", "GitHub", "Vercel"], summary: "A real-time chat application with a web-based interface, built on Node.js and deployed to the cloud.", description: "Developed a real-time chat application using JavaScript and Node.js with a web-based interface. Managed source code through GitHub and deployed the application using Vercel.", features: ["WebSocket-based real-time messaging", "Web-based responsive chat interface", "Version-controlled with GitHub", "CI/CD deployment on Vercel"], links: {} },
      { id: "magento-automation", title: "E-Commerce Automation — Magento 2", category: "Automation / E-Commerce", tech: ["Magento 2", "CLI Automation", "Node.js", "JavaScript"], summary: "CLI-driven automation that streamlines repetitive Magento 2 development and operational workflows.", description: "Automated repetitive Magento 2 development and operational workflows using CLI-based automation tools. Streamlined recurring tasks to reduce manual effort and improve development efficiency.", features: ["CLI automation of recurring store operations", "Reduced manual effort on repetitive tasks", "Improved development & operational efficiency", "Scripted workflows for Magento 2 environments"], links: {} },
      { id: "ai-tools-chatbots", title: "AI-Powered Tools & Chatbots", category: "AI / Web", tech: ["AI Tools", "WhatsApp AI Bots", "Headless Next.js", "Node.js"], summary: "Company projects delivering AI-powered tools and WhatsApp AI bots with headless Next.js front-ends.", description: "Worked on company projects involving AI-powered tools and WhatsApp AI bots for automated workflows and user interactions. Worked with headless Next.js applications and automation workflows for web-based solutions.", features: ["WhatsApp AI bots for automated user interactions", "AI-powered internal & customer-facing tools", "Headless Next.js application development", "Automation workflows for web-based solutions"], links: {} }
    ],
    skills: [
      { group: "Programming", items: ["JavaScript", "C++"] },
      { group: "Web & Backend", items: ["HTML", "CSS", "Node.js", "Next.js"] },
      { group: "Software Engineering", items: ["REST APIs", "JSON", "OOP Concepts"] },
      { group: "SDET & Automation", items: ["Playwright", "API Testing", "Postman", "AI-Powered Automation (CLI Tools)"] },
      { group: "Database", items: ["SQL", "MySQL"] },
      { group: "Tools", items: ["Git", "GitHub", "Docker"] }
    ],
    contactNote: "Open to SDET, Automation and Full-Stack opportunities. Reach out via the form or directly by email."
  };

  const ROLES = [
    "SDET",
    "Automation Engineer",
    "Node.js Developer",
    "Quality & Tooling Engineer"
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  let DATA = FALLBACK;

  /* ---------- Theme ---------- */
  function initTheme() {
    const saved = localStorage.getItem("theme");
    const theme = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeIcon();
    $("#themeToggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateThemeIcon();
    });
  }
  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    $(".theme-icon").textContent = isDark ? "🌙" : "☀️";
  }

  /* ---------- Navbar ---------- */
  function initNav() {
    const nav = $("#navbar");
    const links = $("#navLinks");
    const toggle = $("#navToggle");
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 10);
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      $("#scrollProgress").style.width = Math.min(100, Math.max(0, pct)) + "%";
    });
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
      links.classList.remove("open"); toggle.classList.remove("open");
    }));
    // active link on scroll
    const sections = $$("main section[id]");
    const navMap = {};
    $$("#navLinks a").forEach(a => { navMap[a.getAttribute("href").slice(1)] = a; });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $$("#navLinks a").forEach(a => a.classList.remove("active"));
          if (navMap[e.target.id]) navMap[e.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => obs.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".reveal, .skill-card, .project-card, .timeline-item, .edu-card").forEach(n => obs.observe(n));
  }

  /* ---------- Typing ---------- */
  function initTyping() {
    const target = $("#typed");
    if (!target) return;
    let ri = 0, ci = 0, deleting = false;
    function tick() {
      const word = ROLES[ri];
      target.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(tick, 90); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1400); }
      else if (deleting && ci > 0) { ci--; setTimeout(tick, 45); }
      else { deleting = false; ri = (ri + 1) % ROLES.length; setTimeout(tick, 300); }
    }
    tick();
  }

  /* ---------- Render ---------- */
  function render() {
    const b = DATA.basics;
    document.title = `${b.name} — ${b.title}`;
    $("#heroName").textContent = b.name;
    $("#heroTagline").textContent = b.tagline;
    $("#avatarInitials").textContent = b.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

    const cv = $("#downloadCv");
    cv.setAttribute("href", b.resumeFile);

    // social
    const social = $("#heroSocial");
    social.innerHTML = "";
    const socials = [
      { label: "in", href: b.linkedin, title: "LinkedIn" },
      { label: "@", href: "mailto:" + b.email, title: "Email" },
      { label: "☎", href: "tel:" + b.phone.replace(/\s+/g, ""), title: "Call" }
    ];
    socials.forEach(s => {
      const a = el("a", null, s.label);
      a.href = s.href; a.title = s.title; if (s.label === "@") a.setAttribute("aria-label", "Email");
      social.appendChild(a);
    });

    // hero facts
    const facts = $("#heroFacts");
    facts.innerHTML = "";
    [["Role", "SDET / Automation"], ["Experience", "2.7+ yrs"], ["Location", b.location.split(",")[0]]].forEach(([k, v]) => {
      const li = el("li"); li.innerHTML = `${k} <b>${v}</b>`; facts.appendChild(li);
    });

    // about
    $("#aboutSummary").textContent = DATA.summary;
    const hl = $("#aboutHighlights"); hl.innerHTML = "";
    DATA.highlights.forEach(h => hl.appendChild(el("li", null, h)));

    const info = $("#infoList"); info.innerHTML = "";
    [["Name", b.name], ["Title", b.title], ["Location", b.location], ["Email", `<a href="mailto:${b.email}">${b.email}</a>`], ["Phone", `<a href="tel:${b.phone.replace(/\s+/g, "")}">${b.phone}</a>`]].forEach(([k, v]) => {
      const li = el("li"); li.innerHTML = `<b>${k}</b><span>${v}</span>`; info.appendChild(li);
    });

    // skills
    const sg = $("#skillsGrid"); sg.innerHTML = "";
    DATA.skills.forEach(s => {
      const card = el("div", "skill-card");
      const h = el("h3", null, s.group);
      const chips = el("div", "chips");
      s.items.forEach(i => chips.appendChild(el("span", "chip", i)));
      card.append(h, chips); sg.appendChild(card);
    });

    // experience
    const tl = $("#timeline"); tl.innerHTML = "";
    DATA.experience.forEach(x => {
      const item = el("div", "timeline-item");
      const card = el("div", "timeline-card");
      const ul = el("ul");
      x.points.forEach(p => ul.appendChild(el("li", null, p)));
      card.innerHTML = `<div class="role">${x.role}</div><div class="company">${x.company}</div><div class="meta">${x.location} · ${x.period}</div>`;
      card.appendChild(ul); item.appendChild(card); tl.appendChild(item);
    });

    // projects
    const pg = $("#projectsGrid"); pg.innerHTML = "";
    DATA.projects.forEach(p => {
      const card = el("article", "project-card");
      const tech = p.tech.map(t => `<span class="chip">${t}</span>`).join("");
      card.innerHTML = `<span class="project-cat">${p.category}</span><h3>${p.title}</h3><p>${p.summary}</p><div class="project-tech">${tech}</div>`;
      card.addEventListener("click", () => openModal(p));
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
      pg.appendChild(card);
    });

    // education
    const eg = $("#educationGrid"); eg.innerHTML = "";
    DATA.education.forEach(e => {
      const card = el("div", "edu-card");
      card.innerHTML = `<div class="edu-badge">🎓</div><div><h3>${e.degree}</h3><div class="school">${e.school}</div><div class="score">${e.score} · ${e.period}</div></div>`;
      eg.appendChild(card);
    });

    // contact
    $("#contactNote").textContent = DATA.contactNote;
    const cl = $("#contactList"); cl.innerHTML = "";
    [["Email", `<a href="mailto:${b.email}">${b.email}</a>`], ["Phone", `<a href="tel:${b.phone.replace(/\s+/g, "")}">${b.phone}</a>`], ["Location", b.location], ["LinkedIn", `<a href="${b.linkedin}" target="_blank" rel="noopener">${b.linkedin.replace("https://", "")}</a>`]].forEach(([k, v]) => {
      const li = el("li"); li.innerHTML = `<b>${k}</b><span>${v}</span>`; cl.appendChild(li);
    });

    $("#year").textContent = new Date().getFullYear();
    initReveal();
  }

  /* ---------- Modal ---------- */
  function openModal(p) {
    $("#modalCat").textContent = p.category;
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.description;
    const tech = $("#modalTech"); tech.innerHTML = "";
    p.tech.forEach(t => tech.appendChild(el("span", "chip", t)));
    const feats = $("#modalFeatures"); feats.innerHTML = "";
    (p.features || []).forEach(f => feats.appendChild(el("li", null, f)));
    const links = $("#modalLinks"); links.innerHTML = "";
    if (p.links && p.links.repo) { const a = el("a", "btn btn-outline btn-sm", "Source"); a.href = p.links.repo; a.target = "_blank"; a.rel = "noopener"; links.appendChild(a); }
    if (p.links && p.links.live) { const a = el("a", "btn btn-primary btn-sm", "Live Demo"); a.href = p.links.live; a.target = "_blank"; a.rel = "noopener"; links.appendChild(a); }
    const m = $("#projectModal"); m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    const m = $("#projectModal"); m.classList.remove("open"); m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function initModal() {
    $$("#projectModal [data-close]").forEach(b => b.addEventListener("click", closeModal));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    const form = $("#contactForm");
    const status = $("#formStatus");
    const setErr = (name, msg) => {
      const f = form.querySelector(`[name="${name}"]`).closest(".field");
      f.classList.toggle("invalid", !!msg);
      f.querySelector(".error").textContent = msg || "";
    };
    const validate = () => {
      let ok = true;
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const msg = form.elements.message.value.trim();
      if (name.length < 2) { setErr("name", "Please enter your name."); ok = false; } else setErr("name", "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("email", "Enter a valid email."); ok = false; } else setErr("email", "");
      if (msg.length < 10) { setErr("message", "Message should be at least 10 characters."); ok = false; } else setErr("message", "");
      return ok;
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form-status"; status.textContent = "";
      if (!validate()) return;
      const payload = { name: form.name.value.trim(), email: form.email.value.trim(), message: form.message.value.trim() };
      const btn = $("#contactSubmit"); btn.disabled = true; btn.textContent = "Sending…";
      try {
        const res = await postContact(payload);
        status.className = "form-status ok";
        status.textContent = res.message || "Thanks! Your message has been received.";
        form.reset();
      } catch (err) {
        status.className = "form-status err";
        status.textContent = err.message || "Could not send message. Please email me directly.";
      } finally {
        btn.disabled = false; btn.textContent = "Send Message";
      }
    });
  }
  async function postContact(payload) {
    const endpoints = ["/api/contact", "/api/contact.php"];
    let lastErr;
    for (const ep of endpoints) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 6000);
        const res = await fetch(ep, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), signal: ctrl.signal
        });
        clearTimeout(t);
        if (!res.ok) throw new Error("Server responded " + res.status);
        return await res.json();
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error("Network error");
  }

  /* ---------- Load live data ---------- */
  async function loadData() {
    try {
      const res = await fetch("/api/profile", { headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error("status " + res.status);
      const json = await res.json();
      if (json && json.basics) DATA = json;
    } catch (_) { /* use fallback */ }
    render();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initTyping();
    initModal();
    initForm();
    loadData();
  });
})();
