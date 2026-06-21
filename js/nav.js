// nav.js — injects the sidebar/topbar nav on every page, highlights current page.

const NAV_ITEMS = [
  { idx: "01", label: "Home", href: "index.html" },
  { idx: "02", label: "About", href: "about.html" },
  { idx: "03", label: "Challenges", href: "challenges.html" },
  { idx: "04", label: "Work Notes", href: "work-notes.html" },
  // { idx: "05", label: "Personal Notes", href: "personal-notes.html" }, // hidden until ready
];
// Add/remove socials here — used in the sidebar, mobile menu, and About page.
const SOCIAL_LINKS = [
  { name: "Instagram", url: "https://instagram.com/vaniahalim", icon: "instagram" },
  { name: "Threads", url: "https://www.threads.com/@vaniahalim", icon: "threads" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/vania-faustina-halim", icon: "linkedin" },
  { name: "Medium", url: "https://medium.com/@vaniahalim", icon: "medium" },
];

const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>`,
  threads: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21c-4.5 0-7.5-2.8-7.5-9S7.5 3 12 3s7 2.6 7 6.2c0 2.7-1.4 4-3.2 4-1.5 0-2.3-.8-2.4-2 0 1.6-1 2.6-2.6 2.6-1.7 0-2.8-1.1-2.8-2.6 0-1.6 1.3-2.6 3-2.6.6 0 1.1.1 1.5.3"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7.5" y1="10" x2="7.5" y2="17"/><circle cx="7.5" cy="6.8" r="0.9" fill="currentColor" stroke="none"/><path d="M11.5 17v-4.2c0-1.5 1-2.3 2.2-2.3 1.2 0 2 .8 2 2.3V17"/></svg>`,
  medium: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="12" r="4"/><ellipse cx="16" cy="12" rx="2.2" ry="4"/><ellipse cx="20.5" cy="12" rx="0.9" ry="4"/></svg>`,
};

function socialIconsHTML(extraClass = "") {
  return `
    <div class="social-row ${extraClass}">
      ${SOCIAL_LINKS.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" title="${s.name}" class="social-icon">
          ${SOCIAL_ICONS[s.icon]}
        </a>
      `).join("")}
    </div>
  `;
}

function currentFile() {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
}

function renderNav() {
  if (document.body.dataset.navRendered === "true") return;
  document.body.dataset.navRendered = "true";

  const current = currentFile();

  const navListHTML = NAV_ITEMS.map(item => `
    <li>
      <a href="${item.href}" class="${item.href === current ? 'active' : ''}">
        <span class="idx">${item.idx}</span> ${item.label}
      </a>
    </li>
  `).join("");

  // Desktop sidebar
  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-top">
        <a href="index.html" style="display:block;">
          <span class="mark">Vania F. Halim</span>
          <span class="mark-sub">field notes &amp; pin collection</span>
        </a>
        <ul class="nav-list">${navListHTML}</ul>
      </div>
      <div class="sidebar-bottom">
        ${socialIconsHTML()}
        <div>&copy; ${new Date().getFullYear()}</div>
        <div><a href="https://medium.com/@vaniahalim" target="_blank" rel="noopener">medium.com/@vaniahalim</a></div>
      </div>
    </aside>
  `;

  // Mobile topbar
  const topbarHTML = `
    <div class="topbar">
      <a href="index.html" class="mark">Vania F. Halim</a>
      <button id="menuToggle" aria-expanded="false" aria-controls="topbarMenu">Menu</button>
    </div>
    <div class="topbar-menu" id="topbarMenu">
      <ul class="nav-list">${navListHTML}</ul>
    </div>
    <div class="mobile-social-bar">
      ${socialIconsHTML()}
    </div>
  `;

  const shell = document.getElementById("navShell");
  shell.insertAdjacentHTML("afterbegin", sidebarHTML);

  document.body.insertAdjacentHTML("afterbegin", topbarHTML);

  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("topbarMenu");
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Close" : "Menu";
  });
}

document.addEventListener("DOMContentLoaded", renderNav);
