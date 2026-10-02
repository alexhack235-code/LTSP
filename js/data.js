/**
 * LPIC-1 & Operating Systems Complete Master Training Curriculum
 * Based on LPIC-1 101-500 & 102-500 Exam Objectives and OS Core Foundations
 */

const TRAINING_DATA = {
  overview: {
    title: "Linux & Operating Systems Master Training Programme",
    subtitle: "From Absolute Beginner to Certified Linux Professional (LPIC-1 101-500 & 102-500)",
    pledge: "By the end of this training programme, you will have all the required knowledge on operating systems, command-line mastery, system administration, storage architectures, networking, process lifecycles, and security — fully preparing you for LPIC-1 certification and real-world engineering roles.",
    stats: {
      modules: 16,
      commands: 120,
      checklistItems: 17,
      quizQuestions: 25,
      simulatedTerminal: true
    },
    whatYouGet: [
      {
        icon: "fa-book-open",
        title: "16 Beginner-Friendly Modules",
        desc: "Step-by-step progressive path from kernel internals to scripting, systemd, and networking."
      },
      {
        icon: "fa-terminal",
        title: "In-Browser Linux Terminal Sandbox",
        desc: "Safe, interactive command simulator with zero setup required and no risk to your machine."
      },
      {
        icon: "fa-calculator",
        title: "Interactive Visual Calculators",
        desc: "Octal permissions visualizer (chmod), Filesystem Hierarchy explorer, and I/O redirection diagrams."
      },
      {
        icon: "fa-tasks",
        title: "LPIC-1 Exam Checklist Tracker",
        desc: "Official 17-competency checklist from the compendium with persistent progress saving in your browser."
      },
      {
        icon: "fa-brain",
        title: "Interactive Knowledge Quizzes",
        desc: "Instant feedback questions with deep explanations to test your recall on commands, signals, and flags."
      },
      {
        icon: "fa-search",
        title: "Searchable Command Compendium",
        desc: "Instant real-time lookup for 120+ commands with syntax, purpose, examples, and 1-click copy."
      }
    ]
  },

  modules: [
    {
      id: "module-0",
      num: 0,
      title: "Foundations of Operating Systems",
      badge: "Core OS Architecture",
      icon: "fa-microchip",
      summary: "Understand what an operating system actually does before typing commands. Learn the kernel, user vs kernel space, virtual memory, system calls, and file descriptors.",
      beginnerAnalogy: "Think of an Operating System like an airport: The Hardware is the runway and planes; the Kernel is Air Traffic Control (orchestrating who lands and when); System Calls are the radio frequencies pilots use to ask permission; and Applications (like your shell or browser) are the airlines providing services to passengers.",
      keyConcepts: [
        {
          name: "Kernel vs User Space (Ring 0 vs Ring 3)",
          explanation: "CPUs have protection rings. The Kernel executes in Ring 0 (highest privilege, direct hardware access). User applications run in Ring 3 (restricted). If user software crashes, the system stays alive."
        },
        {
          name: "System Calls (Syscalls)",
          explanation: "The bridge between User Space and Kernel Space. When a program needs to read a file or send network packets, it executes a syscall (e.g., read(), write(), open(), fork(), execve())."
        },
        {
          name: "Virtual Memory & Swap",
          explanation: "Every process believes it owns a vast contiguous block of RAM. The Memory Management Unit (MMU) maps virtual addresses to physical RAM pages. When physical RAM is tight, inactive pages move to Swap space on disk."
        },
        {
          name: "'Everything is a File' & File Descriptors",
          explanation: "In UNIX/Linux, documents, directories, disk drives (/dev/sda), hardware devices, and network sockets are accessed as file streams. Every open file gets an integer index called a File Descriptor (FD 0=stdin, FD 1=stdout, FD 2=stderr)."
        },
        {
          name: "Process Scheduler & Multi-tasking",
          explanation: "Modern OS kernels slice CPU time into tiny milliseconds, rapidly switching between tasks (preemptive multi-tasking) to give the illusion of simultaneous execution even on single cores."
        }
      ],
      commands: []
    },

    {
      id: "module-1",
      num: 1,
      title: "Shell Navigation & Help System",
      badge: "Compendium Sec 1",
      icon: "fa-compass",
      summary: "Master the Linux command line interface, locating files, understanding how bash resolves commands, reading man pages, and managing your shell environment.",
      beginnerAnalogy: "The shell is your conversational bridge to the OS. Instead of clicking icons, you type direct instructions. Built-in help tools (man, info, apropos) are your indestructible survival guide inside the terminal.",
      keyConcepts: [
        {
          name: "Command Resolution Order",
          explanation: "When you type a command, Bash checks: 1) Aliases, 2) Reserved keywords, 3) Shell functions, 4) Shell built-ins, 5) Executables located in your PATH variable."
        },
        {
          name: "Manual Sections (man 1 to 8)",
          explanation: "Man pages are grouped by sections: 1=User commands, 5=File formats (like /etc/passwd), 8=System administration commands. E.g., 'man 5 passwd' reads the file layout, not the command."
        }
      ],
      commands: [
        { cmd: "pwd", purpose: "Print current working directory", example: "pwd", tip: "Shows where you are in the filesystem tree." },
        { cmd: "cd", purpose: "Change directory", example: "cd /etc", tip: "Use 'cd ~' or just 'cd' to return home, and 'cd -' to toggle back." },
        { cmd: "ls", purpose: "List files and directory contents", example: "ls -lah", tip: "-l = long list, -a = include hidden dotfiles, -h = human-readable sizes." },
        { cmd: "type", purpose: "Show how a command is interpreted", example: "type -a ls", tip: "Reveals if a command is an alias, builtin, or external binary." },
        { cmd: "which", purpose: "Locate executable in PATH", example: "which bash", tip: "Finds the exact path of the program that runs." },
        { cmd: "whereis", purpose: "Locate binary, source, and man page", example: "whereis bash", tip: "Searches standard binary and documentation directories." },
        { cmd: "man", purpose: "Read system manual pages", example: "man chmod", tip: "Press 'q' to quit, '/' to search inside the manual." },
        { cmd: "info", purpose: "Read GNU hyperlinked documentation", example: "info coreutils", tip: "Deeper, multi-page hierarchical docs maintained by GNU." },
        { cmd: "help", purpose: "Display help for Bash built-in commands", example: "help cd", tip: "Use this for commands built directly into bash like cd, export, history." },
        { cmd: "apropos", purpose: "Search manual page descriptions by keyword", example: "apropos partition", tip: "Equivalent to 'man -k'. Finds any command related to your topic." },
        { cmd: "history", purpose: "Show shell command history", example: "history", tip: "Use '!<number>' to re-run a specific command or '!!' for the last one." },
        { cmd: "alias / unalias", purpose: "Create or remove command shortcuts", example: "alias ll='ls -lah'", tip: "Put permanent aliases in your ~/.bashrc file." },
        { cmd: "env / printenv", purpose: "Show environment variables", example: "printenv PATH", tip: "Variables available to child processes spawned by this shell." },
        { cmd: "export", purpose: "Export shell variable to child environments", example: "export EDITOR=vim", tip: "Without export, variables remain local to the current shell only." },
        { cmd: "source", purpose: "Execute commands from a file in current shell", example: "source ~/.bashrc", tip: "Can also be written as '. ~/.bashrc'. Updates settings instantly." },
        { cmd: "echo / printf", purpose: "Print text and formatted variable strings", example: "printf '%s\\n' \"$USER\"", tip: "printf is more predictable than echo across different Unix distros." },
        { cmd: "clear / reset", purpose: "Clear terminal screen or reinitialize terminal state", example: "clear", tip: "Use 'reset' if messy terminal output garbled your cursor or character display." }
      ]
    },

    {
      id: "module-2",
      num: 2,
      title: "Files & Directory Architecture",
      badge: "Compendium Sec 2",
      icon: "fa-folder-tree",
      summary: "Understand the Linux Filesystem Hierarchy (FHS), navigate absolute vs relative paths, manage files, inspect metadata, and master hard vs symbolic links.",
      beginnerAnalogy: "In Linux there are no 'C:' or 'D:' drives. Everything starts from the single Root ('/'). Think of symbolic links as desktop shortcuts, and hard links as having two different nametags pointing to the exact same physical locker (inode).",
      keyConcepts: [
        {
          name: "Hard Links vs Symbolic (Soft) Links",
          explanation: "A Hard Link shares the exact same inode number and data blocks on disk; deleting one name leaves the file accessible until all hard links are removed. A Soft Link (ln -s) is just a pointer file containing the target path string; if target is deleted, it becomes broken."
        },
        {
          name: "Inodes (Index Nodes)",
          explanation: "Data structures storing file attributes (permissions, owner, size, timestamps, data block pointers) — everything EXCEPT the filename itself. Filenames are just directory table entries pointing to inodes."
        }
      ],
      commands: [
        { cmd: "touch", purpose: "Create empty file or update timestamps", example: "touch notes.txt", tip: "If file exists, updates access and modification time without changing data." },
        { cmd: "mkdir", purpose: "Create new directories", example: "mkdir -p project/src/utils", tip: "The -p flag creates parent directories automatically without erroring." },
        { cmd: "rmdir", purpose: "Remove empty directory", example: "rmdir olddir", tip: "Fails safely if directory contains files; use 'rm -r' for recursive removal." },
        { cmd: "cp", purpose: "Copy files and directories", example: "cp -a src backup", tip: "-a (archive) preserves permissions, timestamps, and symlinks recursively." },
        { cmd: "mv", purpose: "Move or rename files and directories", example: "mv old_name.txt new_name.txt", tip: "Renaming is just moving within the same directory." },
        { cmd: "rm", purpose: "Remove files and directory trees", example: "rm -r olddir", tip: "Permanent deletion! Linux has no recycling bin on command line. Be cautious." },
        { cmd: "ln", purpose: "Create hard or symbolic links", example: "ln -s /var/log/syslog log", tip: "Use '-s' for symbolic link. Omitting '-s' creates a hard link." },
        { cmd: "stat", purpose: "Show detailed file metadata and inode info", example: "stat file.txt", tip: "Displays exact Inode, Access/Modify/Change timestamps, and permissions." },
        { cmd: "file", purpose: "Identify file type via magic numbers", example: "file image.bin", tip: "Linux does not rely on extensions like .exe; 'file' inspects raw file header bytes." },
        { cmd: "basename / dirname", purpose: "Extract filename or directory path components", example: "dirname /var/log/syslog", tip: "basename gives 'syslog', dirname gives '/var/log'. Great in scripts." },
        { cmd: "readlink / realpath", purpose: "Resolve canonical target of symbolic links", example: "readlink -f link", tip: "Finds the ultimate real destination file even through chains of symlinks." }
      ]
    },

    {
      id: "module-3",
      num: 3,
      title: "Text, Search & Stream Processing",
      badge: "Compendium Sec 3",
      icon: "fa-filter",
      summary: "Harness the true power of Unix text utilities. Learn grep, regular expressions, stream editing with sed, column extraction with awk & cut, and sorting streams.",
      beginnerAnalogy: "Unix programs are like Lego bricks. Each command does one simple thing well (like finding words, cutting columns, or counting lines), and the Pipe character '|' connects the output of one Lego brick into the input of the next.",
      keyConcepts: [
        {
          name: "The Unix Philosophy",
          explanation: "Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface."
        },
        {
          name: "Regular Expressions (Regex)",
          explanation: "Patterns matching text. '^' = start of line, '$' = end of line, '.' = any character, '*' = 0 or more occurrences. 'grep -E' enables Extended regex (+, ?, |, ())."
        }
      ],
      commands: [
        { cmd: "cat / tac", purpose: "Display file contents / reverse display lines", example: "cat file.txt", tip: "tac reads from the bottom up! Great for reversing time-sorted logs." },
        { cmd: "less / more", purpose: "Page through text files interactively", example: "less /var/log/syslog", tip: "Press space to page forward, 'b' back, '/' to search, 'q' to quit." },
        { cmd: "head / tail", purpose: "Show beginning or ending lines of a file", example: "tail -n 50 file", tip: "Default is 10 lines. Specifying -n lets you customize the count." },
        { cmd: "tail -f", purpose: "Follow growing file in real-time", example: "tail -f /var/log/auth.log", tip: "Essential for live troubleshooting of log files as events occur." },
        { cmd: "wc", purpose: "Count lines, words, and byte counts", example: "wc -l file", tip: "Commonly piped after grep to count matches: 'grep error log | wc -l'." },
        { cmd: "grep", purpose: "Search text for regular expression patterns", example: "grep -rin 'error' /var/log", tip: "-r = recursive, -i = case insensitive, -n = line numbers." },
        { cmd: "grep -E", purpose: "Search with Extended Regular Expressions", example: "grep -E 'foo|bar' file", tip: "Enables alternation (|), one-or-more (+), zero-or-one (?)." },
        { cmd: "grep -F", purpose: "Fast fixed-string search (literal characters)", example: "grep -F '[ERROR]' log", tip: "Treats characters like [, ., * as literal characters, not regex." },
        { cmd: "sed", purpose: "Stream editor for filtering and transforming text", example: "sed 's/old/new/g' file", tip: "Substitute text on the fly without opening a text editor." },
        { cmd: "awk", purpose: "Pattern scanning and column processing language", example: "awk -F: '{print $1}' /etc/passwd", tip: "-F sets delimiter. $1 is field 1, $NF is the last field." },
        { cmd: "cut", purpose: "Extract specific sections or fields from lines", example: "cut -d: -f1 /etc/passwd", tip: "-d sets delimiter, -f specifies which fields to output." },
        { cmd: "sort", purpose: "Sort lines of text files", example: "sort -n numbers.txt", tip: "Use '-n' for numeric sort, '-r' for reverse, '-k' for specific key column." },
        { cmd: "uniq", purpose: "Filter or count adjacent duplicate lines", example: "sort names.txt | uniq -c", tip: "Input must be sorted first! -c displays repetition count." },
        { cmd: "tr", purpose: "Translate, squeeze, or delete characters", example: "tr 'a-z' 'A-Z'", tip: "Works from stdin only: e.g., 'cat file | tr -d '\\r'' strips Windows CRLF." },
        { cmd: "tee", purpose: "Read from stdin and write to both stdout and files", example: "cmd | tee output.log", tip: "Splits output stream so you see it on screen AND save it to disk." },
        { cmd: "xargs", purpose: "Build and execute command lines from stdin", example: "printf '%s\\n' *.log | xargs rm", tip: "Converts streaming items into arguments for commands that don't take stdin." },
        { cmd: "diff / cmp", purpose: "Compare two files line by line or byte by byte", example: "diff -u old.conf new.conf", tip: "-u produces a unified diff, standard for Git and software patches." },
        { cmd: "comm", purpose: "Compare two sorted files line by line", example: "comm file1 file2", tip: "Shows lines unique to file 1, unique to file 2, and common lines." },
        { cmd: "strings", purpose: "Extract printable text strings from binary files", example: "strings /usr/bin/ls", tip: "Inspect compiled binary executables to reveal embedded messages or URLs." }
      ]
    },

    {
      id: "module-4",
      num: 4,
      title: "File Permissions, Ownership & ACLs",
      badge: "Compendium Sec 4",
      icon: "fa-shield-halved",
      summary: "Understand Linux multi-user security: Owner/Group/Others, octal vs symbolic chmod, chown, umask calculations, Access Control Lists (ACLs), and immutable file attributes.",
      beginnerAnalogy: "Every file has a security badge: Who owns it (User), what team can see it (Group), and what the general public can do (Others). The permissions are 3 numbers: Read (4), Write (2), and Execute (1). Add them up: 4+2+1 = 7 (everything!).",
      keyConcepts: [
        {
          name: "Octal Permission Breakdown (r=4, w=2, x=1)",
          explanation: "7 = rwx (4+2+1), 6 = rw- (4+2), 5 = r-x (4+1), 4 = r-- (4), 0 = --- (no access). For directory access, 'execute' (x) means permission to enter (cd into) the directory!"
        },
        {
          name: "Umask (User File-Creation Mask)",
          explanation: "Default base permission is 666 for files and 777 for directories. The umask subtracts permissions. If umask is 022, new files get 666 - 022 = 644 (rw-r--r--)."
        }
      ],
      commands: [
        { cmd: "find", purpose: "Search for files by attributes (name, size, time)", example: "find /etc -type f -name '*.conf'", tip: "Combine with '-exec <cmd> {} +' to perform actions on all found files." },
        { cmd: "locate", purpose: "Instant filename search using prebuilt database", example: "locate ssh_config", tip: "Much faster than find, but relies on the mlocate database index." },
        { cmd: "updatedb", purpose: "Update the locate command index database", example: "sudo updatedb", tip: "Must be run as root to index newly created files across the filesystem." },
        { cmd: "chmod", purpose: "Change file access permissions", example: "chmod 640 secret.txt", tip: "Symbolic: 'chmod u+x,g-w file'. Octal: 'chmod 755 script.sh'." },
        { cmd: "chown", purpose: "Change file owner and group", example: "sudo chown alice:staff file.txt", tip: "Format is 'user:group'. Use -R to apply recursively to directories." },
        { cmd: "chgrp", purpose: "Change group ownership of files", example: "chgrp developers file.txt", tip: "Similar to chown, but modifies only the group attribute." },
        { cmd: "umask", purpose: "Set or display default file creation permission mask", example: "umask 027", tip: "Determines what permissions are withheld from newly created files." },
        { cmd: "getfacl / setfacl", purpose: "Display or set fine-grained Access Control Lists", example: "setfacl -m u:bob:r file", tip: "Extends traditional Unix permissions to grant specific users custom rights." },
        { cmd: "lsattr / chattr", purpose: "List and modify ext filesystem attributes", example: "sudo chattr +i file", tip: "+i makes a file completely immutable — even root cannot delete or edit it!" }
      ]
    },

    {
      id: "module-5",
      num: 5,
      title: "Archives, Compression & Backups",
      badge: "Compendium Sec 5",
      icon: "fa-file-zipper",
      summary: "Understand archiving (combining files) versus compression (shrinking bytes). Master tar, gzip, bzip2, xz compression ratios, zip, and cpio.",
      beginnerAnalogy: "Archiving (tar) is putting clothes into a suitcase; Compression (gzip/xz) is vacuum-sealing the suitcase to make it take up less space. Tar puts things together; compressors shrink them!",
      keyConcepts: [
        {
          name: "Compression Trade-offs (Speed vs Ratio)",
          explanation: "gzip (.gz) = fast compression, moderate ratio; bzip2 (.bz2) = slower, better compression; xz (.xz) = slowest compression, highest compression ratio."
        },
        {
          name: "Tar Flag Mnemonics",
          explanation: "-c = Create, -x = eXtract, -t = Table of contents (list), -v = Verbose, -f = File (must come immediately before filename). -z = gzip, -j = bzip2, -J = xz."
        }
      ],
      commands: [
        { cmd: "tar", purpose: "Create, inspect, or extract archive files", example: "tar -czf backup.tar.gz project/", tip: "-c (create), -z (gzip), -f (filename). Extract with 'tar -xzf backup.tar.gz'." },
        { cmd: "gzip / gunzip", purpose: "Compress or decompress files using LZ77 (.gz)", example: "gzip database.sql", tip: "Note: by default, gzip deletes the original file unless '-k' (keep) is used." },
        { cmd: "bzip2 / bunzip2", purpose: "High-compression tool using Burrows-Wheeler (.bz2)", example: "bzip2 archive.tar", tip: "Produces smaller files than gzip for text data, but uses more CPU." },
        { cmd: "xz / unxz", purpose: "Maximum compression tool using LZMA2 (.xz)", example: "xz kernel.tar", tip: "Highest compression ratio. Standard for modern Linux distribution packages." },
        { cmd: "zip / unzip", purpose: "Standard cross-platform archive/compressor", example: "zip -r project.zip project/", tip: "Compresses individual files within archive; universally supported on Windows/Mac." },
        { cmd: "cpio", purpose: "Copy files to and from archives (used in initramfs)", example: "find . -print | cpio -ov > a.cpio", tip: "Traditional packaging format still used by Linux initramfs boot images and RPMs." }
      ]
    },

    {
      id: "module-6",
      num: 6,
      title: "Processes, Signals & Job Control",
      badge: "Compendium Sec 6",
      icon: "fa-bars-progress",
      summary: "Inspect running processes, manage system load, send termination signals (TERM, KILL, HUP), prioritize with nice/renice, and control background shell jobs.",
      beginnerAnalogy: "A Program is a recipe saved in a cookbook (disk); a Process is a chef actively cooking that recipe in the kitchen (CPU & RAM). Signals are shouting instructions to the chef: 'Pause!', 'Clean up nicely (SIGTERM)', or 'Shut everything down immediately (SIGKILL)'!",
      keyConcepts: [
        {
          name: "Process Lifecycle & PID 1",
          explanation: "Every process is born from a parent via fork() and given a Process ID (PID). PID 1 (systemd) is the ancestor of all user processes. When a parent dies without cleaning up, children become orphans or zombies."
        },
        {
          name: "Signals: SIGTERM (15) vs SIGKILL (9)",
          explanation: "SIGTERM asks nicely, allowing the program to save state, close databases, and delete temp files. SIGKILL immediately terminates the process via the kernel — it cannot be caught or ignored."
        }
      ],
      commands: [
        { cmd: "ps", purpose: "Report snapshot of current processes", example: "ps aux", tip: "'a' = all users, 'u' = user-oriented format, 'x' = include processes without TTY." },
        { cmd: "pgrep / pkill", purpose: "Find or signal processes by program name", example: "pgrep sshd", tip: "No need to look up PID manually. 'pkill -9 nginx' terminates all nginx instances." },
        { cmd: "top", purpose: "Interactive dynamic real-time process monitor", example: "top", tip: "Press 'M' to sort by memory, 'P' by CPU, 'k' to kill a PID, 'q' to quit." },
        { cmd: "kill", purpose: "Send signal to specified Process ID (PID)", example: "kill -TERM 1234", tip: "Default signal is SIGTERM (15). Use 'kill -9 <PID>' for emergency termination." },
        { cmd: "killall", purpose: "Signal all processes matching a process name", example: "killall firefox", tip: "Terminates every instance of the named binary across the system." },
        { cmd: "nice / renice", purpose: "Start with or alter scheduling priority of a process", example: "renice 10 -p 1234", tip: "Nice values range from -20 (highest priority/greedy) to +19 (nicest/lowest priority)." },
        { cmd: "jobs", purpose: "List active jobs controlled by the current shell", example: "jobs -l", tip: "Shows job number [%1], status (Running, Stopped), and PID." },
        { cmd: "bg / fg", purpose: "Resume stopped job in background or bring to foreground", example: "fg %1", tip: "Press Ctrl+Z in any command to pause it, then type 'bg' to run it in background." },
        { cmd: "nohup", purpose: "Run command immune to terminal hangups (SIGHUP)", example: "nohup cmd >out.log 2>&1 &", tip: "Keeps long tasks running even after you log out or close SSH session." },
        { cmd: "wait", purpose: "Wait for background process to complete", example: "wait $!", tip: "'$!' is the PID of the most recent background process. Returns its exit status." },
        { cmd: "free", purpose: "Display total, used, and free physical RAM and swap", example: "free -h", tip: "-h shows human-readable gigabytes/megabytes. Look at 'available' memory." },
        { cmd: "uptime", purpose: "Show how long system has been running and load averages", example: "uptime", tip: "Displays load averages for the past 1, 5, and 15 minutes." },
        { cmd: "watch", purpose: "Execute a program periodically, showing full-screen output", example: "watch -n 2 free -h", tip: "Refreshes every N seconds. Perfect for monitoring changing metrics." }
      ]
    },

    {
      id: "module-7",
      num: 7,
      title: "Users, Groups & Authentication",
      badge: "Compendium Sec 7",
      icon: "fa-users-gear",
      summary: "Administer user accounts, manage groups, understand security configuration files (/etc/passwd, /etc/shadow, /etc/group), sudo privileges, and password aging.",
      beginnerAnalogy: "Linux was built as a multi-user OS from day one. Accounts keep people isolated. Root is the superuser who can do anything. Sudo is the security keycard that lets authorized users perform administrative tasks without sharing the root password.",
      keyConcepts: [
        {
          name: "The Core Authentication Files",
          explanation: "/etc/passwd: World-readable user details (name, UID, GID, home dir, shell). /etc/shadow: Root-only hashed passwords and expiration dates. /etc/group: Group definitions and member lists."
        },
        {
          name: "UID Numbers",
          explanation: "UID 0 is always root. UIDs 1-999 are typically system/daemon service accounts. UIDs 1000+ are regular human users."
        }
      ],
      commands: [
        { cmd: "who / w", purpose: "Show who is logged in and what they are doing", example: "w", tip: "'w' shows terminal (pts), remote IP, login time, idle time, and current command." },
        { cmd: "whoami", purpose: "Print current active effective username", example: "whoami", tip: "Quickest check to see if you are operating as normal user or root." },
        { cmd: "id", purpose: "Print real and effective UID, GID, and groups", example: "id alice", tip: "Crucial for verifying permission group memberships." },
        { cmd: "groups", purpose: "Print group memberships for specified user", example: "groups alice", tip: "Lists all supplementary groups the user belongs to." },
        { cmd: "last / lastlog", purpose: "Show recent user login history", example: "last", tip: "Reads /var/log/wtmp to show previous logins, reboots, and session durations." },
        { cmd: "su", purpose: "Switch user or become superuser", example: "su - alice", tip: "Always use 'su -' (with dash) to load the target user's full login environment!" },
        { cmd: "sudo", purpose: "Execute command with administrative privileges", example: "sudo systemctl status ssh", tip: "Configured via /etc/sudoers (edit safely only using 'visudo')." },
        { cmd: "passwd", purpose: "Change or manage user account password", example: "passwd", tip: "Root can change any user's password with 'sudo passwd username'." },
        { cmd: "useradd", purpose: "Create a new user account", example: "sudo useradd -m -s /bin/bash alice", tip: "Always include '-m' to create the user's home directory (/home/alice)." },
        { cmd: "usermod", purpose: "Modify user account settings and groups", example: "sudo usermod -aG wheel alice", tip: "CRITICAL: Always use '-aG' (append group) so you don't remove existing groups!" },
        { cmd: "userdel", purpose: "Delete user account from system", example: "sudo userdel -r alice", tip: "The '-r' flag removes the user's home directory and mail spool." },
        { cmd: "groupadd", purpose: "Create a new user group", example: "sudo groupadd developers", tip: "Creates an entry in /etc/group with a new unique GID." },
        { cmd: "groupmod / groupdel", purpose: "Modify or delete existing group", example: "sudo groupmod -n dev developers", tip: "groupdel deletes the group; won't delete users who were members." },
        { cmd: "gpasswd", purpose: "Manage group membership and passwords", example: "sudo gpasswd -a alice developers", tip: "Alternative way to add (-a) or remove (-d) users from secondary groups." },
        { cmd: "chage", purpose: "Change and inspect user password expiration policies", example: "sudo chage -l alice", tip: "Controls password aging, maximum lifetime, and account lockout dates." }
      ]
    },

    {
      id: "module-8",
      num: 8,
      title: "Hardware, Kernel & Hardware Discovery",
      badge: "Compendium Sec 8",
      icon: "fa-server",
      summary: "Discover motherboard components, PCI/USB devices, CPU topology, kernel boot logs (dmesg), loadable kernel modules (lsmod, modprobe), and tune kernel parameters with sysctl.",
      beginnerAnalogy: "The Kernel is modular like a gaming console: you don't build every game into the hardware; you plug in cartridges when needed. In Linux, 'Kernel Modules' are device drivers loaded into memory on demand when hardware is plugged in.",
      keyConcepts: [
        {
          name: "Kernel Modules (.ko files)",
          explanation: "Drivers stored under /lib/modules/$(uname -r)/. They allow the kernel to support new hardware or filesystems without having to recompile or reboot."
        },
        {
          name: "The /proc and /sys Virtual Filesystems",
          explanation: "They do not exist on disk! They are real-time windows directly into kernel memory. E.g. /proc/cpuinfo shows CPU specs, and /proc/sys/ contains tunable kernel knobs."
        }
      ],
      commands: [
        { cmd: "uname", purpose: "Print system and kernel architecture information", example: "uname -a", tip: "Shows kernel version, hostname, architecture (x86_64), and build date." },
        { cmd: "hostname / hostnamectl", purpose: "Show or configure system hostname and metadata", example: "hostnamectl status", tip: "hostnamectl also shows OS release, kernel version, and virtualization type." },
        { cmd: "lscpu", purpose: "Display CPU architecture and core details", example: "lscpu", tip: "Shows socket count, cores per socket, threads, and hardware virtualization flags." },
        { cmd: "lsblk", purpose: "List block storage devices in a tree structure", example: "lsblk -f", tip: "-f displays filesystem type (ext4, xfs) and UUIDs for every partition." },
        { cmd: "blkid", purpose: "Locate and print block device attributes and UUIDs", example: "sudo blkid", tip: "Essential when writing /etc/fstab mount entries by UUID instead of device names." },
        { cmd: "lspci", purpose: "List all PCI and PCIe bus devices", example: "lspci -nn", tip: "Detects graphics cards, RAID controllers, network cards, and host bridges." },
        { cmd: "lsusb", purpose: "List all connected USB devices and hubs", example: "lsusb", tip: "Inspects USB bus tree, device IDs, and vendor information." },
        { cmd: "dmesg", purpose: "Print or control the kernel ring buffer logs", example: "dmesg | less", tip: "Contains hardware detection logs, driver alerts, and memory errors from boot." },
        { cmd: "lsmod", purpose: "Show status of currently loaded kernel modules", example: "lsmod", tip: "Lists active drivers, memory footprint, and dependent module references." },
        { cmd: "modprobe", purpose: "Add or remove loadable modules with dependencies", example: "sudo modprobe loop", tip: "Smart loader that automatically resolves and loads required helper modules." },
        { cmd: "modinfo", purpose: "Show detailed information about a kernel module", example: "modinfo e1000e", tip: "Displays author, license, aliases, file location, and accepted parameters." },
        { cmd: "sysctl", purpose: "Configure kernel parameters at runtime", example: "sysctl net.ipv4.ip_forward", tip: "Modify parameters on the fly or persist them permanently in /etc/sysctl.conf." }
      ]
    },

    {
      id: "module-9",
      num: 9,
      title: "Disks, Filesystems & LVM Storage",
      badge: "Compendium Sec 9",
      icon: "fa-hard-drive",
      summary: "Understand disk partitioning (MBR vs GPT), filesystem creation (mkfs.ext4/xfs), mounting, storage monitoring (df, du), swap space, and Logical Volume Management (LVM).",
      beginnerAnalogy: "Raw disk is raw land. Partitioning (fdisk/gdisk) draws property boundary lines. Formatting with a filesystem (mkfs) builds the shelving and cataloging system. Mounting (mount) attaches that shelving unit onto a specific door (directory) in your house.",
      keyConcepts: [
        {
          name: "MBR (fdisk) vs GPT (gdisk)",
          explanation: "MBR is legacy, limited to 2TB disks and max 4 primary partitions. GPT is modern, supports disks up to millions of terabytes and 128 partitions by default."
        },
        {
          name: "LVM (Logical Volume Manager)",
          explanation: "Storage virtualization in 3 layers: PV (Physical Volume = raw partition) -> VG (Volume Group = storage pool) -> LV (Logical Volume = flexible virtual partition you can expand on the fly)."
        }
      ],
      commands: [
        { cmd: "df", purpose: "Report filesystem disk space usage", example: "df -hT", tip: "-h = human readable (GB/MB), -T = print filesystem type (ext4, xfs)." },
        { cmd: "du", purpose: "Estimate directory and file space usage", example: "du -sh /var/*", tip: "-s = summary for directory, -h = human readable. Finds space hogs!" },
        { cmd: "mount / umount", purpose: "Mount or unmount filesystems to directory paths", example: "sudo mount /dev/sdb1 /mnt", tip: "To make mounts permanent across reboots, add them to /etc/fstab." },
        { cmd: "findmnt", purpose: "Find and display tree view of mounted filesystems", example: "findmnt", tip: "Modern replacement for raw mount output; cleanly shows target and options." },
        { cmd: "fsck", purpose: "Check and repair a Linux filesystem", example: "sudo fsck /dev/sdb1", tip: "DANGER: Never run fsck on a mounted filesystem! Always unmount first." },
        { cmd: "mkfs / mkfs.ext4", purpose: "Build a Linux filesystem on a partition", example: "sudo mkfs.ext4 /dev/sdb1", tip: "Formats the partition. Erases all existing data on that partition." },
        { cmd: "mkswap / swapon / swapoff", purpose: "Initialize, enable, or disable swap space", example: "sudo swapon /dev/sdb2", tip: "Swap serves as virtual memory overflow when physical RAM is exhausted." },
        { cmd: "fdisk", purpose: "Manipulate disk partition table (MBR / DOS)", example: "sudo fdisk /dev/sdb", tip: "Interactive utility. Press 'm' for menu, 'p' to print, 'w' to write changes." },
        { cmd: "gdisk", purpose: "GPT partition table manipulator", example: "sudo gdisk /dev/sdb", tip: "The modern GPT counterpart to fdisk for drives larger than 2 Terabytes." },
        { cmd: "parted", purpose: "Modern partition manipulation program for scripting", example: "sudo parted /dev/sdb", tip: "Supports both MBR and GPT, and can resize partitions directly." },
        { cmd: "tune2fs", purpose: "Adjust tunable filesystem parameters on ext2/ext3/ext4", example: "sudo tune2fs -l /dev/sdb1", tip: "Inspect or tweak mount counts, reserved block percentages, and labels." },
        { cmd: "pvs / pvcreate", purpose: "Display or initialize LVM Physical Volumes", example: "sudo pvs", tip: "Prepares raw partitions or disks to be consumed by LVM." },
        { cmd: "vgs / vgcreate", purpose: "Display or create LVM Volume Groups", example: "sudo vgs", tip: "Combines multiple physical volumes into one big flexible storage pool." },
        { cmd: "lvs / lvcreate", purpose: "Display or create LVM Logical Volumes", example: "sudo lvs", tip: "Carves out virtual partitions from volume groups to be formatted." },
        { cmd: "lvextend / lvreduce", purpose: "Resize LVM Logical Volumes dynamically", example: "sudo lvextend -L +5G /dev/vg/lv", tip: "Grow storage on the fly without unmounting using '-r' to resize filesystem too." }
      ]
    },

    {
      id: "module-10",
      num: 10,
      title: "Package Management Across Distros",
      badge: "Compendium Sec 10",
      icon: "fa-box-open",
      summary: "Understand the two dominant Linux package families: Debian (.deb with apt, dpkg) and Red Hat/Fedora (.rpm with dnf, yum, rpm, zypper), dependency resolution, and repositories.",
      beginnerAnalogy: "Package managers are the App Stores of Linux. Low-level tools (dpkg, rpm) install a single file directly (like running an installer). High-level tools (apt, dnf) contact internet repositories, download software, and automatically install all needed dependencies.",
      keyConcepts: [
        {
          name: "Debian vs RPM Ecosystem",
          explanation: "Debian/Ubuntu use .deb packages handled by dpkg and apt. Red Hat/CentOS/Fedora use .rpm packages handled by rpm and dnf (formerly yum). openSUSE uses zypper."
        },
        {
          name: "Repositories & Metadata",
          explanation: "Apt keeps a local index (/var/lib/apt/lists/) of available packages. 'apt update' refreshes this catalog; 'apt upgrade' installs newer versions."
        }
      ],
      commands: [
        { cmd: "apt", purpose: "User-friendly Debian/Ubuntu package frontend", example: "sudo apt install nginx", tip: "Combines search, install, update, and remove into one modern CLI." },
        { cmd: "apt-get", purpose: "Low-level robust APT package manager", example: "sudo apt-get update", tip: "Preferred in production scripts and Dockerfiles for consistent behavior." },
        { cmd: "apt-cache", purpose: "Query the APT package cache metadata", example: "apt-cache policy bash", tip: "Inspect which version is installed and what versions repositories offer." },
        { cmd: "dpkg", purpose: "Debian package tool for local .deb archives", example: "dpkg -l", tip: "'dpkg -i package.deb' installs; does NOT auto-resolve internet dependencies." },
        { cmd: "rpm", purpose: "Red Hat Package Manager for local .rpm files", example: "rpm -qa", tip: "-qa lists all installed RPMs. 'rpm -qf /path/file' reveals which package owns a file." },
        { cmd: "dnf", purpose: "Modern RPM-family manager for Fedora/RHEL 8+", example: "sudo dnf install nginx", tip: "Faster next-generation replacement for yum with better dependency resolution." },
        { cmd: "yum", purpose: "Traditional Yellowdog Updater Modified for CentOS/RHEL 7", example: "sudo yum install nginx", tip: "Still widely encountered in legacy production enterprise systems." },
        { cmd: "zypper", purpose: "Package manager for SUSE and openSUSE Linux", example: "sudo zypper install nginx", tip: "High-speed SAT solver-based package manager used in SUSE Linux Enterprise." }
      ]
    },

    {
      id: "module-11",
      num: 11,
      title: "Boot Process, Init & systemd",
      badge: "Compendium Sec 11",
      icon: "fa-power-off",
      summary: "Trace the boot sequence from firmware to systemd, manage system services with systemctl, inspect binary logs with journalctl, and control system power states.",
      beginnerAnalogy: "Booting a computer is like starting a rocket launch: 1) BIOS/UEFI checks hardware, 2) GRUB bootloader loads the Kernel into memory, 3) Kernel initializes drivers, and 4) systemd takes control as PID 1, starting all services (web servers, networking, login prompts) in parallel.",
      keyConcepts: [
        {
          name: "systemd Units & Targets",
          explanation: "systemd organizes everything into Units: .service (daemons), .target (boot states/runlevels, like multi-user.target vs graphical.target), .socket, .mount."
        },
        {
          name: "systemctl enable vs start",
          explanation: "'start' launches the service right now. 'enable' configures the service to launch automatically on next boot. 'enable --now' does both!"
        }
      ],
      commands: [
        { cmd: "systemctl", purpose: "Central command to inspect and control systemd system", example: "systemctl status ssh", tip: "Shows if a service is loaded, active (running), and its recent log output." },
        { cmd: "systemctl enable/start/stop", purpose: "Boot enablement and service runtime control", example: "sudo systemctl enable --now ssh", tip: "Use '--now' to start a service immediately while also enabling it for boot." },
        { cmd: "systemctl restart/reload", purpose: "Restart or gracefully reload service configuration", example: "sudo systemctl restart nginx", tip: "'reload' re-reads config without dropping active user connections!" },
        { cmd: "systemctl list-units", purpose: "List active units managed by systemd", example: "systemctl list-units --type=service", tip: "Quick overview of every running daemon and service on the machine." },
        { cmd: "journalctl", purpose: "Query and inspect the systemd centralized binary journal", example: "journalctl -b", tip: "-b shows logs only from the current boot; -b -1 shows previous boot!" },
        { cmd: "journalctl -u", purpose: "View logs filtered by a specific systemd unit", example: "journalctl -u ssh", tip: "Much cleaner than digging through scattered /var/log/ files." },
        { cmd: "journalctl -f", purpose: "Follow live journal logs in real time", example: "journalctl -f", tip: "Equivalent to 'tail -f' for the unified systemd journal." },
        { cmd: "shutdown", purpose: "Safely bring down or restart the system", example: "sudo shutdown -h +15 'Upgrading'", tip: "Notifies logged in users and shuts down gracefully after specified minutes." },
        { cmd: "reboot / poweroff", purpose: "Immediately reboot or shut down system", example: "sudo reboot", tip: "Shortcut wrapper calling systemctl reboot or systemctl poweroff." },
        { cmd: "wall", purpose: "Broadcast a message to all logged-in terminals", example: "echo Maintenance | wall", tip: "Sends emergency alert banner across all active terminal sessions." },
        { cmd: "init / telinit", purpose: "SysVinit compatibility controls for changing runlevels", example: "sudo init 3", tip: "Legacy command. Runlevel 3 = multi-user CLI; Runlevel 5 = GUI." }
      ]
    },

    {
      id: "module-12",
      num: 12,
      title: "Networking & Remote Diagnostics",
      badge: "Compendium Sec 12",
      icon: "fa-network-wired",
      summary: "Inspect IP addresses and routes with modern 'ip', check listening ports with 'ss', diagnose DNS with 'dig' and 'host', download with 'curl'/'wget', and connect via SSH/SCP/SFTP.",
      beginnerAnalogy: "Your computer is a house: the IP address is your street address; the Gateway/Router is the driveway to the outside world; Ports are specific doors (Door 80 is HTTP, Door 443 is HTTPS, Door 22 is SSH); and DNS is the phonebook translating names into IP addresses.",
      keyConcepts: [
        {
          name: "Modern 'ip' vs Legacy 'ifconfig'",
          explanation: "'ifconfig' and 'route' are obsolete deprecated tools. Modern Linux uses the unified 'ip' command suite: 'ip addr', 'ip link', 'ip route'."
        },
        {
          name: "Sockets & Ports (ss)",
          explanation: "'ss -tulpn' shows all active listeners: -t (TCP), -u (UDP), -l (Listening), -p (Process name/PID), -n (Numeric ports, don't resolve names)."
        }
      ],
      commands: [
        { cmd: "ip addr", purpose: "Show or configure network IP addresses", example: "ip addr", tip: "Replaces 'ifconfig'. Shows IPv4 (inet) and IPv6 (inet6) on each interface." },
        { cmd: "ip link", purpose: "Show or configure network interface state", example: "ip link set eth0 up", tip: "Controls Layer 2 state (UP/DOWN, MTU, MAC address)." },
        { cmd: "ip route", purpose: "Show or configure the kernel routing table", example: "ip route", tip: "Shows the 'default via <gateway>' entry where all internet traffic exits." },
        { cmd: "ss", purpose: "Inspect open network sockets and listeners", example: "ss -tulpn", tip: "Much faster replacement for netstat. Shows what service is listening on what port." },
        { cmd: "ping", purpose: "Test network reachability and round-trip latency", example: "ping -c 4 8.8.8.8", tip: "Always use '-c 4' on Linux, otherwise ping runs infinitely until Ctrl+C!" },
        { cmd: "traceroute / tracepath", purpose: "Trace hop-by-hop packet path to destination host", example: "traceroute example.com", tip: "Discovers every router along the network path; tracepath does not require root." },
        { cmd: "host", purpose: "Simple DNS lookup utility", example: "host example.com", tip: "Clean, concise IP lookup tool for quick DNS verification." },
        { cmd: "dig", purpose: "Detailed DNS interrogator and lookup tool", example: "dig example.com A", tip: "Displays full DNS response packet, TTL, authority, and answer records." },
        { cmd: "nslookup", purpose: "Query Internet name servers interactively", example: "nslookup example.com", tip: "Classic cross-platform DNS diagnostic tool available on Windows and Linux." },
        { cmd: "resolvectl", purpose: "Inspect systemd-resolved DNS resolver status", example: "resolvectl status", tip: "Shows which DNS server is currently bound to each network interface." },
        { cmd: "curl", purpose: "Transfer data from or to servers via HTTP/REST", example: "curl -I https://example.com", tip: "-I fetches headers only; -s silent; -O downloads file with remote name." },
        { cmd: "wget", purpose: "Non-interactive network file downloader", example: "wget https://example.com/file.iso", tip: "Supports resuming broken downloads (-c) and recursive mirroring (-r)." },
        { cmd: "ssh", purpose: "Open encrypted secure remote shell session", example: "ssh user@host", tip: "Use '-p <port>' for non-standard ports; use '-i key.pem' for private keys." },
        { cmd: "scp", purpose: "Copy files securely over SSH protocol", example: "scp file user@host:/tmp/", tip: "Syntax is like standard cp: 'scp source destination'. Use -r for folders." },
        { cmd: "sftp", purpose: "Interactive secure file transfer over SSH", example: "sftp user@host", tip: "Provides an interactive FTP-like prompt over encrypted SSH tunnel." },
        { cmd: "nc / netcat", purpose: "Swiss-army knife for arbitrary TCP/UDP connections", example: "nc -vz host 22", tip: "Tests if a remote port is open without needing a full client application." },
        { cmd: "ifconfig / route / arp", purpose: "Legacy net-tools network commands", example: "ifconfig -a", tip: "Included in LPIC-1 syllabus; replaced in modern Linux by the 'ip' suite." }
      ]
    },

    {
      id: "module-13",
      num: 13,
      title: "Shell Scripting & Automation",
      badge: "Compendium Sec 13",
      icon: "fa-scroll",
      summary: "Write automated Bash scripts from scratch: shebang (#!), variables, positional parameters ($1..$9, $@, $#), conditionals, loops, functions, exit codes, and cron jobs.",
      beginnerAnalogy: "Instead of typing the same 10 commands every morning, put them in a text file, give it execute permissions (chmod +x), and let the computer run the whole checklist in milliseconds while you sip coffee.",
      keyConcepts: [
        {
          name: "The Shebang Line (#!/bin/bash)",
          explanation: "The very first line of any script. Tells the kernel which interpreter binary must execute the script instructions."
        },
        {
          name: "Exit Codes ($?)",
          explanation: "Every command exits with an integer from 0 to 255. 0 = SUCCESS! Anything non-zero (1-255) represents an error. $? holds the exit code of the last run command."
        }
      ],
      commands: [
        { cmd: "bash script.sh", purpose: "Execute a bash script file", example: "bash script.sh", tip: "Executes in a subshell even if the file does not have executable (+x) permissions." },
        { cmd: "chmod +x", purpose: "Make script file directly executable", example: "chmod +x script.sh", tip: "Allows you to execute the script directly as './script.sh'." },
        { cmd: "read", purpose: "Read a line of input from standard input / user", example: "read -r name", tip: "-r prevents backslashes from acting as escape characters." },
        { cmd: "test / [ ]", purpose: "Evaluate conditional expressions (POSIX test)", example: "[ -f file.txt ]", tip: "Check file existence: -f (file), -d (dir), -z (empty string), -eq (numbers)." },
        { cmd: "[[ ]]", purpose: "Bash extended conditional testing", example: "[[ $x == *.txt ]]", tip: "Preferred in modern Bash. Supports pattern matching and logical && / || without errors." },
        { cmd: "if / elif / else", purpose: "Conditional branch execution block", example: "if [[ -f x ]]; then echo yes; fi", tip: "Always terminate an if-block with 'fi'!" },
        { cmd: "case", purpose: "Pattern-based multi-way branching", example: "case $1 in start) cmd;; stop) cmd;; esac", tip: "Clean alternative to long chains of if/elif. Terminate blocks with 'esac'." },
        { cmd: "for", purpose: "Iterate over lists, files, or numbers", example: "for f in *.log; do echo \"$f\"; done", tip: "Syntax: 'for item in list; do ...; done'." },
        { cmd: "while / until", purpose: "Conditional looping until expression changes", example: "while read -r line; do echo \"$line\"; done", tip: "While loops execute as long as the test command returns 0 (success)." },
        { cmd: "function", purpose: "Define reusable modular code functions", example: "function greet(){ echo \"Hello $1\"; }", tip: "Functions accept their own positional parameters ($1, $2)." },
        { cmd: "return", purpose: "Return custom exit status code from a function", example: "return 0", tip: "Exits the function with a specific numeric status without killing the whole script." },
        { cmd: "exit", purpose: "Terminate current script with exit status", example: "exit 1", tip: "Exits immediately. Pass 0 for successful completion, 1+ for errors." },
        { cmd: "$?", purpose: "Special variable: Previous command exit status", example: "echo $?", tip: "0 = Success. Any non-zero = failure. Check immediately after a command." },
        { cmd: "$#", purpose: "Special variable: Count of positional arguments", example: "echo $#", tip: "Shows how many arguments were passed to the script." },
        { cmd: "$@", purpose: "Special variable: All positional arguments as array", example: "printf '%s\\n' \"$@\"", tip: "When quoted as \"$@\", preserves spaces inside individual arguments." },
        { cmd: "$1 ... $9", purpose: "Positional parameters passed to script/function", example: "echo \"First arg: $1\"", tip: "For arguments beyond 9, wrap in curly braces: ${10}, ${11}." },
        { cmd: "$(...)", purpose: "Command substitution: Capture output of command", example: "echo \"Kernel: $(uname -r)\"", tip: "Replaces legacy backticks `cmd`. Clean and can be nested!" },
        { cmd: "crontab", purpose: "Schedule recurring cron background jobs", example: "crontab -e", tip: "Format: minute hour day month day-of-week command (e.g., 0 2 * * * backup.sh)." }
      ]
    },

    {
      id: "module-14",
      num: 14,
      title: "I/O Redirection & Shell Operators",
      badge: "Compendium Sec 14",
      icon: "fa-arrows-split-up-and-left",
      summary: "Master the 3 standard streams: Stdin (0), Stdout (1), and Stderr (2). Understand overwrite vs append, merging error streams, pipelines, and logical chaining.",
      beginnerAnalogy: "Every command has 3 plumbing pipes attached: Pipe 0 brings water IN (stdin); Pipe 1 sends clean water OUT (stdout); and Pipe 2 sends muddy waste water OUT (stderr). You can redirect these pipes into buckets (files) or plug them into other pipes (|).",
      keyConcepts: [
        {
          name: "The 3 Standard Streams",
          explanation: "0 = stdin (keyboard), 1 = stdout (normal output), 2 = stderr (error messages). When you write 'cmd > file', you are implicitly writing 'cmd 1> file'."
        },
        {
          name: "Combining Streams (2>&1)",
          explanation: "'cmd > log 2>&1' redirects stdout to log, then points stderr to the same destination as stdout. Both normal output and error messages end up in log!"
        }
      ],
      commands: [
        { cmd: ">", purpose: "Redirect standard output, overwriting destination file", example: "cmd > out.txt", tip: "WARNING: If out.txt exists, it will be wiped clean without asking!" },
        { cmd: ">>", purpose: "Append standard output to bottom of destination file", example: "cmd >> out.txt", tip: "Safe for log files; preserves all existing content." },
        { cmd: "<", purpose: "Redirect file contents into command standard input", example: "sort < names.txt", tip: "Feeds file contents into commands that read from standard input." },
        { cmd: "2> / 2>>", purpose: "Redirect or append standard error (stderr) stream", example: "cmd 2> errors.log", tip: "Keeps error messages separated from regular output." },
        { cmd: "2>&1", purpose: "Send standard error to current destination of stdout", example: "cmd >log 2>&1", tip: "Classic idiom to capture both stdout and stderr into a single log file." },
        { cmd: "|", purpose: "Pipe: Connect stdout of command 1 into stdin of command 2", example: "ps aux | grep ssh", tip: "The fundamental glue of Unix modular tools." },
        { cmd: "&&", purpose: "Logical AND: Run next command only if previous succeeded (exit 0)", example: "make && make install", tip: "Prevents installing broken code if the build step fails." },
        { cmd: "||", purpose: "Logical OR: Run next command only if previous failed (exit != 0)", example: "test -f x || echo 'Missing'", tip: "Executes fallback action only upon error." },
        { cmd: ";", purpose: "Run commands sequentially regardless of success or failure", example: "date; whoami", tip: "Simple delimiter separating distinct statements on one line." },
        { cmd: "&", purpose: "Execute command asynchronously in the background", example: "long_task &", tip: "Returns prompt immediately and prints the job number and PID." }
      ]
    },

    {
      id: "module-15",
      num: 15,
      title: "Security & High-Value LPIC-1 Facts",
      badge: "Compendium Sec 15",
      icon: "fa-lock",
      summary: "High-yield exam facts: common permission masks (755, 644, 600, 700), sudo rights audit, user locking, process kill signals, and standard Linux exit codes.",
      beginnerAnalogy: "These are the cheat codes and exam favorites: The specific permission numbers every sysadmin has memorized, the exact signals sent during server shutdowns, and the status codes that tell you why a script failed.",
      keyConcepts: [
        {
          name: "The Golden Four Permissions",
          explanation: "755 (rwxr-xr-x) for scripts/executables; 644 (rw-r--r--) for regular files/configs; 600 (rw-------) for private keys/credentials; 700 (rwx------) for private directories (.ssh)."
        },
        {
          name: "Standard Process Signals",
          explanation: "1 (SIGHUP) Reload config; 2 (SIGINT) Keyboard interrupt Ctrl+C; 9 (SIGKILL) Immediate uncatchable kill; 15 (SIGTERM) Polite termination; 19 (SIGSTOP) Pause."
        }
      ],
      commands: [
        { cmd: "chmod 755", purpose: "rwx owner, rx group, rx others (Standard for scripts/dirs)", example: "chmod 755 script.sh", tip: "Everyone can read and run; only owner can edit." },
        { cmd: "chmod 644", purpose: "rw owner, r group, r others (Standard for text files)", example: "chmod 644 file.txt", tip: "Everyone can view; only owner can edit." },
        { cmd: "chmod 600", purpose: "rw owner only (Standard for private SSH keys)", example: "chmod 600 ~/.ssh/id_rsa", tip: "SSH will outright refuse to use private keys that are wider than 600!" },
        { cmd: "chmod 700", purpose: "rwx owner only (Standard for private user directories)", example: "chmod 700 ~/.ssh", tip: "Locks directory completely so no other user on the server can enter." },
        { cmd: "sudo -l", purpose: "List allowed and forbidden sudo commands for current user", example: "sudo -l", tip: "The first command you should run on a new server to inspect your privileges." },
        { cmd: "passwd -l / -u", purpose: "Lock or unlock a user's password in /etc/shadow", example: "sudo passwd -l alice", tip: "Prepends '!' to password hash, preventing password-based logins." },
        { cmd: "kill -TERM", purpose: "Polite graceful termination request (Signal 15)", example: "kill -TERM PID", tip: "Allows program to flush buffers and remove lockfiles." },
        { cmd: "kill -KILL", purpose: "Forced immediate termination (Signal 9)", example: "kill -KILL PID", tip: "Kernel terminates process instantly; cannot be caught, handled, or ignored." },
        { cmd: "SIGHUP (Signal 1)", purpose: "Hangup signal: often used by daemons to reload config", example: "kill -HUP PID", tip: "Daemons like Nginx or Apache re-read their conf without restarting." },
        { cmd: "SIGSTOP / SIGCONT", purpose: "Stop (pause) and continue (resume) a process (19 / 18)", example: "kill -STOP PID", tip: "Freezes execution in place until SIGCONT is delivered." },
        { cmd: "Exit Code: 0", purpose: "Standard Unix status indicating total success", example: "echo $? # output: 0", tip: "Any Unix script should exit 0 when it completes successfully." },
        { cmd: "Exit Code: 127", purpose: "Common shell status: 'Command not found'", example: "missing_cmd; echo $?", tip: "Means the command executable does not exist in any folder in your $PATH." }
      ]
    }
  ],

  // Page 9 of Compendium: LPIC-1 Final Practice Checklist
  checklist: [
    { id: "chk-1", text: "Navigate with absolute/relative paths and manipulate files safely.", category: "Files & Navigation" },
    { id: "chk-2", text: "Find files with find and combine it with tests/actions (-exec, -name, -type).", category: "Search & Discovery" },
    { id: "chk-3", text: "Use grep, sed, awk, cut, sort, uniq, wc and pipes for text processing.", category: "Text Processing" },
    { id: "chk-4", text: "Explain stdin, stdout, stderr, redirection and pipelines (0, 1, 2, 2>&1, |).", category: "I/O Redirection" },
    { id: "chk-5", text: "Create/extract tar archives and use gzip, bzip2 and xz compression.", category: "Archives & Compression" },
    { id: "chk-6", text: "Use chmod, chown, chgrp and umask; understand octal permissions.", category: "Permissions & Security" },
    { id: "chk-7", text: "Explain hard links vs symbolic links (inodes vs path pointers).", category: "Filesystems" },
    { id: "chk-8", text: "Inspect, prioritize and terminate processes; understand common signals (TERM, KILL).", category: "Processes" },
    { id: "chk-9", text: "Use Bash job control: jobs, bg, fg, &, nohup and wait.", category: "Job Control" },
    { id: "chk-10", text: "Manage users/groups and understand /etc/passwd, /etc/shadow and /etc/group.", category: "User Administration" },
    { id: "chk-11", text: "Use df, du, lsblk, blkid, mount and umount for storage troubleshooting.", category: "Storage & Mounting" },
    { id: "chk-12", text: "Understand partitions (MBR/GPT), filesystems, swap and basic LVM (PV, VG, LV).", category: "Storage & LVM" },
    { id: "chk-13", text: "Install/query/remove packages with Debian (apt/dpkg) and RPM-family (dnf/rpm) tools.", category: "Package Management" },
    { id: "chk-14", text: "Manage services and logs with systemctl and journalctl.", category: "Systemd & Services" },
    { id: "chk-15", text: "Inspect IP addresses, routes and sockets with ip and ss.", category: "Networking" },
    { id: "chk-16", text: "Troubleshoot DNS with dig/host and basic connectivity with ping.", category: "Networking" },
    { id: "chk-17", text: "Use ssh, scp and sftp securely.", category: "Remote Access" },
    { id: "chk-18", text: "Write basic Bash scripts with variables, tests, loops and exit codes.", category: "Shell Scripting" }
  ],

  // Interactive Quiz Questions
  quiz: [
    {
      id: "q1",
      question: "Which permission code corresponds to 'rwxr-xr-x'?",
      options: ["755", "644", "777", "700"],
      answer: 0,
      explanation: "Owner: rwx = 4+2+1 = 7. Group: r-x = 4+0+1 = 5. Others: r-x = 4+0+1 = 5. Total = 755."
    },
    {
      id: "q2",
      question: "Which signal forces an immediate process termination and CANNOT be caught or ignored?",
      options: ["SIGTERM (15)", "SIGINT (2)", "SIGKILL (9)", "SIGHUP (1)"],
      answer: 2,
      explanation: "SIGKILL (9) is handled directly by the kernel and cannot be intercepted or ignored by the target process."
    },
    {
      id: "q3",
      question: "What does the exit status '127' mean in a Bash shell?",
      options: ["Total Success", "Permission Denied", "Command Not Found", "Script timed out"],
      answer: 2,
      explanation: "127 is the standard Bash exit code when the executable could not be found anywhere in $PATH."
    },
    {
      id: "q4",
      question: "What is the difference between a Hard Link and a Symbolic Link?",
      options: [
        "A Hard Link copies the file, a Symbolic Link moves it.",
        "A Hard Link points to the same inode; a Symbolic Link points to the path name.",
        "A Hard Link can cross different filesystems, a Symbolic Link cannot.",
        "A Hard Link only works on directories."
      ],
      answer: 1,
      explanation: "Hard links share the same inode number and disk blocks. Symbolic links are small pointer files storing the target's path."
    },
    {
      id: "q5",
      question: "Which file contains user account password hashes and expiration dates?",
      options: ["/etc/passwd", "/etc/shadow", "/etc/group", "/etc/security"],
      answer: 1,
      explanation: "/etc/shadow is restricted to root only and stores the hashed passwords and password aging metadata."
    },
    {
      id: "q6",
      question: "Which command combination will redirect both standard output and standard error to 'output.log'?",
      options: [
        "cmd > output.log 2>&1",
        "cmd 2> output.log 1>&2",
        "cmd | output.log",
        "cmd &> /dev/null"
      ],
      answer: 0,
      explanation: "'cmd > output.log 2>&1' first redirects stdout to the file, then merges stderr (2) into the same place (&1)."
    },
    {
      id: "q7",
      question: "Which compression utility generally provides the highest compression ratio for Linux archives?",
      options: ["gzip", "bzip2", "xz", "zip"],
      answer: 2,
      explanation: "xz uses LZMA2 compression, resulting in the smallest file sizes among standard Linux compression tools."
    },
    {
      id: "q8",
      question: "What command enables a systemd service to start automatically upon system boot AND starts it right now?",
      options: [
        "systemctl start ssh",
        "systemctl enable --now ssh",
        "systemctl reload ssh",
        "systemctl boot ssh"
      ],
      answer: 1,
      explanation: "The '--now' flag tells systemctl to start the service immediately in addition to enabling it for boot."
    },
    {
      id: "q9",
      question: "Which command shows listening network ports along with their process names and PIDs without resolving hostnames?",
      options: ["ss -tulpn", "ip addr show", "traceroute -p", "ping -c 4"],
      answer: 0,
      explanation: "In 'ss -tulpn': -t (TCP), -u (UDP), -l (listening), -p (process info), -n (numeric IP/ports)."
    },
    {
      id: "q10",
      question: "What does the command 'chmod 600 ~/.ssh/id_rsa' do?",
      options: [
        "Makes the file readable and executable by everyone.",
        "Grants read and write permissions to the file owner only; no permissions for group or others.",
        "Grants full permissions (rwx) to the owner only.",
        "Sets the sticky bit on the private key file."
      ],
      answer: 1,
      explanation: "6 (rw-) for owner (4+2), 0 (---) for group, 0 (---) for others. This is mandatory for private SSH keys."
    },
    {
      id: "q11",
      question: "Which modern command replaces legacy 'ifconfig' and 'route' for network configuration on Linux?",
      options: ["netstat", "ip", "curl", "dig"],
      answer: 1,
      explanation: "The 'iproute2' suite ('ip addr', 'ip route', 'ip link') is the modern standard replacing legacy net-tools."
    },
    {
      id: "q12",
      question: "If a command line uses 'make && make install', when will 'make install' execute?",
      options: [
        "Always, regardless of whether make succeeded or failed.",
        "Only if 'make' exits with status 0 (success).",
        "Only if 'make' produces an error.",
        "In the background concurrently."
      ],
      answer: 1,
      explanation: "The '&&' operator is logical AND: the second command executes only if the first command succeeds (exit code 0)."
    }
  ],

  // Real-world practical scenarios
  scenarios: [
    {
      id: "sc-1",
      title: "Scenario 1: High CPU / Rogue Process Alert",
      badge: "Process Management",
      icon: "fa-fire",
      challenge: "A server CPU is pinned at 100%. A background script 'worker.py' is looping infinitely.",
      solution: [
        "Run <code>top</code> or <code>uptime</code> to verify current system load averages.",
        "Find the PID with <code>pgrep -l worker.py</code> or <code>ps aux | grep worker</code>.",
        "Politely request termination: <code>kill -TERM &lt;PID&gt;</code>.",
        "If it doesn't respond within 5 seconds, force terminate: <code>kill -KILL &lt;PID&gt;</code> (or <code>killall -9 worker.py</code>)."
      ]
    },
    {
      id: "sc-2",
      title: "Scenario 2: Disk Space 99% Full Emergency",
      badge: "Storage & Inodes",
      icon: "fa-hard-drive",
      challenge: "The root partition '/' is almost out of space, preventing database writes.",
      solution: [
        "Check which filesystem is full with <code>df -hT</code>.",
        "Locate the top space-consuming directories: <code>du -sh /* 2>/dev/null | sort -h</code>.",
        "Drill down into /var/log: <code>du -sh /var/log/* | sort -h</code>.",
        "Safely clean or truncate rotated log archives or temporary caches in <code>/tmp</code>."
      ]
    },
    {
      id: "sc-3",
      title: "Scenario 3: Secure Web Server Script Setup",
      badge: "Security & Permissions",
      icon: "fa-shield-halved",
      challenge: "You wrote an automated deployment script 'deploy.sh' that contains API tokens.",
      solution: [
        "Add shebang to the top: <code>#!/bin/bash</code>.",
        "Grant execute rights only to the owner: <code>chmod 700 deploy.sh</code>.",
        "Set ownership: <code>sudo chown deployuser:deployuser deploy.sh</code>.",
        "Verify with <code>ls -la deploy.sh</code> and <code>stat deploy.sh</code>."
      ]
    },
    {
      id: "sc-4",
      title: "Scenario 4: Web Server Fails to Start (Port Conflict)",
      badge: "Networking & Systemd",
      icon: "fa-network-wired",
      challenge: "Nginx fails to launch with 'Address already in use' error on port 80.",
      solution: [
        "Inspect the failure reason: <code>systemctl status nginx</code> or <code>journalctl -u nginx -e</code>.",
        "Find which program is holding port 80: <code>sudo ss -tulpn | grep :80</code>.",
        "Identify the rogue PID and terminate or reconfigure the conflicting service.",
        "Start Nginx cleanly: <code>sudo systemctl start nginx && sudo systemctl status nginx</code>."
      ]
    },
    {
      id: "sc-5",
      title: "Scenario 5: User Onboarding with Sudo Privileges",
      badge: "User Administration",
      icon: "fa-user-plus",
      challenge: "A new engineer 'sarah' joined the DevOps team and needs bash, home directory, and sudo rights.",
      solution: [
        "Create the account with home folder and bash shell: <code>sudo useradd -m -s /bin/bash sarah</code>.",
        "Set initial temporary password: <code>sudo passwd sarah</code>.",
        "Append user to administrative group without overwriting others: <code>sudo usermod -aG wheel,developers sarah</code> (or <code>sudo usermod -aG sudo sarah</code> on Debian/Ubuntu).",
        "Verify group memberships: <code>id sarah</code>."
      ]
    },
    {
      id: "sc-6",
      title: "Scenario 6: Automated Off-Site Directory Backup",
      badge: "Archives & Compression",
      icon: "fa-file-zipper",
      challenge: "Create a compressed archive of '/var/www/html' with maximum compression and copy to backup server.",
      solution: [
        "Package and compress using xz for smallest footprint: <code>tar -cJf /tmp/site_backup.tar.xz /var/www/html/</code>.",
        "Verify archive contents without extracting: <code>tar -tvf /tmp/site_backup.tar.xz</code>.",
        "Copy securely to the remote disaster recovery server: <code>scp /tmp/site_backup.tar.xz backupuser@dr-server.internal:/backups/</code>.",
        "Optionally automate via <code>crontab -e</code> to run daily at 02:00: <code>0 2 * * * /usr/local/bin/backup.sh</code>."
      ]
    }
  ]
};

