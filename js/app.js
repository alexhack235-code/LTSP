/**
 * Main Application Logic for LPIC-1 Training Programme Platform
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Components
  initNavigation();
  renderCurriculum();
  renderChecklist();
  renderQuiz();
  renderScenarios();
  renderCompendium();
  initOctalCalculator();
  initFHSExplorer();
  initRedirectionExplorer();

  // Initialize Terminal
  if (document.getElementById("terminal-container")) {
    window.terminalInstance = new LinuxTerminal("terminal-container");
  }

  // Toast Notification System
  window.showToast = function(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  };

  // Copy to clipboard helper
  window.copyCommand = function(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(`Copied to clipboard: "${text}"`);
      if (btnElement) {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
        btnElement.classList.add("btn-copied");
        setTimeout(() => {
          btnElement.innerHTML = originalText;
          btnElement.classList.remove("btn-copied");
        }, 1800);
      }
    }).catch(err => {
      console.error("Copy failed", err);
    });
  };
});

/* -------------------------------------------------------------
 * Tab Navigation
 * ----------------------------------------------------------- */
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      navButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const activePane = document.getElementById(targetTab);
      if (activePane) {
        activePane.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Re-focus terminal if navigated to terminal tab
      if (targetTab === "tab-terminal" && window.terminalInstance) {
        setTimeout(() => {
          const input = document.getElementById("term-input");
          if (input) input.focus();
        }, 150);
      }
    });
  });

  // Mobile menu toggle if present
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("main-nav");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("nav-open");
    });
  }
}

/* -------------------------------------------------------------
 * Curriculum & Module Rendering
 * ----------------------------------------------------------- */
