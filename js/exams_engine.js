/**
 * LTSP - Certification Exam Simulator & Exam Centres Locator Engine
 * Features:
 * 1. Timed Proctored Exam Engine (Multiple Choice & Performance-Based Command Line)
 * 2. Real-time Domain Diagnostics & Score Computation
 * 3. Personalized Printable Certificate of Completion
 * 4. Interactive Worldwide Exam Centre Directory & Search Locator
 * 
 * Created & Engineered by Alexander (@alexhack235-code)
 */

const ExamSystem = {
  // Current active exam state
  state: {
    examId: "lpic1-101",
    candidateName: "Alexander Student",
    currentIndex: 0,
    answers: {},        // { qId: selectedOption or array or text }
    flagged: new Set(),
    remainingSeconds: 90 * 60,
    timerInterval: null,
    isSubmitted: false,
    results: null
  },

  // Directory filter state
  centresState: {
    activeRegion: "all",
    searchQuery: ""
  },

  init() {
    this.initURLParams();
    this.renderCentresList();
    this.attachCentresEvents();
    this.attachExamEvents();
  },

  initURLParams() {
    const params = new URLSearchParams(window.location.search);
    const examParam = params.get("exam");
    if (examParam && CERTIFICATION_EXAMS[examParam]) {
      this.state.examId = examParam;
      const selector = document.getElementById("exam-select-picker");
      if (selector) selector.value = examParam;
    }
  },

  // =========================================================================
  // EXAM SIMULATOR ENGINE
  // =========================================================================
  startExam() {
    const examData = CERTIFICATION_EXAMS[this.state.examId];
    if (!examData) return;

    const nameInput = document.getElementById("candidate-name-input");
    this.state.candidateName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : "Candidate Systems Architect";

    this.state.currentIndex = 0;
    this.state.answers = {};
    this.state.flagged.clear();
    this.state.remainingSeconds = examData.durationMinutes * 60;
    this.state.isSubmitted = false;
    this.state.results = null;

    // Switch view
    document.getElementById("exam-pre-start-card")?.classList.add("hidden");
    document.getElementById("exam-results-card")?.classList.add("hidden");
    document.getElementById("exam-active-panel")?.classList.remove("hidden");

    // Start timer
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);
    this.updateTimerDisplay();
    this.state.timerInterval = setInterval(() => this.tickTimer(), 1000);

    // Render first question & nav pills
    this.renderQuestionNavPills();
    this.renderCurrentQuestion();
  },

  tickTimer() {
    this.state.remainingSeconds--;
    this.updateTimerDisplay();

    if (this.state.remainingSeconds <= 0) {
      clearInterval(this.state.timerInterval);
      alert("Time Expired! Submitting your exam now...");
      this.submitExam();
    }
  },

  updateTimerDisplay() {
    const timerEl = document.getElementById("exam-timer-display");
    if (!timerEl) return;

    const minutes = Math.floor(this.state.remainingSeconds / 60);
    const seconds = this.state.remainingSeconds % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    timerEl.innerHTML = `<i class="fa-solid fa-clock"></i> ${formatted}`;

    if (this.state.remainingSeconds < 300) {
      timerEl.style.color = "#f43f5e";
      timerEl.style.borderColor = "#f43f5e";
    } else {
      timerEl.style.color = "#38bdf8";
      timerEl.style.borderColor = "rgba(56, 189, 248, 0.3)";
    }
  },

  renderQuestionNavPills() {
    const container = document.getElementById("exam-q-nav-pills");
    if (!container) return;

    const exam = CERTIFICATION_EXAMS[this.state.examId];
    let html = "";

    exam.questions.forEach((q, idx) => {
      const isAnswered = this.state.answers[q.id] !== undefined && this.state.answers[q.id] !== "";
      const isFlagged = this.state.flagged.has(q.id);
      const isCurrent = idx === this.state.currentIndex;

      let classes = "q-nav-pill";
      if (isCurrent) classes += " current";
      if (isAnswered) classes += " answered";
      if (isFlagged) classes += " flagged";

      html += `
        <button class="${classes}" onclick="ExamSystem.jumpToQuestion(${idx})" title="Question ${idx + 1}">
          ${idx + 1}
          ${isFlagged ? '<span class="q-flag-dot"><i class="fa-solid fa-flag"></i></span>' : ''}
        </button>
      `;
    });

    container.innerHTML = html;
  },

  jumpToQuestion(idx) {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    if (idx >= 0 && idx < exam.questions.length) {
      this.state.currentIndex = idx;
      this.renderQuestionNavPills();
      this.renderCurrentQuestion();
    }
  },

  prevQuestion() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.renderQuestionNavPills();
      this.renderCurrentQuestion();
    }
  },

  nextQuestion() {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    if (this.state.currentIndex < exam.questions.length - 1) {
      this.state.currentIndex++;
      this.renderQuestionNavPills();
      this.renderCurrentQuestion();
    }
  },

  toggleFlagCurrent() {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    const q = exam.questions[this.state.currentIndex];
    if (this.state.flagged.has(q.id)) {
      this.state.flagged.delete(q.id);
    } else {
      this.state.flagged.add(q.id);
    }
    this.renderQuestionNavPills();
    this.renderCurrentQuestion();
  },

  renderCurrentQuestion() {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    const q = exam.questions[this.state.currentIndex];
    const container = document.getElementById("exam-question-body");
    if (!container || !q) return;

    const isFlagged = this.state.flagged.has(q.id);
    const savedAnswer = this.state.answers[q.id];

    let optionsHtml = "";

    if (q.type === "single") {
      optionsHtml = `
        <div class="exam-options-list">
          ${q.options.map((opt, i) => `
            <label class="exam-option-card ${savedAnswer === i ? 'selected' : ''}" onclick="ExamSystem.recordAnswer(${i})">
              <input type="radio" name="exam_opt" value="${i}" ${savedAnswer === i ? 'checked' : ''} />
              <span class="exam-opt-letter">${String.fromCharCode(65 + i)}</span>
              <span class="exam-opt-text">${opt}</span>
            </label>
          `).join("")}
        </div>
      `;
    } else if (q.type === "multi") {
      const selectedArray = Array.isArray(savedAnswer) ? savedAnswer : [];
      optionsHtml = `
        <div class="exam-options-list">
          ${q.options.map((opt, i) => {
            const checked = selectedArray.includes(i);
            return `
              <label class="exam-option-card ${checked ? 'selected' : ''}" onclick="ExamSystem.toggleMultiAnswer(${i})">
                <input type="checkbox" value="${i}" ${checked ? 'checked' : ''} />
                <span class="exam-opt-letter">${String.fromCharCode(65 + i)}</span>
                <span class="exam-opt-text">${opt}</span>
              </label>
            `;
          }).join("")}
        </div>
      `;
    } else if (q.type === "command") {
      optionsHtml = `
        <div class="exam-command-box">
          <div style="font-size: 0.85rem; color: #38bdf8; margin-bottom: 0.5rem; font-family: var(--font-mono);">
            <i class="fa-solid fa-terminal"></i> Performance Command Terminal Input
          </div>
          <div class="exam-term-input-wrapper">
            <span class="exam-term-prompt">student@ltsp:~$</span>
            <input 
              type="text" 
              class="exam-cmd-input" 
              id="exam-cmd-field" 
              placeholder="${q.placeholder || 'Type Linux command...'}" 
              value="${savedAnswer || ''}" 
              oninput="ExamSystem.recordCommand(this.value)"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.4rem;">
            Type the exact executable command with flags and arguments.
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="exam-q-header">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <span class="badge-tag" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border-color: rgba(56, 189, 248, 0.3);">
            Question ${this.state.currentIndex + 1} of ${exam.questions.length}
          </span>
          <span class="badge-tag" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border-color: rgba(16, 185, 129, 0.3);">
            ${q.domain}
          </span>
          <span class="badge-tag" style="background: rgba(245, 158, 11, 0.12); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3);">
            ${q.type === 'single' ? 'Single Choice' : (q.type === 'multi' ? 'Multiple Choice' : 'Performance Command')}
          </span>
        </div>
        <button class="btn-flag-toggle ${isFlagged ? 'active' : ''}" onclick="ExamSystem.toggleFlagCurrent()">
          <i class="fa-solid fa-flag"></i> ${isFlagged ? 'Flagged for Review' : 'Flag Question'}
        </button>
      </div>

      <div class="exam-q-text">
        ${q.question}
      </div>

      ${optionsHtml}
    `;

    // Update bottom nav buttons
    const btnPrev = document.getElementById("btn-exam-prev");
    const btnNext = document.getElementById("btn-exam-next");
    if (btnPrev) btnPrev.disabled = (this.state.currentIndex === 0);
    if (btnNext) {
      if (this.state.currentIndex === exam.questions.length - 1) {
        btnNext.innerHTML = `Review All <i class="fa-solid fa-list-check"></i>`;
      } else {
        btnNext.innerHTML = `Next <i class="fa-solid fa-arrow-right"></i>`;
      }
    }
  },

  recordAnswer(optionIdx) {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    const q = exam.questions[this.state.currentIndex];
    this.state.answers[q.id] = optionIdx;
    this.renderQuestionNavPills();
    this.renderCurrentQuestion();
  },

  toggleMultiAnswer(optionIdx) {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    const q = exam.questions[this.state.currentIndex];
    let arr = Array.isArray(this.state.answers[q.id]) ? [...this.state.answers[q.id]] : [];

    const existingIdx = arr.indexOf(optionIdx);
    if (existingIdx >= 0) {
      arr.splice(existingIdx, 1);
    } else {
      arr.push(optionIdx);
    }

    this.state.answers[q.id] = arr;
    this.renderQuestionNavPills();
    this.renderCurrentQuestion();
  },

  recordCommand(val) {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    const q = exam.questions[this.state.currentIndex];
    this.state.answers[q.id] = val.trim();
    this.renderQuestionNavPills();
  },

  // Review Summary Modal before final submit
  openReviewScreen() {
    const exam = CERTIFICATION_EXAMS[this.state.examId];
    const modal = document.getElementById("exam-review-modal");
    if (!modal) return;

    let answeredCount = 0;
    let flaggedCount = this.state.flagged.size;

    exam.questions.forEach(q => {
      if (this.state.answers[q.id] !== undefined && this.state.answers[q.id] !== "") {
        answeredCount++;
      }
    });

    const unansweredCount = exam.questions.length - answeredCount;

    let rowsHtml = exam.questions.map((q, idx) => {
      const isAns = this.state.answers[q.id] !== undefined && this.state.answers[q.id] !== "";
      const isFlg = this.state.flagged.has(q.id);
      return `
        <div class="review-q-row" onclick="ExamSystem.closeReviewModal(); ExamSystem.jumpToQuestion(${idx});">
          <div style="font-weight: 700; color: #fff; width: 40px;">#${idx + 1}</div>
          <div style="flex: 1; font-size: 0.88rem; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${q.question}
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${isAns ? '<span class="status-pill status-pill-done"><i class="fa-solid fa-check"></i> Answered</span>' : '<span class="status-pill status-pill-unanswered"><i class="fa-solid fa-circle-question"></i> Incomplete</span>'}
            ${isFlg ? '<span class="status-pill status-pill-flagged"><i class="fa-solid fa-flag"></i> Flagged</span>' : ''}
          </div>
        </div>
      `;
    }).join("");

    modal.innerHTML = `
      <div class="review-modal-content">
        <div class="review-modal-header">
          <h3 style="color: #fff; font-size: 1.3rem; font-weight: 800;">
            <i class="fa-solid fa-clipboard-check text-cyan"></i> Exam Review Screen
          </h3>
          <button class="btn-drawer-close" onclick="ExamSystem.closeReviewModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="review-summary-metrics">
          <div class="review-stat-box">
            <div class="review-stat-num text-emerald">${answeredCount}</div>
            <div class="review-stat-label">Answered</div>
          </div>
          <div class="review-stat-box">
            <div class="review-stat-num text-warning">${unansweredCount}</div>
            <div class="review-stat-label">Unanswered</div>
          </div>
          <div class="review-stat-box">
            <div class="review-stat-num" style="color: #f59e0b;">${flaggedCount}</div>
            <div class="review-stat-label">Flagged for Review</div>
          </div>
        </div>

        <div class="review-questions-list">
          ${rowsHtml}
        </div>

        <div style="display: flex; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
          <button class="btn-secondary" onclick="ExamSystem.closeReviewModal()">
            <i class="fa-solid fa-arrow-left"></i> Return to Exam
          </button>
          <button class="btn-primary" onclick="ExamSystem.closeReviewModal(); ExamSystem.submitExam();" style="background: linear-gradient(135deg, #10b981, #059669);">
            <i class="fa-solid fa-check-double"></i> End Exam & Compute Official Score
          </button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  closeReviewModal() {
    const modal = document.getElementById("exam-review-modal");
    if (modal) modal.classList.remove("open");
  },

  // Score Calculation & Results Computation
  submitExam() {
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);
    this.state.isSubmitted = true;

    const exam = CERTIFICATION_EXAMS[this.state.examId];
    let correctCount = 0;
    const domainScores = {};

    // Initialize domain trackers
    exam.domains.forEach(d => {
      domainScores[d.name] = { total: 0, correct: 0 };
    });

    const questionResults = exam.questions.map(q => {
      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { total: 0, correct: 0 };
      }
      domainScores[q.domain].total++;

      const userAns = this.state.answers[q.id];
      let isCorrect = false;

      if (q.type === "single") {
        isCorrect = (userAns === q.correct);
      } else if (q.type === "multi") {
        if (Array.isArray(userAns) && Array.isArray(q.correct)) {
          const sortedUser = [...userAns].sort();
          const sortedTarget = [...q.correct].sort();
          isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedTarget);
        }
      } else if (q.type === "command") {
        if (typeof userAns === "string") {
          const cleanUser = userAns.trim().toLowerCase().replace(/\s+/g, " ");
          isCorrect = q.acceptableAnswers.some(ans => ans.toLowerCase().trim() === cleanUser);
        }
      }

      if (isCorrect) {
        correctCount++;
        domainScores[q.domain].correct++;
      }

      return {
        question: q,
        userAnswer: userAns,
        isCorrect: isCorrect
      };
    });

    const percentage = Math.round((correctCount / exam.questions.length) * 100);
    // Scaled score between 200 and 800 (standard LPI scaling)
    const scaledScore = Math.round(200 + (percentage / 100) * 600);
    const passed = (scaledScore >= exam.passingScore);

    this.state.results = {
      examTitle: exam.title,
      candidateName: this.state.candidateName,
      correctCount: correctCount,
      totalCount: exam.questions.length,
      percentage: percentage,
      scaledScore: scaledScore,
      passingScore: exam.passingScore,
      passed: passed,
      domainScores: domainScores,
      questionResults: questionResults,
      certHash: "LTSP-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      dateStr: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    };

    this.renderResults();
  },

  renderResults() {
    document.getElementById("exam-active-panel")?.classList.add("hidden");
    const container = document.getElementById("exam-results-card");
    if (!container) return;

    container.classList.remove("hidden");
    const res = this.state.results;

    const domainBarsHtml = Object.keys(res.domainScores).map(dName => {
      const d = res.domainScores[dName];
      const dPercent = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
      const barColor = dPercent >= 75 ? '#10b981' : (dPercent >= 50 ? '#f59e0b' : '#ef4444');
      return `
        <div class="domain-result-row">
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
            <span style="color: #fff; font-weight: 600;">${dName}</span>
            <span style="color: ${barColor}; font-weight: 700;">${d.correct}/${d.total} (${dPercent}%)</span>
          </div>
          <div class="domain-progress-track">
            <div class="domain-progress-fill" style="width: ${dPercent}%; background: ${barColor};"></div>
          </div>
        </div>
      `;
    }).join("");

    const detailedReviewHtml = res.questionResults.map((r, i) => {
      const q = r.question;
      const icon = r.isCorrect ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-solid fa-circle-xmark text-danger"></i>';
      const statusClass = r.isCorrect ? 'correct' : 'incorrect';
      return `
        <div class="review-item-card ${statusClass}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-weight: 700; color: #fff;">
              ${icon} Question ${i + 1}: <span style="color: var(--accent-cyan);">${q.domain}</span>
            </div>
            <span class="badge-tag" style="background: ${r.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color: ${r.isCorrect ? '#10b981' : '#f87171'}; border: none;">
              ${r.isCorrect ? 'Correct' : 'Incorrect'}
            </span>
          </div>
          <p style="color: #cbd5e1; font-size: 0.92rem; margin-bottom: 0.75rem;">
            ${q.question}
          </p>
          <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-sm); padding: 0.75rem; font-size: 0.85rem; margin-bottom: 0.5rem;">
            <div style="color: #94a3b8;"><strong>Your Answer:</strong> ${this.formatUserAnswer(q, r.userAnswer)}</div>
            ${!r.isCorrect ? `<div style="color: #38bdf8; margin-top: 0.25rem;"><strong>Correct Answer:</strong> ${this.formatCorrectAnswer(q)}</div>` : ''}
          </div>
          <div style="font-size: 0.84rem; color: #94a3b8; line-height: 1.5; border-left: 2px solid var(--accent-cyan); padding-left: 0.6rem;">
            <strong style="color: #fff;">Explanation:</strong> ${q.explanation}
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="result-banner ${res.passed ? 'passed' : 'failed'}">
        <div class="result-badge-big">
          <i class="fa-solid ${res.passed ? 'fa-award text-emerald' : 'fa-triangle-exclamation text-danger'}"></i>
        </div>
        <h2 style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">
          ${res.passed ? 'CONGRATULATIONS! YOU PASSED' : 'EXAM RESULT: NEEDS MORE PREPARATION'}
        </h2>
        <div style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 1.5rem;">
          Candidate: <strong style="color: #fff;">${res.candidateName}</strong> • Exam: <strong style="color: #38bdf8;">${res.examTitle}</strong>
        </div>

        <div class="score-summary-grid">
          <div class="score-box">
            <div class="score-val" style="color: ${res.passed ? '#10b981' : '#f87171'};">${res.scaledScore}</div>
            <div class="score-lbl">Scaled Score (Passing: ${res.passingScore})</div>
          </div>
          <div class="score-box">
            <div class="score-val">${res.percentage}%</div>
            <div class="score-lbl">Accuracy (${res.correctCount}/${res.totalCount} Correct)</div>
          </div>
          <div class="score-box">
            <div class="score-val" style="color: #fbbf24;">${res.passed ? 'CERTIFIED' : 'PENDING'}</div>
            <div class="score-lbl">Official Status</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
          ${res.passed ? `
            <button class="btn-primary" onclick="ExamSystem.showCertificateModal()" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
              <i class="fa-solid fa-certificate"></i> View & Print Official Certificate
            </button>
          ` : ''}
          <button class="btn-secondary" onclick="ExamSystem.startExam()">
            <i class="fa-solid fa-rotate-left"></i> Retake Practice Exam
          </button>
          <a href="curriculum.html" class="btn-secondary">
            <i class="fa-solid fa-graduation-cap"></i> Review Curriculum Modules
          </a>
        </div>
      </div>

      <!-- Domain Performance Breakdown -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.75rem; margin-top: 2rem;">
        <h3 style="color: #fff; font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem;">
          <i class="fa-solid fa-chart-pie text-cyan"></i> Objective Domain Breakdown
        </h3>
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${domainBarsHtml}
        </div>
      </div>

      <!-- In-Depth Question by Question Review -->
      <div style="margin-top: 2.5rem;">
        <h3 style="color: #fff; font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem;">
          <i class="fa-solid fa-magnifying-glass text-warning"></i> Detailed Question-by-Question Review
        </h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${detailedReviewHtml}
        </div>
      </div>
    `;

    container.scrollIntoView({ behavior: "smooth" });
  },

  formatUserAnswer(q, userAns) {
    if (userAns === undefined || userAns === "") return '<em class="text-danger">Unanswered</em>';
    if (q.type === "single") return q.options[userAns] || userAns;
    if (q.type === "multi") {
      if (Array.isArray(userAns)) {
        return userAns.map(i => q.options[i]).join(", ");
      }
      return userAns;
    }
    if (q.type === "command") return `<code style="color: #fbbf24;">${userAns}</code>`;
    return userAns;
  },

  formatCorrectAnswer(q) {
    if (q.type === "single") return q.options[q.correct];
    if (q.type === "multi") {
      return q.correct.map(i => q.options[i]).join(" AND ");
    }
    if (q.type === "command") {
      return `<code style="color: #10b981;">${q.acceptableAnswers[0]}</code>`;
    }
    return "";
  },

  // Official Certificate Modal
  showCertificateModal() {
    const res = this.state.results;
    if (!res) return;

    let certModal = document.getElementById("certificate-modal");
    if (!certModal) {
      certModal = document.createElement("div");
      certModal.id = "certificate-modal";
      certModal.className = "certificate-modal";
      document.body.appendChild(certModal);
    }

    certModal.innerHTML = `
      <div class="certificate-modal-wrapper">
        <div class="cert-modal-actions no-print">
          <button class="btn-primary" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Print / Save as PDF
          </button>
          <button class="btn-secondary" onclick="document.getElementById('certificate-modal').classList.remove('open')">
            <i class="fa-solid fa-xmark"></i> Close
          </button>
        </div>

        <div class="certificate-paper" id="printable-certificate">
          <div class="cert-border-outer">
            <div class="cert-border-inner">
              
              <div class="cert-header">
                <div class="cert-logo-icon"><i class="fa-brands fa-linux"></i></div>
                <div class="cert-title-top">LINUX TRAINING & SYSTEMS PROGRAMME (LTSP)</div>
                <div class="cert-award-title">Certificate of Excellence</div>
                <div class="cert-award-subtitle">In Systems Administration & Operating Systems Engineering</div>
              </div>

              <div class="cert-body">
                <div class="cert-presented-text">This certifies that</div>
                <div class="cert-candidate-name">${res.candidateName}</div>
                <p class="cert-statement">
                  has successfully passed the comprehensive examination for
                  <br>
                  <strong style="color: #0f172a; font-size: 1.25rem;">${res.examTitle}</strong>
                  <br>
                  demonstrating mastery over operating systems architecture, GNU command-line utilities, storage architectures, networking protocols, process lifecycles, and security engineering.
                </p>
                <div class="cert-score-pill">
                  Scaled Score: ${res.scaledScore} / 800 • Accuracy: ${res.percentage}%
                </div>
              </div>

              <div class="cert-footer">
                <div class="cert-sig-block">
                  <div class="cert-signature-line">
                    <span class="cert-script-sig">Alexander</span>
                  </div>
                  <div class="cert-sig-name">Alexander</div>
                  <div class="cert-sig-title">Lead Systems Architect & Creator</div>
                  <div class="cert-sig-org">LTSP Platform • @alexhack235-code</div>
                </div>

                <div class="cert-seal-block">
                  <div class="cert-gold-seal">
                    <i class="fa-solid fa-award"></i>
                    <span>VERIFIED</span>
                  </div>
                </div>

                <div class="cert-verify-block">
                  <div class="cert-meta-item"><strong>Date:</strong> ${res.dateStr}</div>
                  <div class="cert-meta-item"><strong>Credential ID:</strong> ${res.certHash}</div>
                  <div class="cert-meta-item"><strong>Status:</strong> Validated Official</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;

    certModal.classList.add("open");
  },

  // =========================================================================
  // GLOBAL EXAM CENTRES LOCATOR
  // =========================================================================
  renderCentresList() {
    const container = document.getElementById("centres-cards-grid");
    if (!container) return;

    const filtered = EXAM_CENTRES_DATA.filter(center => {
      // Region filter
      if (this.centresState.activeRegion !== "all" && center.region !== this.centresState.activeRegion) {
        return false;
      }
      // Search filter
      if (this.centresState.searchQuery) {
        const q = this.centresState.searchQuery.toLowerCase();
        const match = center.name.toLowerCase().includes(q) ||
                      center.city.toLowerCase().includes(q) ||
                      center.country.toLowerCase().includes(q) ||
                      center.examsOffered.some(e => e.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    const countEl = document.getElementById("centres-count-display");
    if (countEl) countEl.innerText = `${filtered.length} Centers Found`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <i class="fa-solid fa-map-location-dot" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h4 style="color: #fff; font-size: 1.2rem; font-weight: 700;">No Exam Centres Match Your Search</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
            Try clearing the search query or selecting a different geographical region, or choose "Worldwide Remote Proctored".
          </p>
          <button class="btn-secondary" onclick="ExamSystem.resetCentresFilter()" style="margin-top: 1rem;">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(c => `
      <div class="centre-card">
        <div class="centre-card-top">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem;">
            <span class="badge-tag" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border-color: rgba(56, 189, 248, 0.25);">
              <i class="fa-solid fa-globe"></i> ${c.regionLabel}
            </span>
            <span class="badge-tag" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border: none;">
              <i class="fa-solid fa-circle-check"></i> ${c.partnerStatus}
            </span>
          </div>

          <h3 class="centre-name">${c.name}</h3>
          <div class="centre-location">
            <i class="fa-solid fa-location-dot text-cyan"></i>
            <span>${c.address} — <strong>${c.city}, ${c.country}</strong></span>
          </div>
        </div>

        <div class="centre-info-grid">
          <div class="centre-info-item">
            <i class="fa-solid fa-clock text-warning"></i>
            <div>
              <div class="centre-info-label">Operating Hours</div>
              <div class="centre-info-val">${c.hours}</div>
            </div>
          </div>
          <div class="centre-info-item">
            <i class="fa-solid fa-phone text-emerald"></i>
            <div>
              <div class="centre-info-label">Contact Phone</div>
              <div class="centre-info-val">${c.phone}</div>
            </div>
          </div>
        </div>

        <div style="margin: 1rem 0;">
          <div class="centre-info-label" style="margin-bottom: 0.4rem;">Exams Administered:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${c.examsOffered.map(ex => `<span class="exam-pill">${ex}</span>`).join("")}
          </div>
        </div>

        <div style="margin: 0.75rem 0 1.25rem;">
          <div class="centre-info-label" style="margin-bottom: 0.4rem;">Facility Amenities:</div>
          <div style="font-size: 0.8rem; color: #94a3b8; display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${c.facilities.map(f => `<span><i class="fa-solid fa-check text-cyan" style="font-size: 0.7rem;"></i> ${f}</span>`).join(" • ")}
          </div>
        </div>

        <div class="centre-card-footer">
          <a href="${c.bookingUrl}" target="_blank" class="btn-primary" style="width: 100%; justify-content: center; font-size: 0.88rem; padding: 0.65rem 1rem;">
            <i class="fa-solid fa-calendar-check"></i> Book via Pearson VUE / LPI
          </a>
        </div>
      </div>
    `).join("");
  },

  resetCentresFilter() {
    this.centresState.activeRegion = "all";
    this.centresState.searchQuery = "";

    const searchInput = document.getElementById("centres-search-input");
    if (searchInput) searchInput.value = "";

    const tabs = document.querySelectorAll(".region-tab-btn");
    tabs.forEach(t => t.classList.toggle("active", t.dataset.region === "all"));

    this.renderCentresList();
  },

  attachCentresEvents() {
    const searchInput = document.getElementById("centres-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.centresState.searchQuery = e.target.value.trim();
        this.renderCentresList();
      });
    }

    const regionTabs = document.querySelectorAll(".region-tab-btn");
    regionTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        regionTabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.centresState.activeRegion = btn.dataset.region || "all";
        this.renderCentresList();
      });
    });
  },

  attachExamEvents() {
    const examPicker = document.getElementById("exam-select-picker");
    if (examPicker) {
      examPicker.addEventListener("change", (e) => {
        this.state.examId = e.target.value;
        const examData = CERTIFICATION_EXAMS[this.state.examId];
        const titleEl = document.getElementById("selected-exam-title");
        const metaEl = document.getElementById("selected-exam-meta");
        if (titleEl && examData) titleEl.innerText = examData.title;
        if (metaEl && examData) metaEl.innerText = `${examData.totalQuestions} Questions • ${examData.durationMinutes} Minutes • Passing Score: ${examData.passingScore}/${examData.maxScore}`;
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ExamSystem.init();
});
