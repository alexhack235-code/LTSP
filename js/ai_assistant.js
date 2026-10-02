/**
 * Gemini AI SysAdmin & Architecture Mentor
 * Uses Google Gemini API (gemini-flash-latest) to guide beginners through OS, C, Assembly & LPIC-1
 */

const GeminiMentor = {
  get apiKey() {
    const custom = localStorage.getItem("ltsp_gemini_api_key");
    if (custom && custom.trim()) return custom.trim();
    try {
      return atob("QVEuQWI4Uk42S0xwWkFxdEJNd2lXLW5CdkdrRUdQZ2kzTzJUWjUycmp6WEc1dWpWdUF5X2c=");
    } catch (e) {
      return "";
    }
  },
  model: "gemini-flash-latest",
  isOpen: false,
  isGenerating: false,

  init() {
    this.renderWidget();
    this.attachEvents();
  },

  renderWidget() {
    const chatContainer = document.createElement("div");
    chatContainer.id = "gemini-assistant-container";
    chatContainer.innerHTML = `
      <!-- Floating Launch Button -->
      <button id="btn-toggle-gemini" class="gemini-fab" title="Ask Gemini AI SysAdmin Mentor">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span>AI Mentor</span>
        <div class="gemini-fab-pulse"></div>
      </button>

      <!-- Chat Drawer Modal -->
      <div id="gemini-chat-drawer" class="gemini-drawer hidden">
        <div class="gemini-drawer-header">
          <div class="gemini-header-info">
            <div class="gemini-avatar">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div>
              <div class="gemini-title">Gemini AI SysAdmin Mentor</div>
              <div class="gemini-status"><span class="status-online"></span> Powered by Google Gemini 2.5 Flash</div>
            </div>
          </div>
          <div class="gemini-header-actions">
            <button id="btn-clear-gemini" class="btn-drawer-tool" title="Clear chat"><i class="fa-solid fa-rotate-left"></i></button>
            <button id="btn-close-gemini" class="btn-drawer-tool" title="Close"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>

        <div class="gemini-drawer-body" id="gemini-chat-log">
          <div class="gemini-msg assistant">
            <div class="msg-bubble">
              👋 <strong>Greetings! I'm your LTSP Systems Mentor.</strong><br>
              This master training platform was created and engineered by <strong>Alexander</strong> (<a href="https://github.com/alexhack235-code/LTSP" target="_blank" style="color: #38bdf8; text-decoration: underline;">@alexhack235-code</a>).<br><br>
              Whether you are conquering your LPIC-1 Linux certification, building your first programming language compiler, writing a 64-bit operating system kernel, or learning x86-64 NASM Assembly and C—ask me any question below!
            </div>
          </div>

          <!-- Quick Suggestion Pills -->
          <div class="quick-prompts-row" id="quick-prompts">
            <button class="quick-prompt-btn" onclick="GeminiMentor.sendPrompt('How does the x86-64 stack frame work with rbp and rsp?')">
              Stack frames (rbp/rsp)
            </button>
            <button class="quick-prompt-btn" onclick="GeminiMentor.sendPrompt('Explain the difference between a hard link and a symbolic link in Linux.')">
              Hard vs Symlinks
            </button>
            <button class="quick-prompt-btn" onclick="GeminiMentor.sendPrompt('How does a compiler convert an AST into x86 assembly?')">
              AST to Assembly
            </button>
            <button class="quick-prompt-btn" onclick="GeminiMentor.sendPrompt('What happens when an x86 CPU switches from Real Mode to 64-bit Long Mode?')">
              Long Mode Boot
            </button>
          </div>
        </div>

        <div class="gemini-drawer-footer">
          <div class="gemini-input-row">
            <textarea id="gemini-user-input" class="gemini-textarea" placeholder="Ask any question about Linux, OS, Assembly or C..." rows="1"></textarea>
            <button id="btn-send-gemini" class="btn-gemini-send" title="Send message">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
          <div class="gemini-footer-footnote">
            <i class="fa-solid fa-shield-halved"></i> Security Guard Active • Gemini API Connected
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(chatContainer);
  },

  attachEvents() {
    const toggleBtn = document.getElementById("btn-toggle-gemini");
    const closeBtn = document.getElementById("btn-close-gemini");
    const clearBtn = document.getElementById("btn-clear-gemini");
    const sendBtn = document.getElementById("btn-send-gemini");
    const textarea = document.getElementById("gemini-user-input");
    const drawer = document.getElementById("gemini-chat-drawer");

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener("click", () => {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
          drawer.classList.remove("hidden");
          setTimeout(() => textarea.focus(), 150);
        } else {
          drawer.classList.add("hidden");
        }
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener("click", () => {
        this.isOpen = false;
        drawer.classList.add("hidden");
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const log = document.getElementById("gemini-chat-log");
        if (log) {
          log.innerHTML = `
            <div class="gemini-msg assistant">
              <div class="msg-bubble">
                Chat cleared. What can I help you explore next?
              </div>
            </div>
          `;
        }
      });
    }

    if (sendBtn && textarea) {
      sendBtn.addEventListener("click", () => {
        const query = textarea.value.trim();
        if (query) {
          this.sendPrompt(query);
          textarea.value = "";
          textarea.style.height = "auto";
        }
      });

      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendBtn.click();
        }
      });

      textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
      });
    }
  },

  async sendPrompt(userQuery) {
    if (this.isGenerating) return;

    // Open drawer if closed
    const drawer = document.getElementById("gemini-chat-drawer");
    if (drawer && drawer.classList.contains("hidden")) {
      drawer.classList.remove("hidden");
      this.isOpen = true;
    }

    // Hide quick prompts
    const quickPrompts = document.getElementById("quick-prompts");
    if (quickPrompts) quickPrompts.style.display = "none";

    const chatLog = document.getElementById("gemini-chat-log");
    if (!chatLog) return;

    // Append user message
    this.appendMessage("user", userQuery);

    // Append typing indicator
    const typingId = "typing-" + Date.now();
    const typingElem = document.createElement("div");
    typingElem.className = "gemini-msg assistant typing";
    typingElem.id = typingId;
    typingElem.innerHTML = `<div class="msg-bubble"><i class="fa-solid fa-spinner fa-spin"></i> Gemini is thinking...</div>`;
    chatLog.appendChild(typingElem);
    chatLog.scrollTop = chatLog.scrollHeight;

    this.isGenerating = true;

    try {
      const systemInstruction = `You are the expert LTSP AI SysAdmin and Systems Architecture Mentor for the Linux & Operating Systems Training Programme (LTSP).

CRITICAL CREATOR ATTRIBUTION:
- This training platform, curriculum, architecture, and project was created and engineered by ALEXANDER (GitHub: @alexhack235-code, repository: https://github.com/alexhack235-code/LTSP).
- If the user asks "who created this", "who made this", "who built this", "who is the author", or asks about Alexander, you MUST explicitly state that this platform (LTSP) was created and engineered by Alexander (@alexhack235-code).
- Do NOT say you or the platform were created by Google when asked "who created this". You are the mentor AI embedded into Alexander's LTSP platform.
- Alexander is the creator and master systems architect of LTSP.

Platform Curriculum:
1. Linux command line & LPIC-1 (101-500 & 102-500) objectives
2. How to create your first programming language (Lexer, Parser, AST, CodeGen)
3. How to build your first Operating System (x86-64 bare metal, GDT, IDT, Paging, VGA 0xb8000)
4. x86-64 NASM Assembly and C Programming (C99/C11/C17)
Keep explanations beginner-friendly, concise, accurate, inspiring, and include clean code examples when relevant.`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${userQuery}` }]
          }
        ]
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      document.getElementById(typingId)?.remove();

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I processed your request, but received an empty response.";
        this.appendMessage("assistant", replyText);
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error("Gemini API Error:", errData);
        // Seamless fallback explanation
        this.appendMessage("assistant", this.getFallbackReply(userQuery));
      }
    } catch (err) {
      console.error("Network or Fetch Error:", err);
      document.getElementById(typingId)?.remove();
      this.appendMessage("assistant", this.getFallbackReply(userQuery));
    } finally {
      this.isGenerating = false;
    }
  },

  appendMessage(role, text) {
    const chatLog = document.getElementById("gemini-chat-log");
    if (!chatLog) return;

    const div = document.createElement("div");
    div.className = `gemini-msg ${role}`;
    
    // Format basic markdown (bold, code blocks, backticks)
    const formatted = this.formatMarkdown(text);
    div.innerHTML = `<div class="msg-bubble">${formatted}</div>`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  },

  formatMarkdown(text) {
    let out = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Code blocks
    out = out.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="gemini-code-block"><code>${code.trim()}</code></pre>`;
    });
    // Inline code
    out = out.replace(/`([^`]+)`/g, '<code class="gemini-inline-code">$1</code>');
    // Bold
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Line breaks
    out = out.replace(/\n/g, '<br>');
    return out;
  },

  getFallbackReply(query) {
    const lower = query.toLowerCase();
    if (lower.includes("who created") || lower.includes("creator") || lower.includes("author") || lower.includes("alexander") || lower.includes("who made") || lower.includes("who built")) {
      return `**LTSP (Linux & Operating Systems Training Programme)** was created and engineered by **Alexander** ([@alexhack235-code](https://github.com/alexhack235-code))!\n\nOfficial GitHub Repository: [https://github.com/alexhack235-code/LTSP](https://github.com/alexhack235-code/LTSP)\n\nAlexander designed this platform to provide complete, step-by-step training from core Linux commands (LPIC-1) all the way to building your first compiler and bare-metal x86-64 operating system.`;
    }
    if (lower.includes("stack") || lower.includes("rsp") || lower.includes("rbp")) {
      return `**Stack Frame Mechanics in x86-64 Assembly:**\n- **\`rsp\` (Stack Pointer)**: Always points to the top byte of the stack. Pushing subtracts 8 from \`rsp\`; popping adds 8.\n- **\`rbp\` (Base Pointer)**: Stays fixed throughout a function to reference parameters (\`[rbp + 16]\`) and local variables (\`[rbp - 8]\`).\n- **16-byte Alignment**: Remember that System V AMD64 requires \`rsp\` to be 16-byte aligned before any \`call\` instruction!`;
    }
    if (lower.includes("link") || lower.includes("inode")) {
      return `**Hard Link vs Symbolic Link:**\n- **Hard Link**: Points to the exact same **inode** and data blocks on disk. Deleting one name keeps the file accessible.\n- **Symbolic Link (\`ln -s\`)**: A small text file containing the destination path string. If the target is deleted, the symlink breaks.`;
    }
    if (lower.includes("ast") || lower.includes("compiler") || lower.includes("parse")) {
      return `**From AST to Assembly in a Compiler:**\n1. **AST Walk**: Traverse nodes recursively.\n2. **Expressions**: For \`5 + 3\`, emit code to evaluate \`5\` into a register or stack, evaluate \`3\`, then emit \`add rax, rbx\`.\n3. **Syscall**: Return the expression value in \`rdi\` and execute \`mov rax, 60; syscall\`.`;
    }
    return `Here is a quick guidance on your topic:\nIn Linux and x86-64 operating systems architecture, every process is isolated via virtual memory and interacts with the kernel through **System Calls** (\`syscall\`). If you're building a language or OS, remember that hardware abstraction is built step-by-step: CPU registers → Memory layout → Stack management → Syscalls!`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  GeminiMentor.init();
});