function renderCurriculum() {
  const container = document.getElementById("modules-accordion");
  if (!container) return;

  let html = "";
  TRAINING_DATA.modules.forEach((mod, index) => {
    const isFirst = index === 0;
    html += `
      <div class="module-card ${isFirst ? 'open' : ''}" id="mod-${mod.id}">
        <div class="module-header" onclick="toggleModule('${mod.id}')">
          <div class="module-header-left">
            <div class="module-icon-box">
              <i class="fa-solid ${mod.icon}"></i>
            </div>
            <div>
              <div class="module-badge-row">
                <span class="badge-module">Module ${mod.num}</span>
                <span class="badge-tag">${mod.badge}</span>
              </div>
              <h3 class="module-title">${mod.title}</h3>
            </div>
          </div>
          <div class="module-header-right">
            <span class="cmd-count">${mod.commands.length} Commands</span>
            <i class="fa-solid fa-chevron-down toggle-arrow"></i>
          </div>
        </div>

        <div class="module-content">
          <div class="module-summary-box">
            <p class="module-desc">${mod.summary}</p>
            <div class="beginner-analogy-box">
              <div class="analogy-badge"><i class="fa-solid fa-lightbulb"></i> Beginner "Aha!" Analogy</div>
              <p class="analogy-text">${mod.beginnerAnalogy}</p>
            </div>
          </div>

          <div class="concepts-section">
            <h4 class="section-subheading"><i class="fa-solid fa-brain"></i> Essential Operating System Concepts</h4>
            <div class="concepts-grid">
              ${mod.keyConcepts.map(kc => `
                <div class="concept-card">
                  <h5 class="concept-title">${kc.name}</h5>
                  <p class="concept-text">${kc.explanation}</p>
                </div>
              `).join("")}
            </div>
          </div>

          ${mod.commands.length > 0 ? `
            <div class="commands-section">
              <h4 class="section-subheading"><i class="fa-solid fa-terminal"></i> Command Reference & Syntax</h4>
              <div class="commands-table-wrapper">
                <table class="commands-table">
                  <thead>
                    <tr>
                      <th style="width: 180px;">Command</th>
                      <th>Purpose & Function</th>
                      <th>Practical Example</th>
                      <th style="width: 90px;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${mod.commands.map(cmd => `
                      <tr>
                        <td><span class="cmd-name">${cmd.cmd}</span></td>
                        <td>
                          <div class="cmd-purpose">${cmd.purpose}</div>
                          ${cmd.tip ? `<div class="cmd-tip"><i class="fa-solid fa-info-circle"></i> ${cmd.tip}</div>` : ""}
                        </td>
                        <td>
                          <div class="cmd-example-block">
                            <code>${escapeHTML(cmd.example)}</code>
                          </div>
                        </td>
                        <td>
                          <button class="btn-copy-code" onclick="copyCommand('${escapeQuotes(cmd.example)}', this)" title="Copy example to clipboard">
                            <i class="fa-regular fa-copy"></i> Copy
                          </button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ""}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.toggleModule = function(modId) {
  const card = document.getElementById(`mod-${modId}`);
  if (card) {
    card.classList.toggle("open");
  }
};

/* -------------------------------------------------------------
 * LPIC-1 Practice Checklist
 * ----------------------------------------------------------- */
function renderChecklist() {
  const container = document.getElementById("checklist-container");
  const statsElem = document.getElementById("checklist-stats");
  const progressFill = document.getElementById("checklist-progress-bar");
  if (!container) return;

  const savedState = JSON.parse(localStorage.getItem("lpic1_checklist") || "{}");

  let html = "";
  TRAINING_DATA.checklist.forEach(item => {
    const isChecked = !!savedState[item.id];
    html += `
      <div class="checklist-item ${isChecked ? 'completed' : ''}" id="item-${item.id}">
        <label class="custom-checkbox">
          <input type="checkbox" data-id="${item.id}" ${isChecked ? 'checked' : ''} onchange="toggleChecklistItem('${item.id}')" />
          <span class="checkmark"><i class="fa-solid fa-check"></i></span>
        </label>
        <div class="checklist-content">
          <span class="checklist-category-badge">${item.category}</span>
          <p class="checklist-text">${item.text}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateChecklistProgress();
}

window.toggleChecklistItem = function(id) {
  const savedState = JSON.parse(localStorage.getItem("lpic1_checklist") || "{}");
  const checkbox = document.querySelector(`input[data-id="${id}"]`);
  const itemElem = document.getElementById(`item-${id}`);

  if (checkbox.checked) {
    savedState[id] = true;
    if (itemElem) itemElem.classList.add("completed");
  } else {
    delete savedState[id];
    if (itemElem) itemElem.classList.remove("completed");
  }

  localStorage.setItem("lpic1_checklist", JSON.stringify(savedState));
  updateChecklistProgress();
};

function updateChecklistProgress() {
  const savedState = JSON.parse(localStorage.getItem("lpic1_checklist") || "{}");
  const total = TRAINING_DATA.checklist.length;
  const completed = Object.keys(savedState).length;
  const pct = Math.round((completed / total) * 100);

  const statsElem = document.getElementById("checklist-stats");
  const progressFill = document.getElementById("checklist-progress-bar");
  const pctElem = document.getElementById("checklist-pct");

  if (statsElem) statsElem.innerText = `${completed} of ${total} Core Competencies Mastered`;
  if (pctElem) pctElem.innerText = `${pct}% Complete`;
  if (progressFill) progressFill.style.width = `${pct}%`;
}

window.resetChecklist = function() {
  if (confirm("Reset all checklist progress?")) {
    localStorage.removeItem("lpic1_checklist");
    renderChecklist();
    window.showToast("Checklist progress reset.");
  }
};

window.masterAllChecklist = function() {
  const state = {};
  TRAINING_DATA.checklist.forEach(i => state[i.id] = true);
  localStorage.setItem("lpic1_checklist", JSON.stringify(state));
  renderChecklist();
  window.showToast("All items marked complete!");
};

/* -------------------------------------------------------------
 * Interactive Knowledge Quiz
 * ----------------------------------------------------------- */
let currentQuizAnswers = {};

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  let html = "";
  TRAINING_DATA.quiz.forEach((q, idx) => {
    html += `
      <div class="quiz-card" id="quiz-card-${idx}">
        <div class="quiz-q-num">Question ${idx + 1} of ${TRAINING_DATA.quiz.length}</div>
        <h4 class="quiz-question">${q.question}</h4>
        <div class="quiz-options-list">
          ${q.options.map((opt, oIdx) => `
            <button class="quiz-option-btn" id="q-${idx}-opt-${oIdx}" onclick="selectQuizOption(${idx}, ${oIdx})">
              <span class="opt-letter">${String.fromCharCode(65 + oIdx)}</span>
              <span class="opt-label">${opt}</span>
            </button>
          `).join("")}
        </div>
        <div class="quiz-explanation hidden" id="quiz-exp-${idx}">
          <div class="exp-title"><i class="fa-solid fa-circle-info"></i> Explanation</div>
          <p class="exp-text">${q.explanation}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateQuizScore();
}

window.selectQuizOption = function(qIdx, optIdx) {
  if (currentQuizAnswers[qIdx] !== undefined) return; // already answered

  currentQuizAnswers[qIdx] = optIdx;
  const qData = TRAINING_DATA.quiz[qIdx];
  const isCorrect = optIdx === qData.answer;

  const clickedBtn = document.getElementById(`q-${qIdx}-opt-${optIdx}`);
  const expBox = document.getElementById(`quiz-exp-${qIdx}`);

  if (isCorrect) {
    if (clickedBtn) clickedBtn.classList.add("correct");
  } else {
    if (clickedBtn) clickedBtn.classList.add("wrong");
    const correctBtn = document.getElementById(`q-${qIdx}-opt-${qData.answer}`);
    if (correctBtn) correctBtn.classList.add("correct");
  }

  // Disable all options for this question
  qData.options.forEach((_, i) => {
    const btn = document.getElementById(`q-${qIdx}-opt-${i}`);
    if (btn) btn.disabled = true;
  });

  if (expBox) expBox.classList.remove("hidden");
  updateQuizScore();
};

function updateQuizScore() {
  const answered = Object.keys(currentQuizAnswers).length;
  let correctCount = 0;
  Object.keys(currentQuizAnswers).forEach(qIdx => {
    if (currentQuizAnswers[qIdx] === TRAINING_DATA.quiz[qIdx].answer) {
      correctCount++;
    }
  });

  const scoreElem = document.getElementById("quiz-score-badge");
  if (scoreElem) {
    scoreElem.innerText = `Score: ${correctCount} / ${answered} (${TRAINING_DATA.quiz.length} Total)`;
  }
}

window.restartQuiz = function() {
  currentQuizAnswers = {};
  renderQuiz();
  window.showToast("Quiz restarted!");
};

/* -------------------------------------------------------------
 * Interactive Octal Permission Calculator
 * ----------------------------------------------------------- */
function initOctalCalculator() {
  const checkboxes = document.querySelectorAll(".perm-calc-check");
  checkboxes.forEach(cb => {
    cb.addEventListener("change", updateOctalDisplay);
  });
  updateOctalDisplay();
}

function updateOctalDisplay() {
  const uR = document.getElementById("calc-u-r")?.checked ? 4 : 0;
  const uW = document.getElementById("calc-u-w")?.checked ? 2 : 0;
  const uX = document.getElementById("calc-u-x")?.checked ? 1 : 0;
  const uTotal = uR + uW + uX;

  const gR = document.getElementById("calc-g-r")?.checked ? 4 : 0;
  const gW = document.getElementById("calc-g-w")?.checked ? 2 : 0;
  const gX = document.getElementById("calc-g-x")?.checked ? 1 : 0;
  const gTotal = gR + gW + gX;

  const oR = document.getElementById("calc-o-r")?.checked ? 4 : 0;
  const oW = document.getElementById("calc-o-w")?.checked ? 2 : 0;
  const oX = document.getElementById("calc-o-x")?.checked ? 1 : 0;
  const oTotal = oR + oW + oX;

  const octalStr = `${uTotal}${gTotal}${oTotal}`;
  const symbolicStr = `-${uR ? 'r':'—'}${uW ? 'w':'—'}${uX ? 'x':'—'}${gR ? 'r':'—'}${gW ? 'w':'—'}${gX ? 'x':'—'}${oR ? 'r':'—'}${oW ? 'w':'—'}${oX ? 'x':'—'}`;

  const octalDisplay = document.getElementById("calc-octal-result");
  const symDisplay = document.getElementById("calc-symbolic-result");
  const cmdDisplay = document.getElementById("calc-cmd-preview");
  const explainDisplay = document.getElementById("calc-explanation");

  if (octalDisplay) octalDisplay.innerText = octalStr;
  if (symDisplay) symDisplay.innerText = symbolicStr;
  if (cmdDisplay) cmdDisplay.innerText = `chmod ${octalStr} filename`;

  // Human Explanation
  let exp = `Owner has ${getPermLabel(uTotal)}; Group has ${getPermLabel(gTotal)}; Others have ${getPermLabel(oTotal)}.`;
  if (octalStr === "755") exp += " (Standard for scripts, binaries & directories)";
  if (octalStr === "644") exp += " (Standard for read-only configuration & documentation)";
  if (octalStr === "600") exp += " (Standard for private SSH keys & credentials)";
  if (octalStr === "700") exp += " (Standard for private user directories like ~/.ssh)";
  if (octalStr === "777") exp += " (⚠️ WARNING: Insecure! Anyone on the machine can modify or delete this file!)";

  if (explainDisplay) explainDisplay.innerText = exp;
}

function getPermLabel(val) {
  switch (val) {
    case 7: return "Read, Write & Execute";
    case 6: return "Read & Write";
    case 5: return "Read & Execute";
    case 4: return "Read Only";
    case 3: return "Write & Execute";
    case 2: return "Write Only";
    case 1: return "Execute Only";
    case 0: return "No Access (None)";
    default: return "";
  }
}

/* -------------------------------------------------------------
 * Filesystem Hierarchy Standard (FHS) Explorer
 * ----------------------------------------------------------- */
const FHS_DATA = {
  "/": "The Root directory. The absolute top of the entire filesystem tree. Everything originates here.",
  "/bin": "Essential user command binaries required for single-user mode (e.g. ls, cp, bash, cat).",
  "/boot": "Kernel executable images (vmlinuz), initramfs ramdisks, and GRUB bootloader configuration.",
  "/dev": "Device nodes representing hardware peripherals (e.g. /dev/sda disk, /dev/null, /dev/urandom).",
  "/etc": "Host-specific system-wide configuration files (e.g. /etc/passwd, /etc/fstab, /etc/ssh/).",
  "/home": "User home directories containing personal user data, profiles, and ~/.bashrc configurations.",
  "/lib": "Essential shared libraries needed by binaries in /bin and /sbin, and kernel modules (/lib/modules).",
  "/media": "Mount points for removable media (USB thumb drives, external disks, CD-ROMs).",
  "/mnt": "Temporarily mounted filesystems (used by sysadmins to inspect rescue drives).",
  "/opt": "Add-on optional application software packages (third-party tools like Google Chrome, Docker).",
  "/proc": "Virtual pseudo-filesystem providing real-time metrics and kernel data directly from memory.",
  "/root": "The home directory for the root superuser (separated from /home in case /home is on another disk).",
  "/run": "Runtime variable data for system processes since boot (PIDs, UNIX sockets, lock files).",
  "/sbin": "Essential system administration binaries (e.g. fdisk, mkfs, iptables, reboot, ip).",
  "/sys": "Sysfs virtual filesystem exposing kernel device drivers, buses, and hardware hierarchy.",
  "/tmp": "Temporary files wiped on reboot. Standard permissions are 1777 (with sticky bit).",
  "/usr": "Secondary hierarchy for read-only user data, binaries (/usr/bin), libraries, and documentation.",
  "/var": "Variable data that grows over time: logs (/var/log), spool files, mail, and web files (/var/www)."
};

function initFHSExplorer() {
  const buttons = document.querySelectorAll(".fhs-node-btn");
  const descBox = document.getElementById("fhs-description");
  const pathTitle = document.getElementById("fhs-path-title");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const path = btn.getAttribute("data-fhs");
      if (pathTitle) pathTitle.innerText = path;
      if (descBox) descBox.innerText = FHS_DATA[path] || "Standard directory.";
    });
  });
}

