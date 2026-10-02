/**
 * In-Browser Interactive Linux Terminal Simulator
 * Zero backend required; simulates virtual filesystem, commands, pipes, and history.
 */

class LinuxTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.history = [];
    this.historyIndex = -1;
    this.cwd = "/home/student";
    this.lastExitCode = 0;
    this.user = "student";
    this.hostname = "lpic1-lab";

    // Virtual In-Memory Filesystem
    this.fs = {
      "/": { type: "dir", perms: "755", owner: "root:root" },
      "/bin": { type: "dir", perms: "755", owner: "root:root" },
      "/etc": { type: "dir", perms: "755", owner: "root:root" },
      "/etc/os-release": {
        type: "file",
        perms: "644",
        owner: "root:root",
        content: `NAME="Ubuntu"\nVERSION="24.04 LTS (Noble Numbat)"\nID=ubuntu\nPRETTY_NAME="Ubuntu 24.04 LTS"\nVERSION_CODENAME=noble`
      },
      "/etc/passwd": {
        type: "file",
        perms: "644",
        owner: "root:root",
        content: `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nsbin:x:2:2:sbin:/sbin:/usr/sbin/nologin\nsyslog:x:104:110::/home/syslog:/usr/sbin/nologin\nstudent:x:1000:1000:LPIC Student,,,:/home/student:/bin/bash\nalice:x:1001:1001:Alice Developer,,,:/home/alice:/bin/bash`
      },
      "/etc/group": {
        type: "file",
        perms: "644",
        owner: "root:root",
        content: `root:x:0:\nsudo:x:27:student\nstudent:x:1000:\nwheel:x:10:student\ndevelopers:x:1002:alice,student`
      },
      "/home": { type: "dir", perms: "755", owner: "root:root" },
      "/home/student": { type: "dir", perms: "700", owner: "student:student" },
      "/home/student/welcome.txt": {
        type: "file",
        perms: "644",
        owner: "student:student",
        content: `Welcome to the LPIC-1 Linux Training Simulator!\nHere you can test real Linux commands without fear of breaking your real system.\nType 'help' to see all available commands, or try 'ls -lah', 'cat /etc/passwd', or 'ps aux'.`
      },
      "/home/student/script.sh": {
        type: "file",
        perms: "755",
        owner: "student:student",
        content: `#!/bin/bash\necho "Hello Linux SysAdmin!"\necho "Kernel: $(uname -r)"\necho "Current user: $(whoami)"`
      },
      "/home/student/notes.log": {
        type: "file",
        perms: "644",
        owner: "student:student",
        content: `2026-10-01 08:00:01 INFO [boot] System initialization started.\n2026-10-01 08:00:05 INFO [kernel] Mounted root ext4 filesystem on /dev/sda1\n2026-10-01 08:00:10 ERROR [nginx] Port 80 connection refused.\n2026-10-01 08:00:15 WARN [sshd] Authentication failure for invalid user admin.`
      },
      "/var": { type: "dir", perms: "755", owner: "root:root" },
      "/var/log": { type: "dir", perms: "755", owner: "root:root" },
      "/var/log/syslog": {
        type: "file",
        perms: "640",
        owner: "syslog:adm",
        content: `Oct  1 08:00:00 lpic1-lab systemd[1]: Reached target Graphical Interface.\nOct  1 08:00:01 lpic1-lab sshd[942]: Server listening on 0.0.0.0 port 22.\nOct  1 08:00:02 lpic1-lab systemd[1]: Started OpenSSH server daemon.`
      },
      "/tmp": { type: "dir", perms: "777", owner: "root:root" }
    };

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal-window">
        <div class="terminal-titlebar">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="terminal-title">student@lpic1-lab: ~ (Simulated Linux Shell - Bash)</div>
          <div class="terminal-actions">
            <button class="btn-term-action" id="btn-term-clear" title="Clear screen">Clear</button>
            <button class="btn-term-action" id="btn-term-reset" title="Reset virtual environment">Reset</button>
          </div>
        </div>
        <div class="terminal-body" id="term-output">
          <div class="term-line welcome-msg">
            <span class="text-emerald">🐧 Welcome to LPIC-1 Interactive Linux Terminal v2.4</span><br>
            <span class="text-muted">Type <span class="badge-code">help</span> to list commands, or try <span class="badge-code">ls -la</span>, <span class="badge-code">cat notes.log</span>, <span class="badge-code">chmod 700 script.sh</span>, <span class="badge-code">free -h</span>, <span class="badge-code">ps aux</span>.</span>
          </div>
        </div>
        <div class="terminal-input-bar">
          <span class="term-prompt" id="term-prompt-label">${this.getPrompt()}</span>
          <input type="text" id="term-input" class="term-input" autocomplete="off" spellcheck="false" autofocus />
        </div>
      </div>
    `;

    this.outputElem = document.getElementById("term-output");
    this.inputElem = document.getElementById("term-input");
    this.promptElem = document.getElementById("term-prompt-label");

    this.attachEvents();
  }

  getPrompt() {
    const displayPath = this.cwd === `/home/${this.user}` ? "~" : this.cwd;
    return `<span class="prompt-user">${this.user}@${this.hostname}</span>:<span class="prompt-path">${displayPath}</span>$ `;
  }

  attachEvents() {
    this.inputElem.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = this.inputElem.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.appendOutput(`${this.getPrompt()}${this.escapeHTML(cmd)}`, "user-input");
          this.execute(cmd);
          this.inputElem.value = "";
          this.promptElem.innerHTML = this.getPrompt();
          this.scrollToBottom();
        } else {
          this.appendOutput(this.getPrompt(), "user-input");
          this.scrollToBottom();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputElem.value = this.history[this.historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputElem.value = this.history[this.historyIndex] || "";
        } else {
          this.historyIndex = this.history.length;
          this.inputElem.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        this.autocomplete();
      }
    });

    document.getElementById("btn-term-clear").addEventListener("click", () => {
      this.outputElem.innerHTML = "";
    });

    document.getElementById("btn-term-reset").addEventListener("click", () => {
      this.cwd = "/home/student";
      this.outputElem.innerHTML = `<div class="term-line text-emerald">Terminal reset to default state.</div>`;
      this.promptElem.innerHTML = this.getPrompt();
      this.inputElem.focus();
    });

    this.container.addEventListener("click", () => {
      this.inputElem.focus();
    });
  }

  autocomplete() {
    const current = this.inputElem.value.trim();
    if (!current) return;
    const parts = current.split(" ");
    if (parts.length === 1) {
      const candidates = [
        "pwd", "ls", "cd", "cat", "echo", "touch", "mkdir", "rm", "cp", "mv",
        "chmod", "chown", "whoami", "id", "groups", "uname", "ps", "top", "free",
        "uptime", "date", "clear", "history", "help", "grep", "df", "find",
        "systemctl", "journalctl", "ip", "ss", "ping", "curl", "file", "stat"
      ].filter(c => c.startsWith(parts[0]));
      if (candidates.length === 1) {
        this.inputElem.value = candidates[0] + " ";
      }
    } else {
      // file path completion
      const target = parts[parts.length - 1];
      const files = Object.keys(this.fs);
      const matches = files.filter(f => f.startsWith(target));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        this.inputElem.value = parts.join(" ") + " ";
      }
    }
  }

  escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  appendOutput(html, className = "") {
    const div = document.createElement("div");
    div.className = `term-line ${className}`;
    div.innerHTML = html;
    this.outputElem.appendChild(div);
  }

  scrollToBottom() {
    this.outputElem.scrollTop = this.outputElem.scrollHeight;
  }

  resolvePath(path) {
    if (!path) return this.cwd;
    if (path.startsWith("/")) {
      return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    }
    if (path === "~") return `/home/${this.user}`;
    if (path.startsWith("~/")) return `/home/${this.user}/${path.slice(2)}`.replace(/\/+/g, "/").replace(/\/$/, "");
    
    let combined = (this.cwd === "/" ? "" : this.cwd) + "/" + path;
    const segments = combined.split("/").filter(Boolean);
    const resolved = [];
    for (const seg of segments) {
      if (seg === ".") continue;
      if (seg === "..") {
        if (resolved.length > 0) resolved.pop();
      } else {
        resolved.push(seg);
      }
    }
    return "/" + resolved.join("");
  }

  execute(rawCmd) {
    const trimmed = (rawCmd || "").trim();
    const lowerRaw = trimmed.toLowerCase();

    // 1. Special creator / attribution commands
    if (
      lowerRaw === "who created this" ||
      lowerRaw === "who created this?" ||
      lowerRaw === "who made this" ||
      lowerRaw === "who made this?" ||
      lowerRaw === "who built this" ||
      lowerRaw === "who built this?" ||
      lowerRaw === "author" ||
      lowerRaw === "creator" ||
      lowerRaw === "alexander" ||
      lowerRaw === "about" ||
      lowerRaw === "credits" ||
      lowerRaw === "github" ||
      lowerRaw === "repo"
    ) {
      this.appendOutput(`
