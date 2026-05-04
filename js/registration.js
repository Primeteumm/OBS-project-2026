// Mutable enrolled list (starts as copy of ENROLLED_COURSES)
let enrolled = ENROLLED_COURSES.map(c => ({ ...c, schedule: c.schedule.map(s => ({ ...s })) }));
let searchQuery = "";

function renderEnrolled() {
  const el = document.getElementById("enrolled-panel");
  if (!el) return;
  if (enrolled.length === 0) {
    el.innerHTML = `<div style="padding:24px; text-align:center; color:var(--gray-400);">Kayıtlı ders yok.</div>`;
    return;
  }
  el.innerHTML = enrolled.map(c => `
    <div class="course-item">
      <div class="course-item-info">
        <div class="course-item-code">${c.code}(${c.section})</div>
        <div class="course-item-name">${c.name}</div>
        <div class="course-item-meta">${c.instructor} · ${c.credits} kr</div>
        <div class="course-item-meta">${formatSchedule(c.schedule)}</div>
      </div>
      <div class="course-item-action">
        <button class="btn btn-danger btn-sm" onclick="dropCourse('${c.code}')">Bırak</button>
      </div>
    </div>
  `).join("");
  document.getElementById("enrolled-count").textContent = enrolled.length;
  document.getElementById("enrolled-credits").textContent = enrolled.reduce((s,c)=>s+c.credits,0);
}

function renderAvailable() {
  const el = document.getElementById("available-panel");
  if (!el) return;
  const q = searchQuery.toLowerCase();
  const filtered = AVAILABLE_COURSES.filter(c =>
    (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) &&
    !enrolled.find(e => e.code === c.code && e.section === c.section)
  );
  if (filtered.length === 0) {
    el.innerHTML = `<div style="padding:24px; text-align:center; color:var(--gray-400);">${q ? "Sonuç bulunamadı." : "Eklenebilecek ders yok."}</div>`;
    return;
  }
  el.innerHTML = filtered.map(c => {
    const full   = c.enrolled >= c.quota;
    const inList = enrolled.find(e => e.code === c.code);
    const conflict = checkScheduleConflict(c.schedule, enrolled);
    const disabled = full || !!inList || !!conflict;
    let btnLabel = "Ekle";
    if (inList)   btnLabel = "Kayıtlı";
    if (full)     btnLabel = "Kontenjan Dolu";
    if (conflict) btnLabel = "Çakışma";
    return `
      <div class="course-item">
        <div class="course-item-info">
          <div class="course-item-code">${c.code}(${c.section})</div>
          <div class="course-item-name">${c.name}</div>
          <div class="course-item-meta">${c.instructor} · ${c.credits} kr</div>
          <div class="course-item-meta">${formatSchedule(c.schedule)} · Kontenjan: ${c.enrolled}/${c.quota}</div>
          ${conflict ? `<div class="text-sm" style="color:var(--red);margin-top:3px;">⚠ ${conflict.code} ile çakışıyor</div>` : ""}
        </div>
        <div class="course-item-action">
          <button class="btn btn-success btn-sm" onclick="addCourse('${c.code}', ${c.section})" ${disabled ? "disabled" : ""}>${btnLabel}</button>
        </div>
      </div>
    `;
  }).join("");
}

function addCourse(code, section) {
  const course = AVAILABLE_COURSES.find(c => c.code === code && c.section === section);
  if (!course) return;
  const conflict = checkScheduleConflict(course.schedule, enrolled);
  if (conflict) {
    showToast(`${course.code} dersi ${conflict.code} ile çakışıyor!`, "error");
    return;
  }
  if (enrolled.find(c => c.code === code)) {
    showToast("Bu ders zaten kayıtlı.", "warning");
    return;
  }
  enrolled.push({ ...course, schedule: course.schedule.map(s => ({ ...s })) });
  showToast(`${course.code} eklendi.`, "success");
  renderEnrolled();
  renderAvailable();
}

function dropCourse(code) {
  const idx = enrolled.findIndex(c => c.code === code);
  if (idx === -1) return;
  const name = enrolled[idx].code;
  enrolled.splice(idx, 1);
  showToast(`${name} bırakıldı.`, "default");
  renderEnrolled();
  renderAvailable();
}

function formatSchedule(schedule) {
  return schedule.map(s =>
    `${DAY_NAMES[s.day]} ${padTime(s.startHour, s.startMin)}–${padTime(s.endHour, s.endMin)} ${s.room}`
  ).join(", ");
}
