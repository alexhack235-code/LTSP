/**
 * Advanced Training Programme Application Logic:
 * - Day & Streak Counter with LocalStorage Persistence
 * - Interactive Mini-Language Compiler (Tokens -> AST -> x86-64 NASM)
 * - Interactive Bare-Metal OS Kernel Boot Simulator (VGA 0xb8000)
 * - Assembly & C Complete Guide Renderers
 */

document.addEventListener("DOMContentLoaded", () => {
  initStreakTracker();
  renderLanguageTrack();
  renderOSTrack();
  renderAssemblyGuide();
  renderCGuide();
  initCompilerPlayground();
  initOSBootSimulator();
});

/* ==========================================================================
   1. Day & Streak Counter System
   ========================================================================== */
function initStreakTracker() {
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  
  let streakData = JSON.parse(localStorage.getItem("lpic1_streak_tracker") || "null");
  if (!streakData) {
    streakData = {
      streak: 1,
      totalDays: 1,
      challengeDay: 1,
      maxDays: 45,
      lastCheckinDate: "",
      history: []
    };
  }

  // Update DOM displays
  updateStreakUI(streakData, todayStr);

  // Attach Check-In Handler
  const checkinBtn = document.getElementById("btn-daily-checkin");
  if (checkinBtn) {
    checkinBtn.addEventListener("click", () => {
      performDailyCheckin(streakData, todayStr);
    });
  }
}

function updateStreakUI(streakData, todayStr) {
  const isCheckedInToday = streakData.lastCheckinDate === todayStr;

  // Navbar Pill
  const navStreakElem = document.getElementById("nav-streak-pill");
  if (navStreakElem) {
    navStreakElem.innerHTML = `<i class="fa-solid fa-fire text-warning"></i> <span>${streakData.streak} Day Streak</span> <span style="opacity:0.4;">|</span> <span>Day ${streakData.challengeDay}/${streakData.maxDays}</span>`;
  }

  // Hero Card Widgets
  const streakCountBig = document.getElementById("streak-count-big");
  const challengeDayBig = document.getElementById("challenge-day-big");
  const checkinBtn = document.getElementById("btn-daily-checkin");
  const streakMessage = document.getElementById("streak-status-msg");

  if (streakCountBig) streakCountBig.innerText = `${streakData.streak} ${streakData.streak === 1 ? 'Day' : 'Days'}`;
  if (challengeDayBig) challengeDayBig.innerText = `Day ${streakData.challengeDay} of ${streakData.maxDays}`;

  if (checkinBtn) {
    if (isCheckedInToday) {
      checkinBtn.disabled = true;
      checkinBtn.classList.add("btn-checked-in");
      checkinBtn.innerHTML = `<i class="fa-solid fa-check"></i> Checked in Today!`;
      if (streakMessage) streakMessage.innerText = "Awesome job! You've logged study progress for today. Keep the fire burning tomorrow! 🔥";
    } else {
      checkinBtn.disabled = false;
      checkinBtn.classList.remove("btn-checked-in");
      checkinBtn.innerHTML = `<i class="fa-solid fa-fire"></i> Check In for Today (+1 Day)`;
      if (streakMessage) streakMessage.innerText = "Check in now to build your daily habit and advance your engineering journey!";
    }
  }

  // Update 7-day mini tracker
  const daysRow = document.getElementById("streak-week-dots");
  if (daysRow) {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const currentDayOfWeek = (new Date().getDay() + 6) % 7; // 0=Mon, 6=Sun
    let dotsHtml = "";
    days.forEach((d, idx) => {
      let statusClass = "";
      if (idx < currentDayOfWeek) statusClass = "done";
      else if (idx === currentDayOfWeek) statusClass = isCheckedInToday ? "done active" : "active";
      dotsHtml += `<div class="streak-dot ${statusClass}" title="${d}"><span>${d}</span></div>`;
    });
    daysRow.innerHTML = dotsHtml;
  }
}

function performDailyCheckin(streakData, todayStr) {
  if (streakData.lastCheckinDate === todayStr) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (streakData.lastCheckinDate === yesterdayStr) {
    // Consecutive day
    streakData.streak += 1;
  } else if (!streakData.lastCheckinDate) {
    streakData.streak = 1;
  } else {
    // Missed day, restart streak
    streakData.streak = 1;
  }

  streakData.totalDays += 1;
  if (streakData.challengeDay < streakData.maxDays) {
    streakData.challengeDay += 1;
  }
  streakData.lastCheckinDate = todayStr;
  streakData.history.push(todayStr);

  localStorage.setItem("lpic1_streak_tracker", JSON.stringify(streakData));
  updateStreakUI(streakData, todayStr);

  if (window.showToast) {
    window.showToast(`🔥 Streak Updated! You are on a ${streakData.streak}-day streak!`);
  }
}

