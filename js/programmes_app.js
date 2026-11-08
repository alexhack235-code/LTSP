/**
 * LTSP - Training Programmes Hub Controller
 * Renders categorized tracks, curriculum previews, and active track switcher.
 * 
 * Created & Engineered by Alexander (@alexhack235-code)
 */

const ProgrammesApp = {
  activeCategory: "all",
  searchQuery: "",

  init() {
    this.renderProgrammes();
    this.attachEvents();
    this.highlightEnrolledTrack();
  },

  renderProgrammes() {
    const container = document.getElementById("programmes-grid");
    if (!container) return;

    const enrolledId = localStorage.getItem("ltsp_active_programme") || "prog-lpic1";

    const filtered = TRAINING_PROGRAMMES.filter(p => {
      if (this.activeCategory !== "all" && p.category !== this.activeCategory) {
        return false;
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const match = p.title.toLowerCase().includes(q) ||
                      p.subtitle.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q) ||
                      p.tags.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    const countEl = document.getElementById("programmes-count-badge");
    if (countEl) countEl.innerText = `${filtered.length} Programmes Available`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <i class="fa-solid fa-graduation-cap" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h4 style="color: #fff; font-size: 1.2rem; font-weight: 700;">No Programmes Match Your Search</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
            Try clearing search keywords or switching category filters.
          </p>
          <button class="btn-secondary" onclick="ProgrammesApp.resetFilters()" style="margin-top: 1rem;">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const isEnrolled = (p.id === enrolledId);
      const badgeStyle = this.getBadgeStyle(p.badgeColor);

      return `
        <div class="programme-card ${isEnrolled ? 'enrolled-card' : ''}">
          <div class="prog-card-top">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span class="badge-tag" style="${badgeStyle}">
                <i class="fa-solid ${p.icon}"></i> ${p.badge}
              </span>
              ${isEnrolled ? `
                <span class="badge-tag" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.35);">
                  <i class="fa-solid fa-circle-check"></i> Enrolled Active
                </span>
              ` : `
                <button class="btn-enroll-track" onclick="ProgrammesApp.enrollTrack('${p.id}')" title="Set as primary active training track">
                  <i class="fa-regular fa-star"></i> Set Active
                </button>
              `}
            </div>

            <h3 class="prog-title">${p.title}</h3>
            <div class="prog-subtitle">${p.subtitle}</div>
            
            <p class="prog-desc">${p.description}</p>
          </div>

          <div class="prog-meta-grid">
            <div class="prog-meta-item">
              <i class="fa-solid fa-signal text-cyan"></i>
              <div>
                <span class="meta-label">Level</span>
                <span class="meta-val">${p.level}</span>
              </div>
            </div>
            <div class="prog-meta-item">
              <i class="fa-solid fa-clock text-warning"></i>
              <div>
                <span class="meta-label">Duration</span>
                <span class="meta-val">${p.duration}</span>
              </div>
            </div>
            <div class="prog-meta-item">
              <i class="fa-solid fa-certificate text-emerald"></i>
              <div>
                <span class="meta-label">Target Credential</span>
                <span class="meta-val">${p.certification}</span>
              </div>
            </div>
            <div class="prog-meta-item">
              <i class="fa-solid fa-layer-group text-purple"></i>
              <div>
                <span class="meta-label">Curriculum</span>
                <span class="meta-val">${p.modulesCount} Modules</span>
              </div>
            </div>
          </div>

          <!-- Key Outcomes & Highlights -->
          <div style="margin: 1.25rem 0;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
              Core Learning Outcomes:
            </div>
            <ul class="prog-outcomes-list">
              ${p.learningOutcomes.slice(0, 3).map(o => `
                <li><i class="fa-solid fa-check text-cyan"></i> <span>${o}</span></li>
              `).join("")}
            </ul>
          </div>

          <!-- Tags -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.5rem;">
            ${p.tags.map(t => `<span class="tag-chip">${t}</span>`).join("")}
          </div>

          <!-- Action Buttons -->
          <div class="prog-actions-row">
            <a href="${p.primaryLink}" class="btn-primary" style="flex: 1; justify-content: center; font-size: 0.9rem;">
              ${p.primaryLinkText} <i class="fa-solid fa-arrow-right"></i>
            </a>
            ${p.secondaryLink ? `
              <a href="${p.secondaryLink}" class="btn-secondary" style="font-size: 0.85rem; padding: 0.65rem 0.9rem;">
                ${p.secondaryLinkText}
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");
  },

  getBadgeStyle(color) {
    switch (color) {
      case "emerald":
        return "background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.3);";
      case "blue":
        return "background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3);";
      case "purple":
        return "background: rgba(168, 85, 247, 0.15); color: #c084fc; border-color: rgba(168, 85, 247, 0.3);";
      case "amber":
        return "background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3);";
      case "cyan":
        return "background: rgba(6, 182, 212, 0.15); color: #22d3ee; border-color: rgba(6, 182, 212, 0.3);";
      case "rose":
        return "background: rgba(244, 63, 94, 0.15); color: #fb7185; border-color: rgba(244, 63, 94, 0.3);";
      default:
        return "background: rgba(255, 255, 255, 0.1); color: #fff;";
    }
  },

  enrollTrack(id) {
    const prog = getProgrammeById(id);
    if (!prog) return;

    localStorage.setItem("ltsp_active_programme", id);
    this.renderProgrammes();

    // Show toast notification
    if (window.showToast) {
      window.showToast(`Active Track Updated to: ${prog.title}`);
    } else {
      alert(`Success! You have selected "${prog.title}" as your primary learning track.`);
    }
  },

  highlightEnrolledTrack() {
    const enrolledId = localStorage.getItem("ltsp_active_programme") || "prog-lpic1";
    const prog = getProgrammeById(enrolledId);
    const badgeEl = document.getElementById("active-enrolled-banner");
    if (badgeEl && prog) {
      badgeEl.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fa-solid fa-compass" style="color: #38bdf8; font-size: 1.4rem;"></i>
            <div>
              <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Your Current Active Training Track</div>
              <div style="font-size: 1.05rem; color: #fff; font-weight: 700;">${prog.title}</div>
            </div>
          </div>
          <a href="${prog.primaryLink}" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
            Continue Track <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      `;
      badgeEl.classList.remove("hidden");
    }
  },

  resetFilters() {
    this.activeCategory = "all";
    this.searchQuery = "";

    const searchInput = document.getElementById("programmes-search-input");
    if (searchInput) searchInput.value = "";

    const catButtons = document.querySelectorAll(".cat-filter-btn");
    catButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.cat === "all"));

    this.renderProgrammes();
  },

  attachEvents() {
    const searchInput = document.getElementById("programmes-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderProgrammes();
      });
    }

    const catButtons = document.querySelectorAll(".cat-filter-btn");
    catButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        catButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeCategory = btn.dataset.cat || "all";
        this.renderProgrammes();
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ProgrammesApp.init();
});
