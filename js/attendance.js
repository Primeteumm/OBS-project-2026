function buildAttendance(data) {
  const tbody = document.getElementById("att-tbody");
  if (!tbody) return;

  tbody.innerHTML = data.map((a, i) => {
    const pct     = ((a.totalHours - a.absentHours) / a.totalHours * 100).toFixed(1);
    const absPct  = (a.absentHours / a.totalHours * 100).toFixed(1);
    const danger  = parseFloat(absPct) >= 30;
    const warning = parseFloat(absPct) >= 20 && !danger;
    const fillClass = danger ? "fill-red" : warning ? "fill-yellow" : "fill-green";
    const rowClass  = danger ? "row-danger" : warning ? "row-warning" : "";
    const statusBadge = danger
      ? `<span class="badge badge-red">⚠ Riskli</span>`
      : warning
      ? `<span class="badge badge-yellow">Dikkat</span>`
      : `<span class="badge badge-green">Normal</span>`;

    return `
      <tr class="${rowClass}">
        <td>
          <strong>${a.code}</strong><br>
          <span class="text-muted text-sm">${a.name}</span>
        </td>
        <td style="text-align:center;">${a.totalHours}</td>
        <td style="text-align:center; color:var(--red); font-weight:600;">${a.absentHours}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="progress-bar" style="flex:1;">
              <div class="progress-fill ${fillClass}" style="width:${pct}%;"></div>
            </div>
            <span style="font-size:12px; font-weight:600; min-width:38px;">%${pct}</span>
          </div>
        </td>
        <td>${statusBadge}</td>
        <td>
          <button class="expand-btn" onclick="toggleDetail(${i})">Detay</button>
        </td>
      </tr>
      <tr class="detail-row" id="detail-${i}">
        <td colspan="6">
          <div class="attendance-detail">
            ${a.details.map(d => `
              <span class="att-chip ${d.status}">
                ${d.status === "present" ? "✓" : d.status === "absent" ? "✗" : "~"}
                ${formatDate(d.date)}
              </span>
            `).join("")}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function toggleDetail(i) {
  const row = document.getElementById(`detail-${i}`);
  row.classList.toggle("open");
  const btn = row.previousElementSibling.querySelector(".expand-btn");
  btn.textContent = row.classList.contains("open") ? "Gizle" : "Detay";
}
