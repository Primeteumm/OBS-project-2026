function buildSchedule(courses) {
  const HOURS = [];
  for (let h = 8; h <= 20; h++) HOURS.push(h);

  const grid = document.getElementById("schedule-grid");
  if (!grid) return;

  // Header row
  let html = `
    <div class="schedule-header" style="background:var(--gray-100);"></div>
    ${DAY_NAMES.map(d => `<div class="schedule-header">${d}</div>`).join("")}
  `;

  // Build a lookup: day -> hour -> course block
  const blocks = {}; // key: `${day}-${hour}` -> { course, slot }
  for (const course of courses) {
    for (const slot of course.schedule) {
      const key = `${slot.day}-${slot.startHour}`;
      blocks[key] = { course, slot };
    }
  }

  for (const hour of HOURS) {
    html += `<div class="schedule-time">${padTime(hour, 0)}</div>`;
    for (let day = 0; day < 5; day++) {
      const key = `${day}-${hour}`;
      if (blocks[key]) {
        const { course, slot } = blocks[key];
        html += `
          <div class="schedule-cell">
            <div class="schedule-block" style="background:${course.color};" title="${course.name} — ${slot.room}">
              <strong>${course.code}</strong>
              <span>${slot.room}</span>
            </div>
          </div>
        `;
      } else {
        html += `<div class="schedule-cell"></div>`;
      }
    }
  }

  grid.innerHTML = html;
}
