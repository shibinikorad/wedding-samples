const $ = s => document.querySelector(s), grid = $("#grid");
const wa = t => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
document.querySelectorAll("[data-wa]").forEach(a => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

/* hero fan: 5 phones, rotations/offsets by position (commented out)
const R = [[-12,34,0],[-6,14,.6],[0,0,1.2],[6,14,.3],[12,34,.9]];
if ($("#fan")) {
  $("#fan").innerHTML = SAMPLES.filter(s => s.hero).sort((a,b) => a.hero - b.hero).slice(0,5).map((s,i) =>
    `<div class="phone" style="--r:${R[i][0]}deg;--y:${R[i][1]}px;--d:${R[i][2]}s"><div class="screen"><img src="${s.img}" alt="${s.bride} & ${s.groom}"></div></div>`).join("");
}
*/

/* features */
const ICONS = [
  '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4L12 14l-3-3"/>',
  '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  '<path d="M6 2h12M6 22h12M7 2c0 5 5 6 5 10s-5 5-5 10M17 2c0 5-5 6-5 10s5 5 5 10"/>',
  '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01"/>'
];
const icon = i => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[i] || ICONS[0]}</svg>`;
const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29z"/></svg>';
$("#fgrid").innerHTML = FEATURES.map((f, i) => `<div class="f"><span>${icon(i)}</span><b>${f[1]}</b><p>${f[2]}</p></div>`).join("");

/* gallery */
let cat = "All";
$("#tabs").innerHTML = ["All", ...new Set(SAMPLES.map(s => s.cat))].map(c => `<button class="tab${c==="All"?" on":""}" data-c="${c}">${c}</button>`).join("");
$("#tabs").onclick = e => { const b = e.target.closest(".tab"); if (!b) return; cat = b.dataset.c; document.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t === b)); render(); };
$("#q").oninput = render;

/* load the live invitation inside the phone, scaled like a 390px-wide phone */
function fit(screen) {
  const f = screen.querySelector("iframe"); if (!f) return;
  const k = screen.clientWidth / 390;
  f.style.width = "390px"; f.style.height = screen.clientHeight / k + "px"; f.style.transform = `scale(${k})`;
}
function goLive(btn) {
  const screen = btn.closest(".screen");
  const f = document.createElement("iframe");
  f.title = "Live invitation preview"; f.allow = "autoplay"; f.src = screen.dataset.url;
  screen.append(f); fit(screen);
  const openLink = document.createElement("a");
  openLink.className = "open";
  openLink.href = screen.dataset.url;
  openLink.target = "_blank";
  openLink.rel = "noopener";
  openLink.textContent = "Show in new tab ↗";
  btn.replaceWith(openLink);
}
addEventListener("resize", () => document.querySelectorAll(".screen").forEach(fit));
const mq = matchMedia("(max-width:820px)");
const newTab = s => (s.mode || MODE) === "newtab" || ((s.mode || MODE) === "auto" && mq.matches);
mq.addEventListener("change", () => render());
grid.onclick = e => {
  const b = e.target.closest(".live"); if (!b) return;
  const url = b.closest(".screen").dataset.url;
  newTab({mode: b.dataset.mode}) ? window.open(url, "_blank", "noopener") : goLive(b);
};

function render() {
  const q = $("#q").value.trim().toLowerCase();
  const list = SAMPLES.filter(s => (cat === "All" || s.cat === cat) && (s.bride + s.groom).toLowerCase().includes(q));
  grid.innerHTML = list.length ? list.map((s, i) => `
  <article class="card">
    <div class="phone"><div class="screen" data-url="${s.url}" ${!s.img && s.url ? 'data-auto="1"' : ""}>
      ${s.img ? `<img src="${s.img}" alt="${s.groom} &amp; ${s.bride}" loading="lazy">` : `<div class="fb"><small>${s.cat}</small><b>${s.bride}</b><span>&amp;</span><b>${s.groom}</b></div>`}
      ${s.url ? (newTab(s)
        ? `<a class="open" href="${s.url}" target="_blank" rel="noopener">Show in new tab ↗</a>`
        : (s.img
          ? `<button class="live" data-mode="embed">Live preview</button>`
          : `<a class="open" href="${s.url}" target="_blank" rel="noopener">Show in new tab ↗</a>`)) : ""}
    </div></div>
    <div class="meta">
      <div><div class="names">${s.bride ? `${s.bride} <span>&amp;</span> ` : ""}${s.groom}</div><div class="cat">${s.cat}</div></div>
      <!-- <div class="price">₹${s.price.toLocaleString("en-IN")}</div> -->
    </div>
    <a class="wa" target="_blank" rel="noopener" href="${wa(`Hi! I like the ${s.bride} & ${s.groom} (${s.cat}) invitation. I'd like something similar.`)}">${WA_ICON}Order on WhatsApp</a>
  </article>`).join("") : `<div class="empty">No samples match. Try another category or name.</div>`;
  observeAuto();
}
/* no poster image? load the site itself into the phone when it scrolls into view */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; io.unobserve(e.target);
  const sc = e.target, f = document.createElement("iframe");
  f.title = "Live invitation preview"; f.loading = "lazy"; f.src = sc.dataset.url;
  if (mq.matches) f.style.pointerEvents = "none";   /* mobile: tap opens new tab instead of trapping scroll */
  sc.append(f); fit(sc);
}), {rootMargin: "250px"});
function observeAuto(){ grid.querySelectorAll(".screen[data-auto]").forEach(el => io.observe(el)); }
addEventListener("scroll", () => $(".nav").classList.toggle("s", scrollY > 10), {passive:true});
render();