/* -------------------------------------------------------------
 * Redirection & Operator Visualizer
 * ----------------------------------------------------------- */
const REDIR_DATA = {
  "stdout-overwrite": {
    syntax: "command > file.txt",
    title: "Overwrite Standard Output (FD 1)",
    desc: "Captures stdout and writes it to file.txt. If file.txt exists, its prior contents are erased completely!",
    stream: "Output (1) ───[ > ]───> file.txt (Wipes existing)"
  },
  "stdout-append": {
    syntax: "command >> file.txt",
    title: "Append Standard Output (FD 1)",
    desc: "Appends new lines to the end of file.txt. Preserves all existing contents.",
    stream: "Output (1) ───[ >> ]───> file.txt (Adds to bottom)"
  },
  "stderr-redirect": {
    syntax: "command 2> error.log",
    title: "Redirect Standard Error (FD 2)",
    desc: "Captures only error messages (stream 2) to error.log, while regular output (stream 1) still displays on terminal.",
    stream: "Errors (2) ───[ 2> ]───> error.log"
  },
  "merged-output": {
    syntax: "command > all.log 2>&1",
    title: "Merge stdout and stderr into Single File",
    desc: "Redirects stdout to all.log, then instructs stderr (2) to follow stdout's destination (&1).",
    stream: "Stdout (1) ──> all.log <── Stderr (2)"
  },
  "pipeline": {
    syntax: "cmd1 | cmd2",
    title: "Pipeline (Connecting Streams)",
    desc: "Takes the stdout of cmd1 and feeds it directly as the stdin of cmd2 in real-time.",
    stream: "[cmd1 stdout] ═══════> [cmd2 stdin]"
  },
  "logical-and": {
    syntax: "cmd1 && cmd2",
    title: "Logical AND Chaining",
    desc: "cmd2 executes ONLY if cmd1 terminates successfully with exit code 0.",
    stream: "cmd1 (exit == 0) ? Run cmd2 : Stop"
  }
};