<span class="text-cyan">================================================================================</span>
<span class="text-warning" style="font-weight: 800; font-size: 1rem;">🐧 LTSP (Linux & Operating Systems Master Training Programme)</span>
<span class="text-cyan">================================================================================</span>
<strong>Created & Engineered by:</strong> <span class="text-emerald font-bold" style="font-size: 1.05rem;">Alexander</span> (<a href="https://github.com/alexhack235-code" target="_blank" style="color: #38bdf8; text-decoration: underline;">@alexhack235-code</a>)
<strong>Official GitHub Repository:</strong> <a href="https://github.com/alexhack235-code/LTSP" target="_blank" style="color: #38bdf8; text-decoration: underline;">https://github.com/alexhack235-code/LTSP</a>
<strong>Mission:</strong> 16 LPIC-1 Modules • Compiler Construction • Bare-Metal OS • x86-64 NASM & C
<strong>Security Guard API:</strong> Active v4.2 • Dynamic Client IP Verification
<strong>AI Mentor:</strong> Google Gemini 2.5 Integrated
<span class="text-cyan">================================================================================</span>
      `);
      this.lastExitCode = 0;
      return;
    }

    // Basic piping and variable evaluation
    if (rawCmd === "echo $?") {
      this.appendOutput(`${this.lastExitCode}`);
      return;
    }
    if (rawCmd === "echo $USER") {
      this.appendOutput(this.user);
      return;
    }
    if (rawCmd === "echo $SHELL") {
      this.appendOutput("/bin/bash");
      return;
    }

    const tokens = rawCmd.split(" ").filter(Boolean);
    const cmd = tokens[0];
    const args = tokens.slice(1);

    // Support sudo prefix
    if (cmd === "sudo") {
      if (args.length === 0) {
        this.appendOutput("usage: sudo command [arguments...]");
        this.lastExitCode = 1;
        return;
      }
      if (args[0] === "whoami") {
        this.appendOutput("root");
        this.lastExitCode = 0;
        return;
      }
      this.execute(args.join(" "));
      return;
    }

    switch (cmd) {
      case "help":
        this.appendOutput(`
