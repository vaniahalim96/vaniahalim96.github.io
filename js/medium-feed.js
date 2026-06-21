// medium-feed.js — pulls live posts from Medium RSS via rss2json proxy.

const MEDIUM_USERNAME = "vaniahalim";
const RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
const PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

function stripHTML(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function excerpt(html, maxLen = 160) {
  const text = stripHTML(html).trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "\u2026";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

async function renderMediumFeed(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = `<p class="state-msg">Fetching latest posts from Medium\u2026</p>`;

  try {
    const res = await fetch(PROXY_URL);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();

    if (data.status !== "ok" || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("No items returned");
    }

    target.innerHTML = data.items.map(item => `
      <a class="card" href="${item.link}" target="_blank" rel="noopener">
        <div class="card-meta">${formatDate(item.pubDate)}</div>
        <div class="card-title">${item.title}</div>
        <p class="card-excerpt">${excerpt(item.description || item.content || "")}</p>
        ${item.categories && item.categories.length
          ? `<div class="card-tags">${item.categories.slice(0, 4).map(c => `<span class="tag">${c}</span>`).join("")}</div>`
          : ""}
      </a>
    `).join("");

  } catch (err) {
    target.innerHTML = `
      <p class="state-msg">
        Couldn't load posts right now. You can read them directly on
        <a href="https://medium.com/@${MEDIUM_USERNAME}" target="_blank" rel="noopener" style="color:var(--clay);">Medium \u2192</a>
      </p>
    `;
  }
}
