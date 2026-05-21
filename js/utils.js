function showToast(message, type = "default") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  t.className = `toast${type !== "default" ? " " + type : ""}`;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity .3s";
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function checkScheduleConflict(newSlots, existingCourses) {
  for (const slot of newSlots) {
    for (const course of existingCourses) {
      for (const ex of course.schedule) {
        if (ex.day !== slot.day) continue;
        const newStart = slot.startHour * 60 + slot.startMin;
        const newEnd   = slot.endHour   * 60 + slot.endMin;
        const exStart  = ex.startHour   * 60 + ex.startMin;
        const exEnd    = ex.endHour     * 60 + ex.endMin;
        if (newStart < exEnd && newEnd > exStart) return course;
      }
    }
  }
  return null;
}

const DAY_NAMES = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

function padTime(h, m) {
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

// localStorage kalıcılık yardımcıları
function loadData(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Sayfalar arasında kayıtlı ders listesini paylaşmak için tek nokta:
// registration sayfası listeyi günceller, diğer sayfalar buradan okur.
const ENROLLED_KEY = "obs_enrolled";
function getEnrolled() {
  return loadData(ENROLLED_KEY,
    ENROLLED_COURSES.map(c => ({ ...c, schedule: c.schedule.map(s => ({ ...s })) }))
  );
}

// Harf notu -> GPA puanı (4.0 sistemi)
const LETTER_TO_GPA = {
  AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5,
  CC:  2.0, DC: 1.5, DD: 1.0, FF: 0.0, FD: 0.5
};

// AGNO/GANO hesaplama: Σ(kredi × gpa) / Σ(kredi)
function calculateGPA(grades) {
  const counted = grades.filter(g => g.letter && LETTER_TO_GPA[g.letter] !== undefined);
  if (counted.length === 0) return null;
  const totalPoints  = counted.reduce((s, g) => s + g.credits * LETTER_TO_GPA[g.letter], 0);
  const totalCredits = counted.reduce((s, g) => s + g.credits, 0);
  return totalCredits === 0 ? null : totalPoints / totalCredits;
}