<span class="text-cyan">Available Commands & System Utilities:</span>
  <span class="text-warning">Creator & About:</span> who created this, author, creator, neofetch, git, github
  <span class="text-warning">Navigation & Files:</span> pwd, cd, ls, touch, mkdir, rmdir, cp, mv, rm, stat, file, tree
  <span class="text-warning">Text Processing:</span> cat, head, tail, grep, wc
  <span class="text-warning">Permissions & Users:</span> chmod, chown, whoami, who, w, id, groups, sudo
  <span class="text-warning">Development & Build:</span> gcc, nasm, make, python3, qemu
  <span class="text-warning">Hardware & Kernel:</span> uname, lscpu, lsblk, dmesg, hostname
  <span class="text-warning">System & Monitoring:</span> ps, top, free, uptime, date, clear, history, df, env
  <span class="text-warning">Services & Network:</span> systemctl, ip, ss, ping, curl, wget, apt
  <span class="text-warning">Shell & Variables:</span> echo, type, which, man
        `);
        this.lastExitCode = 0;
        break;

      case "clear":
        this.outputElem.innerHTML = "";
        this.lastExitCode = 0;
        break;

      case "pwd":
        this.appendOutput(this.cwd);
        this.lastExitCode = 0;
        break;

      case "whoami":
        this.appendOutput(this.user);
        this.lastExitCode = 0;
        break;

      case "id":
        this.appendOutput(`uid=1000(${this.user}) gid=1000(${this.user}) groups=1000(${this.user}),27(sudo),10(wheel),1002(developers)`);
        this.lastExitCode = 0;
        break;

      case "groups":
        this.appendOutput(`${this.user} sudo wheel developers`);
        this.lastExitCode = 0;
        break;

      case "uname":
        if (args.includes("-a")) {
          this.appendOutput("Linux lpic1-lab 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC Mon Sep 23 18:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux");
        } else if (args.includes("-r")) {
          this.appendOutput("6.8.0-45-generic");
        } else {
          this.appendOutput("Linux");
        }
        this.lastExitCode = 0;
        break;

      case "date":
        this.appendOutput(new Date().toUTCString());
        this.lastExitCode = 0;
        break;

      case "uptime":
        this.appendOutput(" 22:50:12 up 14 days,  3:42,  1 user,  load average: 0.12, 0.08, 0.05");
        this.lastExitCode = 0;
        break;

      case "free":
        if (args.includes("-h") || args.includes("-m")) {
          this.appendOutput(`               total        used        free      shared  buff/cache   available\nMem:           15Gi       3.2Gi       8.4Gi       210Mi       4.1Gi        12Gi\nSwap:         4.0Gi          0B       4.0Gi`);
        } else {
          this.appendOutput(`               total        used        free      shared  buff/cache   available\nMem:        16384000     3355443     8808000      215040     4220517    12582912\nSwap:        4194304           0     4194304`);
        }
        this.lastExitCode = 0;
        break;

      case "df":
        this.appendOutput(`Filesystem     Type      Size  Used Avail Use% Mounted on\n/dev/sda1      ext4       50G   14G   34G  30% /\ntmpfs          tmpfs     7.8G     0  7.8G   0% /dev/shm\n/dev/sdb1      xfs       100G   22G   78G  23% /mnt/data`);
        this.lastExitCode = 0;
        break;

      case "lscpu":
        this.appendOutput(`Architecture:            x86_64\nCPU op-mode(s):          32-bit, 64-bit\nAddress sizes:           39 bits physical, 48 bits virtual\nByte Order:              Little Endian\nCPU(s):                  8\nModel name:              AMD Ryzen / Intel Core Virtual CPU\nVirtualization features: AMD-V / VT-x`);
        this.lastExitCode = 0;
        break;

      case "lsblk":
        this.appendOutput(`NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nsda      8:0    0   50G  0 disk \n├─sda1   8:1    0   46G  0 part /\n└─sda2   8:2    0    4G  0 part [SWAP]\nsdb      8:16   0  100G  0 disk \n└─sdb1   8:17   0  100G  0 part /mnt/data`);
        this.lastExitCode = 0;
        break;

      case "ps":
        this.appendOutput(`    PID TTY          TIME CMD\n   1240 pts/0    00:00:00 bash\n   3128 pts/0    00:00:00 ps\n    942 ?        00:00:02 sshd\n      1 ?        00:00:05 systemd`);
        this.lastExitCode = 0;
        break;

      case "top":
        this.appendOutput(`top - 22:52:00 up 14 days, 1 user, load average: 0.12, 0.08, 0.05\nTasks: 184 total,   1 running, 183 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  1.2 us,  0.5 sy,  0.0 ni, 98.1 id,  0.1 wa,  0.0 hi,  0.1 si\nMiB Mem :  15872.0 total,   8412.3 free,   3240.1 used,   4219.6 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n    1 root      20   0  168244  13280   8940 S   0.0   0.1   0:05.12 systemd\n  942 root      20   0   18420   6120   4980 S   0.0   0.0   0:02.40 sshd\n 1240 student   20   0   14380   4820   3200 S   0.0   0.0   0:00.18 bash`);
        this.lastExitCode = 0;
        break;

      case "ip":
        if (args[0] === "addr" || args[0] === "a") {
          this.appendOutput(`1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n    inet 192.168.1.142/24 brd 192.168.1.255 scope global dynamic eth0\n    inet6 fe80::a00:27ff:fe4a:391/64 scope link`);
        } else if (args[0] === "route" || args[0] === "r") {
          this.appendOutput(`default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.142 metric 100\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.142 metric 100`);
        } else {
          this.appendOutput("Usage: ip [ addr | link | route ]");
        }
        this.lastExitCode = 0;
        break;

      case "ss":
        this.appendOutput(`Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess\ntcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=942,fd=3))\ntcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=1102,fd=6))\ntcp   LISTEN 0      128             [::]:22            [::]:*    users:(("sshd",pid=942,fd=4))`);
        this.lastExitCode = 0;
        break;

      case "ping":
        const target = args[args.length - 1] || "8.8.8.8";
        this.appendOutput(`PING ${target} (${target}) 56(84) bytes of data.\n64 bytes from ${target}: icmp_seq=1 ttl=117 time=14.2 ms\n64 bytes from ${target}: icmp_seq=2 ttl=117 time=13.8 ms\n64 bytes from ${target}: icmp_seq=3 ttl=117 time=14.0 ms\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2002ms`);
        this.lastExitCode = 0;
        break;

      case "systemctl":
        if (args.includes("status")) {
          const s = args[args.length - 1];
          this.appendOutput(`● ${s}.service - ${s.toUpperCase()} Service\n     Loaded: loaded (/lib/systemd/system/${s}.service; enabled; vendor preset: enabled)\n     Active: active (running) since Thu 2026-10-01 08:00:02 UTC; 14h ago\n   Main PID: 942 (${s})\n      Tasks: 1 (limit: 9445)\n     Memory: 6.2M\n        CPU: 120ms\n     CGroup: /system.slice/${s}.service\n             └─942 /usr/sbin/${s} -D`);
        } else {
          this.appendOutput(`systemctl: action simulated successfully on unit ${args[1] || "target"}`);
        }
        this.lastExitCode = 0;
        break;

      case "ls":
        const showAll = args.some(a => a.includes("a"));
        const showLong = args.some(a => a.includes("l"));
        const targetDir = this.resolvePath(args.filter(a => !a.startsWith("-"))[0] || this.cwd);

        const items = Object.keys(this.fs).filter(path => {
          if (path === targetDir) return false;
          if (targetDir === "/") {
            const parts = path.split("/").filter(Boolean);
            return parts.length === 1;
          }
          if (path.startsWith(targetDir + "/")) {
            const sub = path.slice(targetDir.length + 1);
            return !sub.includes("/");
          }
          return false;
        });

        if (showLong) {
          let output = `total ${items.length * 4}\n`;
          items.forEach(path => {
            const entry = this.fs[path];
            const name = path.split("/").pop();
            const typeChar = entry.type === "dir" ? "d" : "-";
            const permsStr = this.octalToSymbolic(entry.perms);
            output += `${typeChar}${permsStr} 1 ${entry.owner} 4096 Oct 1 22:00 ${name}\n`;
          });
          this.appendOutput(output.trim());
        } else {
          const names = items.map(p => p.split("/").pop());
          this.appendOutput(names.join("   "));
        }
        this.lastExitCode = 0;
        break;

      case "cd":
        const dest = this.resolvePath(args[0] || `~`);
        if (this.fs[dest] && this.fs[dest].type === "dir") {
          this.cwd = dest;
          this.lastExitCode = 0;
        } else {
          this.appendOutput(`bash: cd: ${args[0]}: No such file or directory`, "text-danger");
          this.lastExitCode = 1;
        }
        break;

      case "cat":
        if (!args[0]) {
          this.appendOutput("Usage: cat <filename>", "text-warning");
          this.lastExitCode = 1;
          return;
        }
        const filePath = this.resolvePath(args[0]);
        if (this.fs[filePath] && this.fs[filePath].type === "file") {
          this.appendOutput(this.escapeHTML(this.fs[filePath].content));
          this.lastExitCode = 0;
        } else {
          this.appendOutput(`cat: ${args[0]}: No such file or directory`, "text-danger");
          this.lastExitCode = 1;
        }
        break;

      case "touch":
        if (!args[0]) {
          this.appendOutput("touch: missing file operand", "text-danger");
          this.lastExitCode = 1;
          return;
        }
        const newFilePath = this.resolvePath(args[0]);
        if (!this.fs[newFilePath]) {
          this.fs[newFilePath] = {
            type: "file",
            perms: "644",
            owner: `${this.user}:${this.user}`,
            content: ""
          };
        }
        this.lastExitCode = 0;
        break;

      case "mkdir":
        if (!args[0]) {
          this.appendOutput("mkdir: missing operand", "text-danger");
          this.lastExitCode = 1;
          return;
        }
        const dirPath = this.resolvePath(args[args.length - 1]);
        this.fs[dirPath] = {
          type: "dir",
          perms: "755",
          owner: `${this.user}:${this.user}`
        };
        this.lastExitCode = 0;
        break;

      case "chmod":
        if (args.length < 2) {
          this.appendOutput("chmod: missing operand. Usage: chmod <octal|mode> <file>", "text-warning");
          this.lastExitCode = 1;
          return;
        }
        const mode = args[0];
        const targetFile = this.resolvePath(args[1]);
        if (this.fs[targetFile]) {
          this.fs[targetFile].perms = mode;
          this.appendOutput(`Changed permissions of '${args[1]}' to ${mode}`);
          this.lastExitCode = 0;
        } else {
          this.appendOutput(`chmod: cannot access '${args[1]}': No such file or directory`, "text-danger");
          this.lastExitCode = 1;
        }
        break;

      case "echo":
        this.appendOutput(args.join(" ").replace(/^["']|["']$/g, ""));
        this.lastExitCode = 0;
        break;

      case "history":
        let hOut = "";
        this.history.forEach((h, idx) => {
          hOut += `  ${idx + 1}  ${this.escapeHTML(h)}\n`;
        });
        this.appendOutput(hOut.trim());
        this.lastExitCode = 0;
        break;

      case "type":
        if (["cd", "pwd", "echo", "help", "history", "exit"].includes(args[0])) {
          this.appendOutput(`${args[0]} is a shell builtin`);
        } else {
          this.appendOutput(`${args[0]} is /usr/bin/${args[0]}`);
        }
        this.lastExitCode = 0;
        break;

      case "which":
        this.appendOutput(`/usr/bin/${args[0] || "bash"}`);
        this.lastExitCode = 0;
        break;

      case "stat":
        const sPath = this.resolvePath(args[0]);
        if (this.fs[sPath]) {
          const item = this.fs[sPath];
          this.appendOutput(`  File: ${args[0]}\n  Size: 4096       Blocks: 8          IO Block: 4096   ${item.type === "dir" ? "directory" : "regular file"}\nDevice: 801h/2049d Inode: 1048576    Links: 1\nAccess: (0${item.perms}/${this.octalToSymbolic(item.perms)})  Uid: ( 1000/ student)   Gid: ( 1000/ student)\nAccess: 2026-10-01 22:50:00\nModify: 2026-10-01 22:50:00\nChange: 2026-10-01 22:50:00`);
          this.lastExitCode = 0;
        } else {
          this.appendOutput(`stat: cannot stat '${args[0]}': No such file or directory`, "text-danger");
          this.lastExitCode = 1;
        }
        break;

      case "who":
        this.appendOutput("student   pts/0        2026-10-02 00:01 (:0)\nalexander pts/1        2026-10-02 00:00 (creator - architect)");
        this.lastExitCode = 0;
        break;

      case "w":
        this.appendOutput(" 00:05:21 up 42 days,  2 users,  load average: 0.08, 0.03, 0.01\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\nstudent  pts/0    192.168.1.105    00:01    0.00s  0.05s  0.00s -bash\nalexander pts/1   127.0.0.1        00:00    1.00s  0.15s  0.02s vim /src/kernel.c");
        this.lastExitCode = 0;
        break;

      case "git":
        const subCmd = args[0];
        if (subCmd === "status") {
          this.appendOutput("On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean");
        } else if (subCmd === "remote" && args[1] === "-v") {
          this.appendOutput("origin  https://github.com/alexhack235-code/LTSP.git (fetch)\norigin  https://github.com/alexhack235-code/LTSP.git (push)");
        } else if (subCmd === "log") {
          this.appendOutput("commit a1c89f2d01b (HEAD -> main, origin/main)\nAuthor: Alexander <alexhack235-code>\nDate:   Fri Oct 2 00:00:00 2026 +0100\n\n    feat: Complete LTSP Multi-Page Platform & OS Builder");
        } else if (subCmd === "branch") {
          this.appendOutput("* main");
        } else {
          this.appendOutput(`git repository: https://github.com/alexhack235-code/LTSP\nCommands: git status, git remote -v, git log, git branch, git diff, git push`);
        }
        this.lastExitCode = 0;
        break;

      case "neofetch":
      case "screenfetch":
        this.appendOutput(`
<span class="text-cyan">            .-/+oossssoo+/-.</span>               <span class="text-emerald font-bold">alexander@ltsp-master</span>
<span class="text-cyan">        :+ssssssssssssssssss+:</span>           ---------------------
<span class="text-cyan">      -+ssssssssssssssssssyyssss+-</span>       <span class="text-warning">OS:</span> LTSP Linux x86_64
<span class="text-cyan">    .ossssssssssssssssssdMMMNysssso.</span>     <span class="text-warning">Creator:</span> Alexander (@alexhack235-code)
<span class="text-cyan">   /ssssssssssshdmmNNmmyNMMMMhssssss/</span>    <span class="text-warning">GitHub:</span> https://github.com/alexhack235-code/LTSP
<span class="text-cyan">  +ssssssssshmydMMMMMMMNddddysssssss+</span>    <span class="text-warning">Kernel:</span> 6.8.0-45-generic
<span class="text-cyan"> /sssssssshNMMMyhhyyyyhmNMMMNhssssss/</span>   <span class="text-warning">Uptime:</span> 42 days, 13 hours, 37 mins
<span class="text-cyan">.ssssssssdMMMNhsssssssssshNMMMdssssss.</span>   <span class="text-warning">Shell:</span> bash 5.2.21
<span class="text-cyan">+sssshhhyNMMNyssssssssssssyNMMMysssss+</span>   <span class="text-warning">Terminal:</span> HTML5 Interactive Web Shell
<span class="text-cyan"> ossyNMMMNyMMhsssssssssssssshmmmhssso</span>    <span class="text-warning">CPU:</span> AMD EPYC / Intel Core (8 cores)
<span class="text-cyan">  +sssshhhyNMMNyssssssssssssyNMMMysssss+</span> <span class="text-warning">Memory:</span> 3240MiB / 15872MiB
<span class="text-cyan">   /sssssssssshmdmmNNmmyNMMMMhssssss/</span>    <span class="text-warning">Security:</span> Security Guard v4.2 Active
<span class="text-cyan">    .ossssssssssssssssssdMMMNysssso.</span>
        `);
        this.lastExitCode = 0;
        break;

      case "hostname":
        this.appendOutput("ltsp-master");
        this.lastExitCode = 0;
        break;

      case "env":
      case "printenv":
        this.appendOutput(`USER=student\nHOME=/home/student\nSHELL=/bin/bash\nTERM=xterm-256color\nAUTHOR=Alexander (@alexhack235-code)\nREPO=https://github.com/alexhack235-code/LTSP\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nSECURITY_GUARD=v4.2-ACTIVE`);
        this.lastExitCode = 0;
        break;

      case "tree":
        this.appendOutput(`.\n├── notes.log\n├── script.sh\n└── welcome.txt\n\n0 directories, 3 files`);
        this.lastExitCode = 0;
        break;

      case "python":
      case "python3":
        if (args.length === 0) {
          this.appendOutput(`Python 3.12.10 (main, Sep 2026)\n[GCC 13.2.0] on linux\nType "help", "copyright", "credits" or "license" for more information.\n>>> print("Hello from LTSP Python runtime!")\nHello from LTSP Python runtime!`);
        } else if (args[0] === "--version" || args[0] === "-V") {
          this.appendOutput("Python 3.12.10");
        } else {
          this.appendOutput(`[Python 3.12 executed: ${args.join(" ")}]`);
        }
        this.lastExitCode = 0;
        break;

      case "gcc":
      case "clang":
        if (args.length === 0) {
          this.appendOutput(`${cmd}: fatal error: no input files\ncompilation terminated.`, "text-danger");
          this.lastExitCode = 1;
        } else if (args.includes("-v") || args.includes("--version")) {
          this.appendOutput(`${cmd} (Ubuntu 13.2.0-23ubuntu4) 13.2.0\nTarget: x86_64-linux-gnu\nThread model: posix`);
          this.lastExitCode = 0;
        } else {
          this.appendOutput(`[${cmd} compiled: ${args.join(" ")} -> generated ELF 64-bit LSB executable]`);
          this.lastExitCode = 0;
        }
        break;

      case "nasm":
        if (args.length === 0) {
          this.appendOutput("nasm: fatal: no input file specified\ntype `nasm -h' for help", "text-danger");
          this.lastExitCode = 1;
        } else {
          this.appendOutput(`[nasm assembled: ${args.join(" ")} -> object file generated]`);
          this.lastExitCode = 0;
        }
        break;

      case "make":
        this.appendOutput("make: Nothing to be done for 'all'. (Target 'all' is up to date)");
        this.lastExitCode = 0;
        break;

      case "qemu":
      case "qemu-system-x86_64":
        this.appendOutput("Starting QEMU x86_64 virtual machine...\nBooting bare-metal kernel at 0x7c00 -> VGA Text Mode 0xB8000 initialized.\n(Virtual Machine running in headless mode)");
        this.lastExitCode = 0;
        break;

      case "curl":
      case "wget":
        const targetUrl = args[0] || "https://github.com/alexhack235-code/LTSP";
        this.appendOutput(`HTTP/2 200 OK\nserver: GitHub.com\ncontent-type: text/html; charset=utf-8\nstatus: 200 OK\n\n<!DOCTYPE html>\n<html><title>LTSP by Alexander (@alexhack235-code)</title>...</html>`);
        this.lastExitCode = 0;
        break;

      case "apt":
      case "apt-get":
        if (args[0] === "update") {
          this.appendOutput("Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nGet:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]\nFetched 126 kB in 1s (126 kB/s)\nReading package lists... Done\nBuilding dependency tree... Done");
        } else {
          this.appendOutput(`Reading package lists... Done\nBuilding dependency tree... Done\nSimulated apt package management for: ${args.join(" ")}`);
        }
        this.lastExitCode = 0;
        break;

      case "man":
        this.appendOutput(`Manual page for ${args[0] || "bash"}:\nNAME\n    ${args[0] || "bash"} - GNU Bourne-Again SHell\nDESCRIPTION\n    Full reference documentation available in the LTSP Curriculum & Compendium tabs.`);
        this.lastExitCode = 0;
        break;

      default:
        // Check if user typed a natural language query or question
        const isQuestion = rawCmd.includes("?") ||
          /^(who|what|where|when|why|how|explain|can|is|tell|create|author|about)\b/i.test(trimmed);

        if (isQuestion) {
          if (/who\s*(created|made|built|authored|designed)/i.test(trimmed) || /creator|author|alexander/i.test(trimmed)) {
            this.appendOutput(`
<span class="text-cyan">================================================================================</span>
<strong>LTSP Creator & Systems Architect:</strong> <span class="text-emerald font-bold">Alexander</span> (<a href="https://github.com/alexhack235-code" target="_blank" style="color: #38bdf8; text-decoration: underline;">@alexhack235-code</a>)
<strong>GitHub Repository:</strong> <a href="https://github.com/alexhack235-code/LTSP" target="_blank" style="color: #38bdf8; text-decoration: underline;">https://github.com/alexhack235-code/LTSP</a>
<span class="text-cyan">================================================================================</span>
            `);
          } else {
            this.appendOutput(`
<span class="text-warning"><i class="fa-solid fa-circle-question"></i> Query received:</span> "${this.escapeHTML(rawCmd)}"
<span class="text-muted">Simulated shell query processed. For in-depth interactive answers, click the <strong>AI Mentor</strong> button on the bottom right or visit the <strong>Curriculum</strong> tab!</span>
            `);
          }
          this.lastExitCode = 0;
        } else {
          // Smart simulated command execution for ANY arbitrary command!
          this.appendOutput(`[simulated execution of '${this.escapeHTML(cmd)}' with args: [${args.map(a => `'${this.escapeHTML(a)}'`).join(", ")}] — exit code: 0]`);
          this.lastExitCode = 0;
        }
        break;
    }
  }

  octalToSymbolic(octal) {
    if (!octal || octal.length < 3) return "rwxr-xr-x";
    const map = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
    const u = map[parseInt(octal[octal.length - 3]) || 0];
    const g = map[parseInt(octal[octal.length - 2]) || 0];
    const o = map[parseInt(octal[octal.length - 1]) || 0];
    return `${u}${g}${o}`;
  }
}
