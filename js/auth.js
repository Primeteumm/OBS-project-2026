function requireAuth() {
  const session = sessionStorage.getItem("obs_session");
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return JSON.parse(session);
}

function getSession() {
  const session = sessionStorage.getItem("obs_session");
  return session ? JSON.parse(session) : null;
}

function login(studentId, password) {
  const user = MOCK_USERS.find(u => u.id === studentId && u.password === password);
  if (user) {
    sessionStorage.setItem("obs_session", JSON.stringify({ id: user.id, name: user.name }));
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem("obs_session");
  window.location.href = "index.html";
}

function renderNavbar(containerSelector) {
  const session = getSession();
  if (!session) return;
  const el = document.querySelector(containerSelector);
  if (!el) return;
  el.innerHTML = `
    <div class="navbar-brand">
      <button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Menü">
        <span></span><span></span><span></span>
      </button>
      <span class="navbar-title">Öğrenci Bilgi Sistemi</span>
    </div>
    <div class="navbar-right">
      <span class="navbar-term">${STUDENT.term}</span>
      <div class="navbar-user">
        <div class="user-avatar">${session.name.charAt(0)}</div>
        <div class="user-info">
          <span class="user-id">${session.id}</span>
          <span class="user-name">${session.name}</span>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="logout()">Çıkış</button>
    </div>
  `;
}

function renderSidebar(containerSelector, activePage) {
  const el = document.querySelector(containerSelector);
  if (!el) return;
  const links = [
    { href: "dashboard.html", icon: "⊞", label: "Ana Sayfa", key: "dashboard" },
    { href: "schedule.html", icon: "📅", label: "Ders Programı", key: "schedule" },
    { href: "grades.html", icon: "📊", label: "Notlar", key: "grades" },
    { href: "attendance.html", icon: "✓", label: "Devamsızlık", key: "attendance" },
    { href: "registration.html", icon: "＋", label: "Ders Ekle/Bırak", key: "registration" }
  ];
  el.innerHTML = `
    <nav class="sidebar-nav">
      ${links.map(l => `
        <a href="${l.href}" class="sidebar-link ${l.key === activePage ? "active" : ""}">
          <span class="sidebar-icon">${l.icon}</span>
          <span>${l.label}</span>
        </a>
      `).join("")}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-student">
        <small>${STUDENT.department}</small>
        <small>${STUDENT.faculty}</small>
      </div>
    </div>
  `;
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("open");
  document.querySelector(".sidebar-overlay")?.classList.toggle("visible");
}
