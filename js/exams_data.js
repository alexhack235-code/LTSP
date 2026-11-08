/**
 * LTSP - Global Exam Centres & Certification Simulation Questions Bank
 * Authorized Pearson VUE & LPI Test Centres Locator + Complete Exam Bank
 * 
 * Created & Engineered by Alexander (@alexhack235-code)
 */

const EXAM_CENTRES_DATA = [
  // =========================================================================
  // ONLINE REMOTE PROCTORING (WORLDWIDE)
  // =========================================================================
  {
    id: "ATC-ONVUE-GLOBAL",
    name: "Pearson VUE OnVUE Online Proctored Testing",
    region: "online",
    regionLabel: "Worldwide Remote Proctored",
    city: "Global / Remote (Your Home or Office)",
    country: "Worldwide (180+ Countries)",
    address: "Online Remote Examination with Live AI & Human Proctoring",
    phone: "+1-877-392-6433 (Global Support)",
    email: "support@pearsonvue.com",
    hours: "24 Hours / 7 Days a Week (Flexible Scheduling)",
    examsOffered: ["LPIC-1 (101-500 & 102-500)", "LPIC-2", "LPIC-3", "CompTIA Linux+ (XK0-005)", "Linux Foundation (LFCS)"],
    facilities: ["Live Webcam Proctoring", "Microphone Audio Monitoring", "Secure Locked Browser", "On-Screen Scratchpad"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Official LPI / Pearson VUE Online Delivery",
    notes: "Requires a reliable broadband connection (>3 Mbps upload/download), a functioning webcam, microphone, and a private quiet room."
  },

  // =========================================================================
  // NORTH AMERICA
  // =========================================================================
  {
    id: "ATC-NA-01",
    name: "Pearson Professional Centers - New York (Manhattan)",
    region: "north-america",
    regionLabel: "North America",
    city: "New York, NY",
    country: "United States",
    address: "19 W 44th Street, Suite 306, New York, NY 10036",
    phone: "+1 (212) 768-4560",
    email: "nyc.manhattan@pearsonvue.com",
    hours: "Mon - Sat: 8:00 AM - 6:00 PM EST",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["High-speed Gigabit Network", "Noise-Cancelling Headphones", "Biometric Palm-Vein Scanner", "Secure Locker Storage", "ADA Wheelchair Accessible"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Premier Authorized Test Center",
    notes: "Located near Times Square / Grand Central Terminal. 2 valid IDs required."
  },
  {
    id: "ATC-NA-02",
    name: "Silicon Valley Tech Exam Center - San Jose / San Francisco",
    region: "north-america",
    regionLabel: "North America",
    city: "San Jose, CA",
    country: "United States",
    address: "100 Century Center Court, Suite 400, San Jose, CA 95112",
    phone: "+1 (408) 453-2940",
    email: "bayarea@pearsonvue.com",
    hours: "Mon - Fri: 7:30 AM - 5:30 PM PST",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "Red Hat RHCSA / RHCE"],
    facilities: ["Ergonomic Workstations", "Ultra-wide Diagnostic Displays", "Silent Testing Booths", "Locker Amenities"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "LPI Approved Testing Provider",
    notes: "Heart of Silicon Valley. Ample free parking available on site."
  },
  {
    id: "ATC-NA-03",
    name: "Toronto Downtown Professional Testing Hub",
    region: "north-america",
    regionLabel: "North America",
    city: "Toronto, ON",
    country: "Canada",
    address: "21 King Street West, Suite 800, Toronto, ON M5H 4E6",
    phone: "+1 (416) 363-2228",
    email: "toronto@pearsonvue.com",
    hours: "Mon - Sat: 8:00 AM - 5:00 PM EST",
    examsOffered: ["LPIC-1", "LPIC-2", "CompTIA Linux+", "LFCS"],
    facilities: ["Full Climate Control", "Digital Proctoring", "Secure Storage", "Transit Accessible (King Station)"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Testing Center",
    notes: "Direct underground access from King Subway Station."
  },
  {
    id: "ATC-NA-04",
    name: "Austin Technology Testing & Certification Pavilion",
    region: "north-america",
    regionLabel: "North America",
    city: "Austin, TX",
    country: "United States",
    address: "800 Brazos Street, Suite 300, Austin, TX 78701",
    phone: "+1 (512) 474-9880",
    email: "austin.exams@pearsonvue.com",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM CST",
    examsOffered: ["LPIC-1", "LPIC-2", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["Dual Monitor Stations", "High-Definition Audio", "Secure Check-In"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Test Center",
    notes: "Located in downtown Austin Silicon Hills tech corridor."
  },

  // =========================================================================
  // EUROPE
  // =========================================================================
  {
    id: "ATC-EU-01",
    name: "Pearson Professional Centres - London (Holborn)",
    region: "europe",
    regionLabel: "Europe",
    city: "London",
    country: "United Kingdom",
    address: "190 High Holborn, Ground Floor, London WC1V 7BH",
    phone: "+44 (0) 20 7404 9055",
    email: "london.holborn@pearsonvue.com",
    hours: "Mon - Sat: 8:00 AM - 5:30 PM GMT",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "LFCS"],
    facilities: ["Fiber Optic Connectivity", "Active Noise Cancellation", "Biometric Registration", "Bilingual Support"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Premier Test Center",
    notes: "2-minute walk from Holborn Underground Station (Central & Piccadilly lines)."
  },
  {
    id: "ATC-EU-02",
    name: "LPI European Academy & Exam Center - Berlin Mitte",
    region: "europe",
    regionLabel: "Europe",
    city: "Berlin",
    country: "Germany",
    address: "Friedrichstraße 95, 10117 Berlin",
    phone: "+49 (0) 30 2064 8900",
    email: "berlin.mitte@lpi.org",
    hours: "Mon - Fri: 8:30 AM - 6:00 PM CET",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3 (Security/Mixed/Virtualization)", "CompTIA Linux+"],
    facilities: ["Official LPI Headquarters Partner", "Dual-Language Testing Terminals", "Dedicated Testing Pods"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Official LPI Regional Headquarters Center",
    notes: "German and English test delivery. Opposite Friedrichstraße S-Bahn & U-Bahn station."
  },
  {
    id: "ATC-EU-03",
    name: "Centre de Certification Informatique - Paris Opéra",
    region: "europe",
    regionLabel: "Europe",
    city: "Paris",
    country: "France",
    address: "14 Boulevard des Capucines, 75009 Paris",
    phone: "+33 (0) 1 42 68 55 00",
    email: "paris.opera@pearsonvue.com",
    hours: "Mon - Fri: 8:30 AM - 5:30 PM CET",
    examsOffered: ["LPIC-1", "LPIC-2", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["Ergonomic Desks", "Secure Individual Lockers", "High-speed Internet"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Select Center",
    notes: "Next to Opéra Garnier and RER A Auber station."
  },
  {
    id: "ATC-EU-04",
    name: "Amsterdam Tech Testing Hub - Zuidas",
    region: "europe",
    regionLabel: "Europe",
    city: "Amsterdam",
    country: "Netherlands",
    address: "Gustav Mahlerlaan 1025, 1082 MK Amsterdam",
    phone: "+31 (0) 20 794 8800",
    email: "amsterdam.zuidas@pearsonvue.com",
    hours: "Mon - Sat: 8:30 AM - 5:00 PM CET",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "LFCS"],
    facilities: ["Ultra-Quiet Study Lounges", "Advanced ID Verification", "Multi-lingual Staff"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Premier Center",
    notes: "Amsterdam South (Station Zuid) railway interchange."
  },

  // =========================================================================
  // AFRICA
  // =========================================================================
  {
    id: "ATC-AF-01",
    name: "Pearson Authorized Testing Center - Lagos (Victoria Island)",
    region: "africa",
    regionLabel: "Africa",
    city: "Lagos",
    country: "Nigeria",
    address: "Plot 1612 Adeola Hopewell Street, Victoria Island, Lagos 101241",
    phone: "+234 1 270 3450",
    email: "lagos.vi@pearsonvue.com",
    hours: "Mon - Sat: 8:00 AM - 5:00 PM WAT",
    examsOffered: ["LPIC-1 (101 & 102)", "LPIC-2", "LPIC-3", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["Uninterrupted Dual Solar & Generator Power", "Fiber Optic Backbone", "Biometric Check-in", "Air Conditioned Test Rooms", "Secure Lockers"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Select Center",
    notes: "Primary testing hub for West Africa. Strict government photo ID requirements."
  },
  {
    id: "ATC-AF-02",
    name: "East Africa IT Certification Institute - Nairobi",
    region: "africa",
    regionLabel: "Africa",
    city: "Nairobi",
    country: "Kenya",
    address: "West Park Suites, 5th Floor, Ojijo Road, Parklands, Nairobi",
    phone: "+254 20 374 8800",
    email: "nairobi.exams@pearsonvue.com",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM EAT",
    examsOffered: ["LPIC-1", "LPIC-2", "CompTIA Linux+", "LFCS"],
    facilities: ["Redundant Power Supply", "High Bandwidth ISP", "Noise Isolation Testing Pods"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "LPI Official Partner in East Africa",
    notes: "Conveniently accessible near Westlands business district."
  },
  {
    id: "ATC-AF-03",
    name: "Sandton Professional Certification Center - Johannesburg",
    region: "africa",
    regionLabel: "Africa",
    city: "Johannesburg",
    country: "South Africa",
    address: "83 Rivonia Road, Sandton, Johannesburg 2196",
    phone: "+27 11 784 9200",
    email: "sandton@pearsonvue.com",
    hours: "Mon - Sat: 8:00 AM - 5:00 PM SAST",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["Premier Testing Amenities", "Fingerprint / Palm Scan", "Secure Parking"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Center",
    notes: "Adjacent to Gautrain Sandton Station."
  },
  {
    id: "ATC-AF-04",
    name: "Cairo Digital Testing Pavilion - Smart Village",
    region: "africa",
    regionLabel: "Africa",
    city: "Cairo",
    country: "Egypt",
    address: "Building B12, Smart Village, KM 28 Cairo-Alexandria Road, Giza, Cairo",
    phone: "+20 2 3535 2000",
    email: "cairo.smartvillage@pearsonvue.com",
    hours: "Sun - Thu: 9:00 AM - 5:00 PM EET",
    examsOffered: ["LPIC-1", "LPIC-2", "CompTIA Linux+", "LFCS"],
    facilities: ["Tech Park Security", "Fiber Network", "Certified Exam Proctors"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Testing Provider",
    notes: "Main IT hub in Egypt. Arabic and English candidate support."
  },

  // =========================================================================
  // ASIA-PACIFIC
  // =========================================================================
  {
    id: "ATC-AP-01",
    name: "Pearson Professional Center - Tokyo (Shinjuku)",
    region: "asia-pacific",
    regionLabel: "Asia-Pacific",
    city: "Tokyo",
    country: "Japan",
    address: "1-26-2 Nishi-Shinjuku, Shinjuku Nomura Building 8F, Tokyo 163-0508",
    phone: "+81 3 6634 6000",
    email: "tokyo.shinjuku@pearsonvue.com",
    hours: "Mon - Sun: 8:30 AM - 6:00 PM JST",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "LPI DevOps"],
    facilities: ["Advanced Quiet Environment", "Bilingual Japanese & English Interface", "Fast Check-In"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Premier Test Center",
    notes: "Direct underground access from Shinjuku Station (West Exit)."
  },
  {
    id: "ATC-AP-02",
    name: "Singapore Tech Examination Hub - Marina Bay",
    region: "asia-pacific",
    regionLabel: "Asia-Pacific",
    city: "Singapore",
    country: "Singapore",
    address: "10 Collyer Quay, #14-01 Ocean Financial Centre, Singapore 049315",
    phone: "+65 6225 7800",
    email: "singapore.ocean@pearsonvue.com",
    hours: "Mon - Sat: 8:30 AM - 5:30 PM SGT",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["Tier-4 Datacenter Redundancy", "Ergonomic Seating", "Secure lockers"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Premier Testing Center",
    notes: "Direct connection to Raffles Place MRT station."
  },
  {
    id: "ATC-AP-03",
    name: "Bengaluru Technology Exam Center - Electronic City",
    region: "asia-pacific",
    regionLabel: "Asia-Pacific",
    city: "Bengaluru (Bangalore)",
    country: "India",
    address: "Keonics Complex, Phase 1, Hosur Road, Electronic City, Bengaluru 560100",
    phone: "+91 80 4110 5200",
    email: "bangalore.keonics@pearsonvue.com",
    hours: "Mon - Sat: 8:00 AM - 6:00 PM IST",
    examsOffered: ["LPIC-1", "LPIC-2", "LPIC-3", "CompTIA Linux+", "LFCS", "RHCSA"],
    facilities: ["Large 40-Seat Testing Capacity", "Power Backup UPS & Generators", "Biometric Validation"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Testing Center",
    notes: "Leading IT testing destination for India."
  },
  {
    id: "ATC-AP-04",
    name: "Sydney Central Professional Examination Center",
    region: "asia-pacific",
    regionLabel: "Asia-Pacific",
    city: "Sydney, NSW",
    country: "Australia",
    address: "Level 14, 309 Kent Street, Sydney, NSW 2000",
    phone: "+61 2 9299 8222",
    email: "sydney.kent@pearsonvue.com",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM AEST",
    examsOffered: ["LPIC-1", "LPIC-2", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["Soundproof Testing Rooms", "Panoramic Views", "Individual Lockers"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Premier Test Center",
    notes: "Close to Wynyard Station."
  },

  // =========================================================================
  // LATIN AMERICA
  // =========================================================================
  {
    id: "ATC-LA-01",
    name: "Centro de Certificação Tecnológica - São Paulo (Paulista)",
    region: "latin-america",
    regionLabel: "Latin America",
    city: "São Paulo",
    country: "Brazil",
    address: "Avenida Paulista, 1776, 12º Andar, Bela Vista, São Paulo, SP 01310-200",
    phone: "+55 11 3170 8000",
    email: "saopaulo.paulista@pearsonvue.com",
    hours: "Mon - Sat: 8:00 AM - 5:30 PM BRT",
    examsOffered: ["LPIC-1 (101-500 & 102-500)", "LPIC-2", "CompTIA Linux+", "LFCS"],
    facilities: ["High Performance PCs", "Portuguese & English Invigilation", "Complete Accessibility"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Center",
    notes: "Heart of Avenida Paulista financial sector. Metro Consolação."
  },
  {
    id: "ATC-LA-02",
    name: "Centro de Exámenes y Certificación - Ciudad de México (Reforma)",
    region: "latin-america",
    regionLabel: "Latin America",
    city: "Mexico City",
    country: "Mexico",
    address: "Paseo de la Reforma 222, Piso 18, Cuauhtémoc, 06600 Ciudad de México",
    phone: "+52 55 5242 8000",
    email: "cdmx.reforma@pearsonvue.com",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM CST",
    examsOffered: ["LPIC-1", "LPIC-2", "CompTIA Linux+", "Red Hat RHCSA"],
    facilities: ["Executive Tower Security", "Quiet Rooms", "Spanish & English Testing"],
    bookingUrl: "https://home.pearsonvue.com/lpi",
    partnerStatus: "Pearson VUE Authorized Testing Center",
    notes: "Located inside Reforma 222 financial plaza."
  }
];

// =========================================================================
// CERTIFICATION EXAM QUESTIONS BANK
// =========================================================================
const CERTIFICATION_EXAMS = {
  "lpic1-101": {
    id: "lpic1-101",
    title: "LPIC-1 Exam 101-500: System Architecture & GNU/Unix Commands",
    durationMinutes: 90,
    passingScore: 500, // out of 800 (scaled ~ 65%)
    maxScore: 800,
    totalQuestions: 15,
    domains: [
      { name: "System Architecture", weight: 25 },
      { name: "Linux Installation & Package Management", weight: 25 },
      { name: "GNU & Unix Commands", weight: 30 },
      { name: "Devices, Linux Filesystems & FHS", weight: 20 }
    ],
    questions: [
      {
        id: "101-q1",
        domain: "System Architecture",
        type: "single",
        question: "Which BIOS/UEFI directory on modern UEFI systems contains EFI boot loader files in the standard EFI System Partition (ESP)?",
        options: [
          "/boot/grub/efi",
          "/boot/efi/EFI",
          "/etc/efi/system",
          "/usr/lib/efi"
        ],
        correct: 1,
        explanation: "The EFI System Partition is typically mounted at /boot/efi, and UEFI boot loader binaries (.efi) reside inside /boot/efi/EFI/<distro>/"
      },
      {
        id: "101-q2",
        domain: "GNU & Unix Commands",
        type: "command",
        question: "Performance Command: You need to search recursively for all files ending with '.log' inside the '/var' directory. What exact 'find' command performs this task?",
        placeholder: "e.g. find /var -name '*.log'",
        acceptableAnswers: [
          "find /var -name '*.log'",
          "find /var -name *.log",
          "find /var -type f -name '*.log'",
          "find /var -name \"*.log\""
        ],
        explanation: "'find /var -name \"*.log\"' will search recursively through /var and match all files ending in .log."
      },
      {
        id: "101-q3",
        domain: "Linux Installation & Package Management",
        type: "single",
        question: "Which Debian command displays the list of all files installed on the system by the package named 'apache2'?",
        options: [
          "dpkg -s apache2",
          "dpkg -L apache2",
          "apt-cache contents apache2",
          "dpkg -S apache2"
        ],
        correct: 1,
        explanation: "'dpkg -L <package>' lists all files installed by that package. 'dpkg -S <file>' searches which package owns a specific file."
      },
      {
        id: "101-q4",
        domain: "Devices, Linux Filesystems & FHS",
        type: "single",
        question: "In the Linux Filesystem Hierarchy Standard (FHS), what is the designated purpose of the '/srv' directory?",
        options: [
          "Stores system crash dumps and server core logs",
          "Contains site-specific data served by system services (e.g. web, ftp data)",
          "Holds secondary shared software repositories for desktop users",
          "Provides temporary run-time files for non-root users"
        ],
        correct: 1,
        explanation: "According to FHS 3.0, '/srv' contains site-specific data served by services such as web servers (www) or FTP repositories."
      },
      {
        id: "101-q5",
        domain: "System Architecture",
        type: "single",
        question: "What is the process ID (PID) of the first user-space process started by the Linux kernel upon system boot (such as systemd or init)?",
        options: [
          "0",
          "1",
          "100",
          "The next random available integer"
        ],
        correct: 1,
        explanation: "The initial user-space process (traditionally /sbin/init, now systemd) is always assigned PID 1. The idle kernel thread is PID 0."
      },
      {
        id: "101-q6",
        domain: "GNU & Unix Commands",
        type: "single",
        question: "Which signal number is sent by default when the 'kill <PID>' command is run without specifying any signal flag?",
        options: [
          "SIGKILL (9)",
          "SIGTERM (15)",
          "SIGHUP (1)",
          "SIGINT (2)"
        ],
        correct: 1,
        explanation: "'kill' defaults to SIGTERM (signal 15), politely requesting the process to terminate gracefully. SIGKILL (9) is forceful."
      },
      {
        id: "101-q7",
        domain: "Devices, Linux Filesystems & FHS",
        type: "command",
        question: "Performance Command: Which command displays disk space usage for all mounted filesystems in human-readable format (e.g. GB, MB) along with filesystem types?",
        placeholder: "e.g. df -hT",
        acceptableAnswers: [
          "df -hT",
          "df -Th",
          "df -h -T",
          "df -T -h"
        ],
        explanation: "'df -hT' prints disk space in human-readable units (-h) and shows the filesystem type (-T) such as ext4, xfs, or btrfs."
      },
      {
        id: "101-q8",
        domain: "Linux Installation & Package Management",
        type: "single",
        question: "Which RPM command query flag allows you to verify which RPM package installed a specific executable, such as '/usr/bin/passwd'?",
        options: [
          "rpm -qi /usr/bin/passwd",
          "rpm -qf /usr/bin/passwd",
          "rpm -ql /usr/bin/passwd",
          "rpm -qp /usr/bin/passwd"
        ],
        correct: 1,
        explanation: "'rpm -qf <path>' queries the package owning the specified file (-qf = query file)."
      },
      {
        id: "101-q9",
        domain: "GNU & Unix Commands",
        type: "multi",
        question: "Which of the following commands can be used to view the real-time dynamic list of running processes sorted by resource consumption? (Choose TWO)",
        options: [
          "top",
          "uptime",
          "htop",
          "ps -ef",
          "free -m"
        ],
        correct: [0, 2],
        explanation: "Both 'top' and 'htop' provide dynamic, continuously updating interactive interfaces for monitoring running processes."
      },
      {
        id: "101-q10",
        domain: "Devices, Linux Filesystems & FHS",
        type: "single",
        question: "What is the purpose of the 'umask' utility in a Linux shell environment?",
        options: [
          "It changes the kernel scheduler priority for background jobs",
          "It masks out default permission bits when newly created files and directories are created",
          "It hides hidden files starting with a dot from the ls command",
          "It filters network packets arriving on unmasked TCP ports"
        ],
        correct: 1,
        explanation: "The 'umask' determines the default permissions for newly created files and directories by masking (subtracting) specified permission bits."
      },
      {
        id: "101-q11",
        domain: "System Architecture",
        type: "command",
        question: "Performance Command: Which kernel buffer inspection command is used to read low-level boot messages and hardware driver initialization logs?",
        placeholder: "e.g. dmesg",
        acceptableAnswers: [
          "dmesg",
          "dmesg -T",
          "dmesg | less"
        ],
        explanation: "'dmesg' (driver message) prints the kernel ring buffer, displaying hardware detections and initialization messages."
      },
      {
        id: "101-q12",
        domain: "GNU & Unix Commands",
        type: "single",
        question: "Which stream redirection operator redirects both Standard Output (stdout) and Standard Error (stderr) into a file called 'output.txt' in modern Bash?",
        options: [
          "&> output.txt",
          "2>&1 < output.txt",
          ">> output.txt | 2>",
          "1>&2 output.txt"
        ],
        correct: 0,
        explanation: "In modern Bash, '&> output.txt' (or '> output.txt 2>&1') redirects both file descriptors 1 (stdout) and 2 (stderr) to the target file."
      },
      {
        id: "101-q13",
        domain: "Linux Installation & Package Management",
        type: "single",
        question: "Which command updates the local package repository metadata cache on an Ubuntu/Debian system without installing any software upgrades?",
        options: [
          "apt upgrade",
          "apt update",
          "apt dist-upgrade",
          "dpkg --reconfigure"
        ],
        correct: 1,
        explanation: "'apt update' synchronizes repository package index files from the sources listed in /etc/apt/sources.list."
      },
      {
        id: "101-q14",
        domain: "System Architecture",
        type: "single",
        question: "Which command is used to unload a kernel module along with any dependent modules that are no longer in use?",
        options: [
          "lsmod -r <module>",
          "modprobe -r <module>",
          "rmmod -f <module>",
          "insmod -d <module>"
        ],
        correct: 1,
        explanation: "'modprobe -r' removes the specified module and safely removes unused dependencies. 'rmmod' only removes a single module."
      },
      {
        id: "101-q15",
        domain: "Devices, Linux Filesystems & FHS",
        type: "command",
        question: "Performance Command: What exact chmod octal command sets permissions on 'id_rsa' so that ONLY the owner has read and write permissions (no permissions for group or others)?",
        placeholder: "e.g. chmod 600 id_rsa",
        acceptableAnswers: [
          "chmod 600 id_rsa",
          "chmod 0600 id_rsa"
        ],
        explanation: "'chmod 600 id_rsa' grants 4 (read) + 2 (write) = 6 for the owner, and 0 for group and others. This is mandatory for private SSH keys."
      }
    ]
  },

  "lpic1-102": {
    id: "lpic1-102",
    title: "LPIC-1 Exam 102-500: Shells, Scripting, Interfaces, Admin & Security",
    durationMinutes: 90,
    passingScore: 500,
    maxScore: 800,
    totalQuestions: 12,
    domains: [
      { name: "Shells, Scripting & Data Management", weight: 25 },
      { name: "User Interfaces & Desktops", weight: 15 },
      { name: "Administrative Tasks", weight: 25 },
      { name: "Essential System Services & Networking", weight: 20 },
      { name: "Security & Host Hardening", weight: 15 }
    ],
    questions: [
      {
        id: "102-q1",
        domain: "Shells, Scripting & Data Management",
        type: "single",
        question: "In a Bash shell script, which special variable contains the exit status (return code) of the most recently executed foreground pipeline/command?",
        options: [
          "$0",
          "$?",
          "$$",
          "$#"
        ],
        correct: 1,
        explanation: "'$?' stores the exit status of the last executed command. 0 indicates success, while non-zero represents an error code."
      },
      {
        id: "102-q2",
        domain: "Administrative Tasks",
        type: "command",
        question: "Performance Command: What useradd command creates a new user account named 'alex' with a home directory created automatically and '/bin/bash' as the login shell?",
        placeholder: "e.g. useradd -m -s /bin/bash alex",
        acceptableAnswers: [
          "useradd -m -s /bin/bash alex",
          "useradd -s /bin/bash -m alex",
          "useradd -m -s /bin/bash alex"
        ],
        explanation: "'useradd -m -s /bin/bash alex' creates user alex, generates the home directory (/home/alex), and specifies /bin/bash as shell."
      },
      {
        id: "102-q3",
        domain: "Security & Host Hardening",
        type: "single",
        question: "Which file on a Linux host defines limits on system resources (such as max open files, max processes, and memory) for users and groups?",
        options: [
          "/etc/security/limits.conf",
          "/etc/pam.d/resource.conf",
          "/etc/sysctl.d/limits.conf",
          "/etc/default/ulimit"
        ],
        correct: 0,
        explanation: "/etc/security/limits.conf configures PAM resource limits (nofile, nproc, memlock) per user or per group."
      },
      {
        id: "102-q4",
        domain: "Essential System Services & Networking",
        type: "single",
        question: "Which modern network diagnostic utility replaces legacy 'netstat' for displaying active listening TCP and UDP sockets along with their process names?",
        options: [
          "ss -tulpn",
          "ip route show",
          "traceroute -n",
          "ping -s"
        ],
        correct: 0,
        explanation: "'ss -tulpn' (TCP, UDP, listening, process, numeric) is the modern, fast replacement for netstat."
      },
      {
        id: "102-q5",
        domain: "Administrative Tasks",
        type: "single",
        question: "A cron schedule expression is set to '15 3 * * 1'. When does this cron job execute?",
        options: [
          "Every 15 minutes on March 1st",
          "At 03:15 AM every Monday",
          "At 15:03 every day of the month",
          "Every 3 hours on the 15th of the month"
        ],
        correct: 1,
        explanation: "Format is: minute (15), hour (3 = 03:00 AM), day-of-month (*), month (*), day-of-week (1 = Monday)."
      },
      {
        id: "102-q6",
        domain: "Security & Host Hardening",
        type: "single",
        question: "Which file in the user's home directory stores the public SSH keys of remote clients authorized to log into this account without a password?",
        options: [
          "~/.ssh/known_hosts",
          "~/.ssh/authorized_keys",
          "~/.ssh/id_rsa.pub",
          "~/.ssh/config"
        ],
        correct: 1,
        explanation: "~/.ssh/authorized_keys stores the public keys of clients permitted to connect via public-key authentication."
      },
      {
        id: "102-q7",
        domain: "Essential System Services & Networking",
        type: "command",
        question: "Performance Command: Which systemctl command enables the 'nginx' service to automatically start on system boot AND immediately starts it right now in a single command?",
        placeholder: "e.g. systemctl enable --now nginx",
        acceptableAnswers: [
          "systemctl enable --now nginx",
          "systemctl enable nginx --now",
          "sudo systemctl enable --now nginx"
        ],
        explanation: "'systemctl enable --now <service>' both enables the symlink for boot and starts the service immediately."
      },
      {
        id: "102-q8",
        domain: "Shells, Scripting & Data Management",
        type: "single",
        question: "What is the standard first line ('shebang') placed at the very beginning of an executable Bash script?",
        options: [
          "#!/bin/bash",
          "// bash",
          "#$ shell=bash",
          "<!bash>"
        ],
        correct: 0,
        explanation: "'#!/bin/bash' directs the operating system kernel loader (execve) to interpret the script using the bash binary."
      },
      {
        id: "102-q9",
        domain: "User Interfaces & Desktops",
        type: "single",
        question: "Which modern display server protocol is designed as the direct, safer and cleaner successor to the legacy X Window System (X11) in modern Linux distributions?",
        options: [
          "Wayland",
          "Mirage",
          "OpenGL ES",
          "XDMCP"
        ],
        correct: 0,
        explanation: "Wayland is the modern display server protocol replacing X11, providing better isolation and performance."
      },
      {
        id: "102-q10",
        domain: "Essential System Services & Networking",
        type: "single",
        question: "Which configuration file specifies the DNS nameserver IP addresses that the local Linux resolver uses for domain name lookups?",
        options: [
          "/etc/hosts",
          "/etc/resolv.conf",
          "/etc/nsswitch.conf",
          "/etc/networks"
        ],
        correct: 1,
        explanation: "/etc/resolv.conf lists 'nameserver <IP>' entries used by the glibc resolver to perform DNS resolution."
      },
      {
        id: "102-q11",
        domain: "Administrative Tasks",
        type: "command",
        question: "Performance Command: What command safely edits the sudoers configuration file while performing syntax validation to prevent locking out administrative access?",
        placeholder: "e.g. visudo",
        acceptableAnswers: [
          "visudo",
          "sudo visudo"
        ],
        explanation: "'visudo' locks the /etc/sudoers file against concurrent edits and checks syntax before committing changes."
      },
      {
        id: "102-q12",
        domain: "Security & Host Hardening",
        type: "single",
        question: "Which command shows the current operational mode of SELinux (Enforcing, Permissive, or Disabled)?",
        options: [
          "getenforce",
          "setenforce",
          "sestatus -v",
          "ls -Z"
        ],
        correct: 0,
        explanation: "'getenforce' prints Enforcing, Permissive, or Disabled. 'sestatus' prints detailed status."
      }
    ]
  }
};