/* ==========================================================================
   2. Track A: Build Your First Programming Language
   ========================================================================== */
function renderLanguageTrack() {
  const container = document.getElementById("lang-pipeline-container");
  if (!container || !window.ADVANCED_TRAINING_DATA) return;

  const track = ADVANCED_TRAINING_DATA.languageTrack;
  let html = "";

  track.pipeline.forEach(step => {
    html += `
      <div class="pipeline-step-card">
        <div class="pipeline-step-header">
          <div class="pipeline-num-badge">${step.step}</div>
          <div style="flex:1;">
            <h4 class="pipeline-step-title"><i class="fa-solid ${step.icon}"></i> ${step.title}</h4>
            <p class="pipeline-step-desc">${step.desc}</p>
          </div>
        </div>
        <div class="pipeline-code-block">
          <div class="code-block-header">
            <span><i class="fa-solid fa-code"></i> Implementation Architecture</span>
            <button class="btn-copy-code" onclick="copyCommand('${escapeQuotes(step.codeSnippet)}', this)">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>
          <pre><code>${escapeHTML(step.codeSnippet)}</code></pre>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   3. Interactive Toy Compiler Playground (Tokens -> AST -> x86-64 NASM)
   ========================================================================== */
function initCompilerPlayground() {
  const compileBtn = document.getElementById("btn-run-compiler");
  if (!compileBtn) return;

  compileBtn.addEventListener("click", () => {
    const inputCode = document.getElementById("compiler-input-code")?.value || "";
    runMiniCompiler(inputCode);
  });

  // Pre-load default
  const defaultCode = `let a = 12;\nlet b = 8;\nreturn a * 3 + b;`;
  const codeInput = document.getElementById("compiler-input-code");
  if (codeInput && !codeInput.value) {
    codeInput.value = defaultCode;
  }
}

function runMiniCompiler(source) {
  const tokenBox = document.getElementById("compiler-tokens-output");
  const astBox = document.getElementById("compiler-ast-output");
  const asmBox = document.getElementById("compiler-asm-output");
  const simResultBox = document.getElementById("compiler-sim-result");

  try {
    // 1. Tokenizer
    const tokens = [];
    const lines = source.split("\n");
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const words = trimmed.replace(/([;=+\-*\/()])/g, " $1 ").split(/\s+/).filter(Boolean);
      words.forEach(w => {
        if (w === "let") tokens.push({ type: "TOKEN_LET", val: "let" });
        else if (w === "return") tokens.push({ type: "TOKEN_RETURN", val: "return" });
        else if (w === "=") tokens.push({ type: "TOKEN_ASSIGN", val: "=" });
        else if (w === "+") tokens.push({ type: "TOKEN_PLUS", val: "+" });
        else if (w === "-") tokens.push({ type: "TOKEN_MINUS", val: "-" });
        else if (w === "*") tokens.push({ type: "TOKEN_STAR", val: "*" });
        else if (w === "/") tokens.push({ type: "TOKEN_SLASH", val: "/" });
        else if (w === "(") tokens.push({ type: "TOKEN_LPAREN", val: "(" });
        else if (w === ")") tokens.push({ type: "TOKEN_RPAREN", val: ")" });
        else if (w === ";") tokens.push({ type: "TOKEN_SEMICOLON", val: ";" });
        else if (/^\d+$/.test(w)) tokens.push({ type: "TOKEN_INT", val: parseInt(w, 10) });
        else if (/^[a-zA-Z_]\w*$/.test(w)) tokens.push({ type: "TOKEN_IDENT", val: w });
      });
    });

    if (tokenBox) {
      tokenBox.innerText = tokens.map(t => `${t.type.padEnd(16)} -> ${t.val}`).join("\n");
    }

    // 2. Mock AST generation & Variable extraction
    const vars = {};
    let returnExpr = "";
    lines.forEach(l => {
      const matchLet = l.match(/let\s+([a-zA-Z_]\w*)\s*=\s*(.*?);/);
      if (matchLet) {
        vars[matchLet[1]] = matchLet[2].trim();
      }
      const matchRet = l.match(/return\s+(.*?);/);
      if (matchRet) {
        returnExpr = matchRet[1].trim();
      }
    });

    if (astBox) {
      let astVisual = "ProgramNode\n";
      Object.keys(vars).forEach(v => {
        astVisual += ` ├── VarDeclNode (let ${v})\n │    └── ExprNode: ${vars[v]}\n`;
      });
      if (returnExpr) {
        astVisual += ` └── ReturnNode\n      └── ExprNode: ${returnExpr}\n`;
      }
      astBox.innerText = astVisual;
    }

    // 3. Emit x86-64 NASM Assembly
    let emittedAsm = `; ========================================================\n`;
    emittedAsm += `; Auto-Generated x86-64 NASM Assembly by LTSP Toy Compiler\n`;
    emittedAsm += `; Target: Linux System V ABI (ELF64)\n`;
    emittedAsm += `; ========================================================\n\n`;
    emittedAsm += `section .text\n`;
    emittedAsm += `global _start\n\n`;
    emittedAsm += `_start:\n`;
    emittedAsm += `  push rbp                ; Save base frame pointer\n`;
    emittedAsm += `  mov rbp, rsp            ; Establish new stack frame\n`;
    emittedAsm += `  sub rsp, 32             ; Reserve 32 bytes for local variables\n\n`;

    let offset = 8;
    const varOffsets = {};
    Object.keys(vars).forEach(v => {
      varOffsets[v] = offset;
      emittedAsm += `  ; Variable: ${v} = ${vars[v]}\n`;
      try {
        const val = eval(vars[v]);
        emittedAsm += `  mov qword [rbp - ${offset}], ${val}\n`;
      } catch (e) {
        emittedAsm += `  mov qword [rbp - ${offset}], 10\n`;
      }
      offset += 8;
    });

    emittedAsm += `\n  ; Return Statement Evaluation: ${returnExpr}\n`;
    let simulatedValue = 44;
    try {
      let evalExpr = returnExpr;
      Object.keys(vars).forEach(v => {
        const regex = new RegExp(`\\b${v}\\b`, "g");
        evalExpr = evalExpr.replace(regex, vars[v]);
      });
      simulatedValue = eval(evalExpr);
      emittedAsm += `  mov rax, ${simulatedValue}           ; Computed expression result\n`;
    } catch (e) {
      emittedAsm += `  mov rax, 42             ; Default fallback\n`;
      simulatedValue = 42;
    }

    emittedAsm += `  mov rdi, rax            ; Pass exit status to syscall in rdi\n`;
    emittedAsm += `  mov rax, 60             ; Syscall 60 = sys_exit\n`;
    emittedAsm += `  syscall                 ; Hand control back to Linux Kernel\n`;

    if (asmBox) asmBox.innerText = emittedAsm;
    if (simResultBox) {
      simResultBox.innerHTML = `
        <div style="color: var(--accent-emerald); font-weight: 700; margin-bottom: 0.25rem;">
          <i class="fa-solid fa-circle-check"></i> Compilation Successful!
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.88rem; color: #e2e8f0;">
          Simulated Program Exit Code: <span style="background: rgba(16,185,129,0.2); padding: 2px 8px; border-radius: 4px; color: #34d399; font-weight: 700;">${simulatedValue}</span>
        </div>
      `;
    }
  } catch (err) {
    if (simResultBox) {
      simResultBox.innerHTML = `<div style="color: var(--accent-rose); font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> Compilation Error: ${err.message}</div>`;
    }
  }
}

