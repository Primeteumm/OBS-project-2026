function buildGrades(grades) {
  const tbody = document.getElementById("grades-tbody");
  const summaryEl = document.getElementById("grades-summary");
  if (!tbody) return;

  tbody.innerHTML = grades.map(g => {
    let statusBadge, letterCell;

    if (g.status === "withdrawn") {
      statusBadge = `<span class="badge badge-gray">Dersten Çekilme</span>`;
      letterCell  = `<span class="badge badge-yellow">W</span>`;
    } else if (g.status === "pending") {
      statusBadge = `<span class="badge badge-gray" style="color:var(--red);background:var(--red-light);">Sonuçlandırılmadı</span>`;
      letterCell  = `<span style="color:var(--gray-400);">—</span>`;
    } else if (g.letter) {
      const passing = ["AA","BA","BB","CB","CC","DC","DD"].includes(g.letter);
      statusBadge = passing
        ? `<span class="badge badge-green">Başarılı</span>`
        : `<span class="badge badge-red">Başarısız</span>`;
      letterCell = `<strong>${g.letter}</strong>`;
    } else {
      statusBadge = `<span class="badge badge-gray">—</span>`;
      letterCell  = `<span style="color:var(--gray-400);">—</span>`;
    }

    const mid   = g.midterm  != null ? g.midterm  : `<span class="text-muted">—</span>`;
    const fin   = g.final    != null ? g.final    : `<span class="text-muted">—</span>`;
    const avg   = g.average  != null ? g.average.toFixed(1) : `<span class="text-muted">—</span>`;

    return `
      <tr>
        <td><strong>${g.code}</strong></td>
        <td>${g.name}</td>
        <td style="text-align:center;">${mid}</td>
        <td style="text-align:center;">${fin}</td>
        <td style="text-align:center;">${avg}</td>
        <td style="text-align:center;">${letterCell}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join("");

  if (summaryEl) {
    const activeGrades = grades.filter(g => g.status !== "withdrawn" && g.letter && g.letter !== "W");
    const totalCredits = grades.filter(g=>g.status!=="withdrawn").reduce((s,g)=>s+g.credits,0);
    if (activeGrades.length === 0) {
      summaryEl.innerHTML = `<span style="color:var(--gray-400); font-size:13px;">Notlar henüz açıklanmadı.</span>`;
    } else {
      const gpa = calculateGPA(activeGrades);
      const earnedCredits = activeGrades.reduce((s,g)=>s+g.credits,0);
      summaryEl.innerHTML = `<strong>GANO: ${gpa != null ? gpa.toFixed(2) : "—"}</strong> · Tamamlanan: ${earnedCredits} / ${totalCredits} kr`;
    }
  }
}