function initRedirectionExplorer() {
  const buttons = document.querySelectorAll(".redir-tab-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.getAttribute("data-redir");
      const data = REDIR_DATA[key];
      if (!data) return;

      const titleElem = document.getElementById("redir-title");
      const syntaxElem = document.getElementById("redir-syntax");
      const descElem = document.getElementById("redir-desc");
      const streamElem = document.getElementById("redir-stream-diagram");

      if (titleElem) titleElem.innerText = data.title;
      if (syntaxElem) syntaxElem.innerText = data.syntax;
      if (descElem) descElem.innerText = data.desc;
      if (streamElem) streamElem.innerText = data.stream;
    });
  });
}

/* -------------------------------------------------------------
 * Hands-on Labs & Scenarios
 * ----------------------------------------------------------- */
function renderScenarios() {
  const container = document.getElementById("scenarios-container");
  if (!container) return;

  let html = "";
  TRAINING_DATA.scenarios.forEach(sc => {
    html += `
      <div class="tool-card scenario-card" id="${sc.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div class="tool-card-title" style="margin-bottom: 0;">
            <i class="fa-solid ${sc.icon}" style="color: var(--accent-cyan);"></i> ${sc.title}
          </div>
          <span class="badge-tag">${sc.badge}</span>
        </div>
        <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid var(--accent-rose); padding: 0.85rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 1.25rem;">
          <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--accent-rose); margin-bottom: 0.25rem;">
            <i class="fa-solid fa-triangle-exclamation"></i> Emergency Challenge
          </div>
          <p style="font-size: 0.92rem; color: #fecdd3; line-height: 1.45;">${sc.challenge}</p>
        </div>
        <div>
          <h5 style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--accent-emerald); margin-bottom: 0.65rem;">
            <i class="fa-solid fa-check-circle"></i> Recommended Resolution Steps
          </h5>
          <ol style="margin-left: 1.25rem; font-size: 0.88rem; color: #cbd5e1; line-height: 1.6;">
            ${sc.solution.map(step => `<li style="margin-bottom: 0.45rem;">${step}</li>`).join("")}
          </ol>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* -------------------------------------------------------------
 * Command Compendium Table & Live Search
 * ----------------------------------------------------------- */
function renderCompendium() {
  const tbody = document.getElementById("compendium-tbody");
  const countElem = document.getElementById("compendium-match-count");
  if (!tbody) return;

  const allCmds = [];
  TRAINING_DATA.modules.forEach(m => {
    m.commands.forEach(c => {
      allCmds.push({
        ...c,
        moduleNum: m.num,
        moduleTitle: m.title
      });
    });
  });

  window.compendiumCommands = allCmds;
  displayFilteredCompendium(allCmds);

  // Attach search listeners
  const searchInput = document.getElementById("compendium-search-input");
  const moduleFilter = document.getElementById("compendium-module-filter");

  if (searchInput) {
    searchInput.addEventListener("input", filterCompendium);
  }
  if (moduleFilter) {
    // Populate module options
    let optHtml = `<option value="all">All Modules (0-15)</option>`;
    TRAINING_DATA.modules.forEach(m => {
      if (m.commands.length > 0) {
        optHtml += `<option value="${m.num}">Module ${m.num}: ${m.title}</option>`;
      }
    });
    moduleFilter.innerHTML = optHtml;
    moduleFilter.addEventListener("change", filterCompendium);
  }
}

function filterCompendium() {
  const query = (document.getElementById("compendium-search-input")?.value || "").toLowerCase().trim();
  const selectedMod = document.getElementById("compendium-module-filter")?.value || "all";

  const filtered = window.compendiumCommands.filter(c => {
    const matchesMod = selectedMod === "all" || c.moduleNum.toString() === selectedMod;
    const matchesQuery = !query ||
      c.cmd.toLowerCase().includes(query) ||
      c.purpose.toLowerCase().includes(query) ||
      c.example.toLowerCase().includes(query) ||
      (c.tip && c.tip.toLowerCase().includes(query));
    return matchesMod && matchesQuery;
  });

  displayFilteredCompendium(filtered);
}

function displayFilteredCompendium(cmds) {
  const tbody = document.getElementById("compendium-tbody");
  const countElem = document.getElementById("compendium-match-count");
  if (!tbody) return;

  if (countElem) countElem.innerText = `Showing ${cmds.length} commands`;

  if (cmds.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">No matching commands found.</td></tr>`;
    return;
  }

  let html = "";
  cmds.forEach(c => {
    html += `
      <tr>
        <td><span class="badge-tag">Mod ${c.moduleNum}</span></td>
        <td><code class="cmd-name">${c.cmd}</code></td>
        <td>
          <div class="cmd-purpose">${c.purpose}</div>
          ${c.tip ? `<div class="cmd-tip"><i class="fa-solid fa-lightbulb"></i> ${c.tip}</div>` : ""}
        </td>
        <td><code class="cmd-example-block">${escapeHTML(c.example)}</code></td>
        <td>
          <button class="btn-copy-code" onclick="copyCommand('${escapeQuotes(c.example)}', this)" title="Copy to clipboard">
            <i class="fa-regular fa-copy"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/* -------------------------------------------------------------
 * Utility functions
 * ----------------------------------------------------------- */
function escapeHTML(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeQuotes(str) {
  return (str || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
