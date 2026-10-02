/**
 * Global Navigation & Hamburger Drawer System
 * Handles multi-page navigation, hamburger drawer animations, and status indicators.
 */

const NavigationSystem = {
  currentPage: "",

  init() {
    this.determineCurrentPage();
    this.renderHeaderAndDrawer();
    this.attachEvents();
    this.syncPills();
  },

  determineCurrentPage() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    this.currentPage = path.replace(".html", "") || "index";
  },

  renderHeaderAndDrawer() {
    // If the page already has a hamburger button or drawer, attach events.
    // Otherwise, ensure drawer exists.
    let drawer = document.getElementById("sidebar-drawer");
    let overlay = document.getElementById("sidebar-overlay");

    if (!drawer) {
      overlay = document.createElement("div");
      overlay.id = "sidebar-overlay";
      overlay.className = "sidebar-overlay";

      drawer = document.createElement("aside");
      drawer.id = "sidebar-drawer";
      drawer.className = "sidebar-drawer";
      drawer.innerHTML = `
        <div class="drawer-header">
          <div class="brand-logo" onclick="location.href='index.html'">
            <div class="brand-icon">
              <i class="fa-brands fa-linux"></i>
            </div>
            <div class="brand-text">
              <h1 style="font-size: 1.1rem;">LTSP Mastery</h1>
              <div class="brand-tagline">Operating Systems & Linux</div>
            </div>
          </div>
          <button class="btn-drawer-close" id="btn-close-drawer" aria-label="Close menu">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="drawer-user-status">
          <div class="streak-navbar-badge" id="drawer-streak-pill" style="margin-bottom: 0.5rem; width: 100%; justify-content: center;">
            <i class="fa-solid fa-fire text-warning"></i> <span>1 Day Streak</span>
          </div>
          <div class="streak-navbar-badge" id="drawer-premium-pill" style="background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.25); width: 100%; justify-content: center;">
            <i class="fa-solid fa-lock text-muted"></i> <span>Premium: Locked</span>
          </div>
        </div>

        <nav class="drawer-nav">
          <div class="drawer-nav-section">
            <div class="drawer-section-title">Core Training</div>
            <a href="index.html" class="drawer-nav-item ${this.currentPage === 'index' ? 'active' : ''}">
              <i class="fa-solid fa-house"></i> <span>Dashboard & Hub</span>
            </a>
            <a href="curriculum.html" class="drawer-nav-item ${this.currentPage === 'curriculum' ? 'active' : ''}">
              <i class="fa-solid fa-graduation-cap"></i> <span>16 Modules Curriculum</span>
            </a>
            <a href="terminal.html" class="drawer-nav-item ${this.currentPage === 'terminal' ? 'active' : ''}">
              <i class="fa-solid fa-terminal"></i> <span>Interactive Linux Terminal</span>
            </a>
            <a href="tools.html" class="drawer-nav-item ${this.currentPage === 'tools' ? 'active' : ''}">
              <i class="fa-solid fa-calculator"></i> <span>Visual Tools & Calculators</span>
            </a>
          </div>

          <div class="drawer-nav-section">
            <div class="drawer-section-title">Advanced Engineering</div>
            <a href="language_builder.html" class="drawer-nav-item ${this.currentPage === 'language_builder' ? 'active' : ''}">
              <i class="fa-solid fa-code"></i> <span>Build a Language (Compiler)</span>
            </a>
            <a href="os_builder.html" class="drawer-nav-item ${this.currentPage === 'os_builder' ? 'active' : ''}">
              <i class="fa-solid fa-microchip"></i> <span>Build an Operating System</span>
            </a>
            <a href="reference.html" class="drawer-nav-item ${this.currentPage === 'reference' ? 'active' : ''}">
              <i class="fa-solid fa-bolt"></i> <span>Assembly & C Manuals</span>
            </a>
          </div>

          <div class="drawer-nav-section">
            <div class="drawer-section-title">Practice & Resources</div>
            <a href="practice.html" class="drawer-nav-item ${this.currentPage === 'practice' ? 'active' : ''}">
              <i class="fa-solid fa-list-check"></i> <span>Checklist, Quiz & Labs</span>
            </a>
            <a href="compendium.html" class="drawer-nav-item ${this.currentPage === 'compendium' ? 'active' : ''}">
              <i class="fa-solid fa-book"></i> <span>Command Compendium</span>
            </a>
            <a href="premium.html" class="drawer-nav-item ${this.currentPage === 'premium' ? 'active' : ''}" style="color: #fbbf24;">
              <i class="fa-solid fa-crown"></i> <span>Premium High System</span>
            </a>
          </div>
        </nav>

        <div class="drawer-footer">
          <div style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin-bottom: 0.35rem;">
            Created & Engineered by <a href="https://github.com/alexhack235-code/LTSP" target="_blank" style="color: #38bdf8; font-weight: 700; text-decoration: underline;">Alexander</a>
          </div>
          <div style="font-size: 0.72rem; color: #64748b; text-align: center;">
            <i class="fa-brands fa-github"></i> alexhack235-code/LTSP • Security Guard v4.2
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(drawer);
    }
  },

  attachEvents() {
    const hamburgerBtn = document.getElementById("btn-hamburger");
    const drawer = document.getElementById("sidebar-drawer");
    const overlay = document.getElementById("sidebar-overlay");
    const closeBtn = document.getElementById("btn-close-drawer");

    const openDrawer = () => {
      if (drawer && overlay) {
        drawer.classList.add("open");
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    };

    const closeDrawer = () => {
      if (drawer && overlay) {
        drawer.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    };

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener("click", openDrawer);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", closeDrawer);
    }
    if (overlay) {
      overlay.addEventListener("click", closeDrawer);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  },

  syncPills() {
    // Sync streak
    const streakData = JSON.parse(localStorage.getItem("lpic1_streak_tracker") || "null");
    const streak = streakData ? streakData.streak : 1;
    const day = streakData ? streakData.challengeDay : 1;

    const navPill = document.getElementById("nav-streak-pill");
    const drawerPill = document.getElementById("drawer-streak-pill");
    const text = `<i class="fa-solid fa-fire text-warning"></i> <span>${streak} Day Streak</span> <span style="opacity:0.4;">|</span> <span>Day ${day}/45</span>`;

    if (navPill) navPill.innerHTML = text;
    if (drawerPill) drawerPill.innerHTML = text;

    // Sync premium and apply Ultra-Vibrant theme
    const isUnlocked = localStorage.getItem("ltsp_premium_unlocked") === "true";
    const navPrem = document.getElementById("nav-premium-badge");
    const drawerPrem = document.getElementById("drawer-premium-pill");

    if (isUnlocked) {
      document.body.classList.add("theme-premium-active");

      const activeText = `<i class="fa-solid fa-crown" style="color:#fbbf24;"></i> <span style="color:#fbbf24;">VIP ACTIVE</span>`;
      if (navPrem) navPrem.innerHTML = activeText;
      if (drawerPrem) drawerPrem.innerHTML = activeText;

      // Add floating VIP indicator if not on premium page itself
      if (!document.getElementById("vip-floating-indicator") && !window.location.pathname.includes("premium.html")) {
        const vipBadge = document.createElement("div");
        vipBadge.id = "vip-floating-indicator";
        vipBadge.className = "vip-floating-indicator";
        vipBadge.innerHTML = `
          <i class="fa-solid fa-crown" style="color:#fbbf24;"></i>
          <span>VIP ARCHITECT ACTIVE</span>
          <span style="opacity:0.35;">•</span>
          <a href="premium.html" style="color:#fde68a; font-size:0.76rem; text-decoration:underline;">Open Hub</a>
        `;
        document.body.appendChild(vipBadge);
      }
    } else {
      document.body.classList.remove("theme-premium-active");
      const lockedText = `<i class="fa-solid fa-lock text-muted"></i> <span>Premium: Locked</span>`;
      if (navPrem) navPrem.innerHTML = lockedText;
      if (drawerPrem) drawerPrem.innerHTML = lockedText;

      const vipBadge = document.getElementById("vip-floating-indicator");
      if (vipBadge) vipBadge.remove();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  NavigationSystem.init();
});