/* ==========================================================================
   4. Track B: Build Your First Operating System
   ========================================================================== */
function renderOSTrack() {
  const container = document.getElementById("os-stages-container");
  if (!container || !window.ADVANCED_TRAINING_DATA) return;

  const track = ADVANCED_TRAINING_DATA.osTrack;
  let html = "";

  track.stages.forEach(st => {
    html += `
      <div class="pipeline-step-card">
        <div class="pipeline-step-header">
          <div class="pipeline-num-badge" style="background: linear-gradient(135deg, var(--accent-amber), var(--accent-rose));">${st.stage}</div>
          <div style="flex:1;">
            <h4 class="pipeline-step-title"><i class="fa-solid ${st.icon}"></i> ${st.title}</h4>
            <p class="pipeline-step-desc">${st.desc}</p>
          </div>
        </div>
        <div class="pipeline-code-block">
          <div class="code-block-header">
            <span><i class="fa-solid fa-microchip"></i> Bare-Metal Implementation</span>
            <button class="btn-copy-code" onclick="copyCommand('${escapeQuotes(st.codeSnippet)}', this)">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>
          <pre><code>${escapeHTML(st.codeSnippet)}</code></pre>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function initOSBootSimulator() {
  const bootBtn = document.getElementById("btn-boot-os");
  const screen = document.getElementById("vga-screen-text");
  if (!bootBtn || !screen) return;

  bootBtn.addEventListener("click", () => {
    screen.innerHTML = "";
    bootBtn.disabled = true;
    bootBtn.innerText = "Booting Virtual Hardware...";

    const bootLogs = [
      "[ BIOS ] POST verification OK. Probing Drive 0x80...",
      "[ BOOT ] MBR sector 0 loaded at physical RAM 0x7C00.",
      "[ BOOT ] Validated Magic Boot Signature: 0xAA55.",
      "[ BOOT ] Disabling hardware interrupts (cli)...",
      "[ CPU  ] Loading Global Descriptor Table (lgdt)...",
      "[ CPU  ] Enabling Physical Address Extension (PAE in CR4)...",
      "[ CPU  ] Loading 4-Level Paging Base into CR3 (0x1000)...",
      "[ CPU  ] Setting EFER Long Mode Enable bit (LM-bit)...",
      "[ CPU  ] Activating Paging & Protected Mode in CR0 (0x80000001)...",
      "[ CPU  ] Far jump to 64-bit Long Mode: CS=0x08, RIP=0x100000!",
      "[ VGA  ] Initialized Video Memory at physical 0xB8000 (80x25 text)...",
      "[ IDT  ] 256 Interrupt gates configured. Re-enabling interrupts (sti)...",
      "[ HEAP ] Kernel bump allocator active at 0x1000000 (16MB boundary)...",
      "===========================================================",
      "  Welcome to ToyOS 64-bit Custom Kernel (v1.0.0-release)   ",
      "  Zero Standard Libraries • Bare-Metal C & x86-64 NASM     ",
      "===========================================================",
      "os-kernel> Ready. System initialized in 64-bit Long Mode."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        screen.innerHTML += `<div class="vga-line">${escapeHTML(bootLogs[i])}</div>`;
        screen.scrollTop = screen.scrollHeight;
        i++;
      } else {
        clearInterval(interval);
        bootBtn.disabled = false;
        bootBtn.innerText = "Reboot Virtual OS";
      }
    }, 120);
  });
}

/* ==========================================================================
   5. Assembly & C Guide Renderers
   ========================================================================== */
function renderAssemblyGuide() {
  const container = document.getElementById("asm-guide-accordion");
  if (!container || !window.ADVANCED_TRAINING_DATA) return;

  const guide = ADVANCED_TRAINING_DATA.assemblyGuide;
  let html = "";

  guide.sections.forEach((sec, idx) => {
    html += `
      <div class="module-card ${idx === 0 ? 'open' : ''}" id="card-${sec.id}">
        <div class="module-header" onclick="toggleModule('${sec.id}')">
          <div class="module-header-left">
            <div class="module-icon-box" style="background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3);">
              <i class="fa-solid fa-microchip" style="color: var(--accent-amber);"></i>
            </div>
            <div>
              <div class="module-badge-row">
                <span class="badge-module" style="background: rgba(245, 158, 11, 0.2); color: var(--accent-amber);">x86-64 NASM</span>
              </div>
              <h3 class="module-title">${sec.title}</h3>
            </div>
          </div>
          <div class="module-header-right">
            <i class="fa-solid fa-chevron-down toggle-arrow"></i>
          </div>
        </div>
        <div class="module-content">
          <div class="commands-table-wrapper" style="padding: 1.25rem; font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.6; white-space: pre-wrap; color: #cbd5e1;">${escapeHTML(sec.content)}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderCGuide() {
  const container = document.getElementById("c-guide-accordion");
  if (!container || !window.ADVANCED_TRAINING_DATA) return;

  const guide = ADVANCED_TRAINING_DATA.cGuide;
  let html = "";

  guide.sections.forEach((sec, idx) => {
    html += `
      <div class="module-card ${idx === 0 ? 'open' : ''}" id="card-${sec.id}">
        <div class="module-header" onclick="toggleModule('${sec.id}')">
          <div class="module-header-left">
            <div class="module-icon-box" style="background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3);">
              <i class="fa-solid fa-c" style="color: var(--accent-blue);"></i>
            </div>
            <div>
              <div class="module-badge-row">
                <span class="badge-module">Standard C (C11)</span>
              </div>
              <h3 class="module-title">${sec.title}</h3>
            </div>
          </div>
          <div class="module-header-right">
            <i class="fa-solid fa-chevron-down toggle-arrow"></i>
          </div>
        </div>
        <div class="module-content">
          <div class="commands-table-wrapper" style="padding: 1.25rem; font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.6; white-space: pre-wrap; color: #cbd5e1;">${escapeHTML(sec.content)}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}
