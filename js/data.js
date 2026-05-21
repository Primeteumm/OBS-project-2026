// Şifreler SHA-256 ile hash'lenmiş olarak saklanır (bkz. auth.js -> hashPassword)
// Demo şifre: "password123" -> ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
const MOCK_USERS = [
  { id: "250206022", passwordHash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", name: "BİLAL AKSOY" }
];

const STUDENT = {
  id: "250206022",
  name: "BİLAL AKSOY",
  term: "2025-2026 Bahar",
  department: "Bilgisayar Mühendisliği",
  faculty: "Mühendislik Fakültesi",
  year: 2
};

const TERMS = ["2025-2026 Bahar", "2025-2026 Güz", "2024-2025 Bahar"];

// schedule: [{ day: 0-4 (Mon-Fri), startHour, startMin, endHour, endMin, room }]
const ENROLLED_COURSES = [
  {
    code: "COMP202",
    section: 1,
    name: "Software Engineering",
    credits: 3,
    instructor: "Dr.Öğretim Üyesi Mehmet Gökhan Bakal",
    color: "#3B82F6",
    schedule: [
      { day: 0, startHour: 12, startMin: 0, endHour: 12, endMin: 45, room: "B230[65]" },
      { day: 0, startHour: 13, startMin: 0, endHour: 13, endMin: 45, room: "B230[65]" },
      { day: 2, startHour: 15, startMin: 0, endHour: 15, endMin: 45, room: "B230[65]" }
    ]
  },
  {
    code: "COMP204",
    section: 1,
    name: "Database Management Systems",
    credits: 3,
    instructor: "Dr.Öğretim Üyesi Mehmet Gökhan Bakal",
    color: "#10B981",
    schedule: [
      { day: 1, startHour: 13, startMin: 0, endHour: 13, endMin: 45, room: "B230[65]" },
      { day: 1, startHour: 14, startMin: 0, endHour: 14, endMin: 45, room: "B230[65]" },
      { day: 3, startHour: 15, startMin: 0, endHour: 15, endMin: 45, room: "COMPLAB[48]" }
    ]
  },
  {
    code: "COMP206",
    section: 1,
    name: "Mathematical Modelling and Algorithmic Thinking",
    credits: 3,
    instructor: "Öğr.Gör.Dr. Cavidan Yakupoğlu Karaağaç",
    color: "#8B5CF6",
    schedule: [
      { day: 1, startHour: 10, startMin: 0, endHour: 10, endMin: 45, room: "B230[65]" },
      { day: 1, startHour: 11, startMin: 0, endHour: 11, endMin: 45, room: "B230[65]" },
      { day: 2, startHour: 10, startMin: 0, endHour: 10, endMin: 45, room: "B230[65]" },
      { day: 2, startHour: 13, startMin: 0, endHour: 13, endMin: 45, room: "COMPLAB[48]" },
      { day: 2, startHour: 14, startMin: 0, endHour: 14, endMin: 45, room: "COMPLAB[48]" }
    ]
  },
  {
    code: "MATH206",
    section: 1,
    name: "Discrete Mathematics",
    credits: 3,
    instructor: "Doç.Dr. Zübeyir Çinkır",
    color: "#F59E0B",
    schedule: [
      { day: 0, startHour: 10, startMin: 0, endHour: 10, endMin: 45, room: "AMFİ[120]" },
      { day: 0, startHour: 11, startMin: 0, endHour: 11, endMin: 45, room: "AMFİ[120]" },
      { day: 2, startHour: 11, startMin: 0, endHour: 11, endMin: 45, room: "AMFİ[120]" },
      { day: 2, startHour: 12, startMin: 0, endHour: 12, endMin: 45, room: "AMFİ[120]" }
    ]
  },
  {
    code: "TURK102",
    section: 1,
    name: "Turkish II",
    credits: 2,
    instructor: "Doç.Dr. Ahmet Kayasandık",
    color: "#EF4444",
    schedule: [
      { day: 0, startHour: 9, startMin: 0, endHour: 9, endMin: 45, room: "RKON[200]" },
      { day: 1, startHour: 19, startMin: 0, endHour: 19, endMin: 45, room: "A/S15[200]" },
      { day: 3, startHour: 19, startMin: 0, endHour: 19, endMin: 45, room: "A/S15[200]" }
    ]
  }
];

const GRADES = [
  {
    code: "COMP202", name: "Software Engineering", credits: 3,
    midterm: null, final: null, average: null, letter: null, status: "pending"
  },
  {
    code: "COMP204", name: "Database Management Systems", credits: 3,
    midterm: null, final: null, average: null, letter: null, status: "pending"
  },
  {
    code: "COMP206", name: "Mathematical Modelling and Algorithmic Thinking", credits: 3,
    midterm: null, final: null, average: null, letter: null, status: "pending"
  },
  {
    code: "MATH206", name: "Discrete Mathematics", credits: 3,
    midterm: 75, final: 82, average: 79.2, letter: "BA", status: "completed"
  },
  {
    code: "TURK102", name: "Turkish II", credits: 2,
    midterm: 88, final: 91, average: 89.8, letter: "AA", status: "completed"
  }
];

// attendance details: array of { date, status: "present"|"absent"|"late" }
const ATTENDANCE = [
  {
    code: "COMP202", name: "Software Engineering",
    totalHours: 42, absentHours: 4,
    details: [
      { date: "2026-02-10", status: "present" }, { date: "2026-02-17", status: "present" },
      { date: "2026-02-24", status: "absent" },  { date: "2026-03-03", status: "present" },
      { date: "2026-03-10", status: "present" }, { date: "2026-03-17", status: "absent" },
      { date: "2026-03-24", status: "present" }, { date: "2026-03-31", status: "present" },
      { date: "2026-04-07", status: "present" }, { date: "2026-04-14", status: "late" },
      { date: "2026-04-21", status: "present" }, { date: "2026-04-28", status: "present" },
      { date: "2026-05-05", status: "absent" },  { date: "2026-05-12", status: "present" }
    ]
  },
  {
    code: "COMP204", name: "Database Management Systems",
    totalHours: 42, absentHours: 2,
    details: [
      { date: "2026-02-10", status: "present" }, { date: "2026-02-17", status: "present" },
      { date: "2026-02-24", status: "present" }, { date: "2026-03-03", status: "absent" },
      { date: "2026-03-10", status: "present" }, { date: "2026-03-17", status: "present" },
      { date: "2026-03-24", status: "present" }, { date: "2026-03-31", status: "present" },
      { date: "2026-04-07", status: "present" }, { date: "2026-04-14", status: "present" },
      { date: "2026-04-21", status: "present" }, { date: "2026-04-28", status: "absent" },
      { date: "2026-05-05", status: "present" }, { date: "2026-05-12", status: "present" }
    ]
  },
  {
    code: "COMP206", name: "Mathematical Modelling and Algorithmic Thinking",
    totalHours: 70, absentHours: 22,
    details: [
      { date: "2026-02-10", status: "absent" },  { date: "2026-02-17", status: "absent" },
      { date: "2026-02-24", status: "absent" },  { date: "2026-03-03", status: "present" },
      { date: "2026-03-10", status: "present" }, { date: "2026-03-17", status: "absent" },
      { date: "2026-03-24", status: "absent" },  { date: "2026-03-31", status: "present" },
      { date: "2026-04-07", status: "absent" },  { date: "2026-04-14", status: "present" },
      { date: "2026-04-21", status: "absent" },  { date: "2026-04-28", status: "absent" },
      { date: "2026-05-05", status: "present" }, { date: "2026-05-12", status: "present" }
    ]
  },
  {
    code: "MATH206", name: "Discrete Mathematics",
    totalHours: 56, absentHours: 8,
    details: [
      { date: "2026-02-10", status: "present" }, { date: "2026-02-17", status: "absent" },
      { date: "2026-02-24", status: "present" }, { date: "2026-03-03", status: "present" },
      { date: "2026-03-10", status: "absent" },  { date: "2026-03-17", status: "present" },
      { date: "2026-03-24", status: "present" }, { date: "2026-03-31", status: "absent" },
      { date: "2026-04-07", status: "present" }, { date: "2026-04-14", status: "absent" },
      { date: "2026-04-21", status: "present" }, { date: "2026-04-28", status: "present" },
      { date: "2026-05-05", status: "present" }, { date: "2026-05-12", status: "present" }
    ]
  },
  {
    code: "TURK102", name: "Turkish II",
    totalHours: 28, absentHours: 2,
    details: [
      { date: "2026-02-10", status: "present" }, { date: "2026-02-17", status: "present" },
      { date: "2026-02-24", status: "absent" },  { date: "2026-03-03", status: "present" },
      { date: "2026-03-10", status: "present" }, { date: "2026-03-17", status: "present" },
      { date: "2026-03-24", status: "present" }, { date: "2026-03-31", status: "absent" },
      { date: "2026-04-07", status: "present" }, { date: "2026-04-14", status: "present" },
      { date: "2026-04-21", status: "present" }, { date: "2026-04-28", status: "present" },
      { date: "2026-05-05", status: "present" }, { date: "2026-05-12", status: "present" }
    ]
  }
];

const AVAILABLE_COURSES = [
  {
    code: "COMP208", section: 1, name: "Data Structures and Algorithms", credits: 3,
    instructor: "Prof.Dr. Ali Yılmaz", quota: 40, enrolled: 38,
    schedule: [
      { day: 0, startHour: 14, startMin: 0, endHour: 14, endMin: 45, room: "B230[65]" },
      { day: 2, startHour: 16, startMin: 0, endHour: 16, endMin: 45, room: "B230[65]" }
    ]
  },
  {
    code: "ENG102", section: 1, name: "English II", credits: 2,
    instructor: "Öğr.Gör. Sarah Johnson", quota: 30, enrolled: 25,
    schedule: [
      { day: 1, startHour: 9, startMin: 0, endHour: 9, endMin: 45, room: "D101[30]" },
      { day: 3, startHour: 9, startMin: 0, endHour: 9, endMin: 45, room: "D101[30]" }
    ]
  },
  {
    code: "PHYS102", section: 1, name: "Physics II", credits: 4,
    instructor: "Doç.Dr. Mehmet Yıldız", quota: 60, enrolled: 55,
    schedule: [
      { day: 0, startHour: 15, startMin: 0, endHour: 15, endMin: 45, room: "AMFİ[120]" },
      { day: 2, startHour: 9, startMin: 0, endHour: 9, endMin: 45, room: "AMFİ[120]" },
      { day: 4, startHour: 10, startMin: 0, endHour: 10, endMin: 45, room: "COMPLAB[48]" }
    ]
  },
  {
    code: "COMP210", section: 1, name: "Object Oriented Programming", credits: 3,
    instructor: "Dr.Öğretim Üyesi Zeynep Kaya", quota: 35, enrolled: 20,
    schedule: [
      { day: 1, startHour: 15, startMin: 0, endHour: 15, endMin: 45, room: "B230[65]" },
      { day: 3, startHour: 11, startMin: 0, endHour: 11, endMin: 45, room: "B230[65]" }
    ]
  },
  {
    code: "STAT201", section: 1, name: "Probability and Statistics", credits: 3,
    instructor: "Prof.Dr. Hasan Demir", quota: 50, enrolled: 44,
    schedule: [
      { day: 4, startHour: 13, startMin: 0, endHour: 13, endMin: 45, room: "AMFİ[120]" },
      { day: 4, startHour: 14, startMin: 0, endHour: 14, endMin: 45, room: "AMFİ[120]" }
    ]
  },
  {
    code: "COMP202", section: 1, name: "Software Engineering", credits: 3,
    instructor: "Dr.Öğretim Üyesi Mehmet Gökhan Bakal", quota: 40, enrolled: 40,
    schedule: [
      { day: 0, startHour: 12, startMin: 0, endHour: 12, endMin: 45, room: "B230[65]" },
      { day: 0, startHour: 13, startMin: 0, endHour: 13, endMin: 45, room: "B230[65]" }
    ]
  }
];
