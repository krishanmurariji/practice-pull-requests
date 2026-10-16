/* =====================================================================
   UI HELPERS  -  icon(), avatars, chips, stars, dates, chart builders.
   Small pure functions that return HTML strings. Pages call them.
   ===================================================================== */

function icon(name, cls) {
  return '<svg class="i ' + (cls || '') + '" viewBox="0 0 256 256" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
}

/* thin line icon (sidebar). Same sizes as icon(). */
function iconLine(name, cls) {
  return '<svg class="i line ' + (cls || '') + '" viewBox="0 0 256 256" aria-hidden="true">' + (ICONS_LINE[name] || ICONS[name] || '') + '</svg>';
}

/* deterministic colour per name */
var AV_COLORS = ["#1597e5", "#6552d0", "#1a8f5a", "#e08a1e", "#cf3d2c", "#0f8f8f", "#a5489c", "#4b6cb7"];
function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
function initials(name) { var p = name.split(" "); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase(); }
/* ---- profile pictures ------------------------------------------------------
   Every person gets a picture. Order of preference:
     1. a real photo:      DEMO.photos["Full Name"] = "assets/name.jpg"
     2. a drawn portrait:  made from the name, so the same person always looks the same
     3. initials:          when the user picks "Initials" in Appearance
   Pages never draw avatars themselves: they call avatar() or avatarFace(). */
var SKIN = ["#fbd9bd", "#f3c29a", "#e0a878", "#c58a5c", "#a2683f", "#7b4a2a", "#5a3720", "#efc7a7"];
var HAIR = ["#1c1917", "#3f2a1d", "#6b4423", "#a0672b", "#d2a24c", "#8f8f8f", "#d9d9d9", "#2b2f45"];
var SHIRT = ["#2563eb", "#0ea5e9", "#0d9488", "#d97706", "#dc2626", "#7c3aed", "#db2777", "#475569"];
var PORTRAIT_BG = ["#dbeafe", "#e0f2fe", "#ccfbf1", "#fef3c7", "#fee2e2", "#ede9fe", "#fce7f3", "#e2e8f0"];
function avatarMode() { try { return localStorage.getItem("ariel-avatars") === "initials" ? "initials" : "photo"; } catch (e) { return "photo"; } }
function portraitSvg(name) {
  var r = function (i, n) { return hash(name + "|" + i) % n; };
  var skin = SKIN[r(1, SKIN.length)], hair = HAIR[r(2, HAIR.length)], shirt = SHIRT[r(3, SHIRT.length)], bg = PORTRAIT_BG[r(4, PORTRAIT_BG.length)];
  var style = r(5, 6), glasses = r(6, 4) === 0, beard = r(7, 6) === 0 && style !== 1, collar = r(8, 2) === 0;
  var back = "", front = "";
  if (style === 1) { back = '<path d="M29 46C27 22 39 15 50 15s23 7 21 31l2 27H27z" fill="' + hair + '"/>'; front = '<path d="M33 40C34 28 42 25 50 25s16 3 17 15c-6-5-12-8-17-8s-11 3-17 8z" fill="' + hair + '"/>'; }
  else if (style === 0) { front = '<path d="M32 43C30 24 41 18 50 18s20 6 18 25c-3-8-9-13-18-13s-15 5-18 13z" fill="' + hair + '"/>'; }
  else if (style === 2) { back = '<circle cx="50" cy="15" r="7.5" fill="' + hair + '"/>'; front = '<path d="M32 43C30 25 41 19 50 19s20 6 18 24c-3-8-9-13-18-13s-15 5-18 13z" fill="' + hair + '"/>'; }
  else if (style === 4) { front = '<g fill="' + hair + '"><circle cx="36" cy="30" r="8"/><circle cx="46" cy="24" r="8.5"/><circle cx="58" cy="24" r="8.5"/><circle cx="66" cy="31" r="7.5"/><circle cx="34" cy="40" r="5"/><circle cx="67" cy="40" r="5"/></g>'; }
  else if (style === 5) { front = '<path d="M32 44C29 25 42 18 51 18c11 0 19 8 17 26-1-9-6-15-14-17-8 5-15 8-22 17z" fill="' + hair + '"/>'; }
  return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="100" height="100" fill="' + bg + '"/>' + back +
    '<path d="M8 104C8 80 26 72 50 72s42 8 42 32z" fill="' + shirt + '"/>' + (collar ? '<path d="M42 72l8 9 8-9z" fill="#fff" opacity=".9"/>' : "") +
    '<rect x="43" y="58" width="14" height="17" rx="5" fill="' + skin + '"/><rect x="43" y="58" width="14" height="17" rx="5" fill="#000" opacity=".1"/>' +
    '<ellipse cx="33" cy="47" rx="3" ry="4" fill="' + skin + '"/><ellipse cx="67" cy="47" rx="3" ry="4" fill="' + skin + '"/><ellipse cx="50" cy="45" rx="17" ry="20" fill="' + skin + '"/>' +
    (beard ? '<path d="M34 50c0 14 7 20 16 20s16-6 16-20c-3 8-8 11-16 11s-13-3-16-11z" fill="' + hair + '" opacity=".92"/>' : "") + front +
    '<path d="M39 41q4-2.5 8 0M53 41q4-2.5 8 0" stroke="' + hair + '" stroke-width="1.7" fill="none" stroke-linecap="round"/>' +
    '<circle cx="43.5" cy="46" r="1.9" fill="#1f2937"/><circle cx="56.5" cy="46" r="1.9" fill="#1f2937"/><path d="M50 47v5" stroke="#000" stroke-opacity=".15" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M44.5 55q5.5 4.5 11 0" stroke="#7c2d12" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    (glasses ? '<g fill="none" stroke="#1f2937" stroke-width="1.5"><circle cx="43.5" cy="46" r="5.2"/><circle cx="56.5" cy="46" r="5.2"/><path d="M48.7 46h2.6"/></g>' : "") + "</svg>";
}
/* what goes inside a round avatar: { bg: background colour, html: the picture or the initials } */
function avatarFace(name) {
  var photo = (typeof DEMO !== "undefined" && DEMO.photos || {})[name];
  if (photo) { return { bg: "var(--surface-2)", html: '<img src="' + photo + '" alt="">', pic: true }; }
  if (avatarMode() === "initials") { return { bg: AV_COLORS[hash(name) % AV_COLORS.length], html: initials(name), pic: false }; }
  return { bg: "var(--surface-2)", html: '<img src="assets/people/p' + (1 + hash(name) % 7) + '.jpg" alt="">', pic: true };   // the same person always gets the same photo
}
function avatar(name, size) {
  var f = avatarFace(name);
  return '<span class="av ' + (f.pic ? "avp " : "") + (size || "") + '" style="background:' + f.bg + '" title="' + name + '">' + f.html + '</span>';
}
function avatarStack(names, size) {
  return '<span class="av-stack">' + names.map(function (n) { return avatar(n, size || "xs"); }).join("") + '</span>';
}
function person(name, sub, size) {
  return '<div class="who">' + avatar(name, size) + '<div><b>' + name + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div>';
}
function chip(text, tone, dot) { return '<span class="chip ' + (tone || "") + '">' + (dot ? "<i></i>" : "") + text + '</span>'; }

function stars(n) {
  var out = '<span class="stars" title="' + n + ' of 5">';
  for (var i = 1; i <= 5; i++) { out += icon(i <= n ? "starFill" : "star", i <= n ? "" : "e"); }
  return out + '</span>';
}
function ring(score, large) {
  var c = score >= 85 ? "var(--good)" : score >= 70 ? "var(--brand)" : score >= 55 ? "var(--warn)" : "var(--bad)";
  return '<span class="ring ' + (large ? "lg" : "") + '" style="--p:' + score + ';--c:' + c + '" data-v="' + score + '" title="AI match score ' + score + '"></span>';
}
function stageChip(id) {
  var tone = { applied: "", initial: "info", test: "violet", interview: "warn", offer: "teal", hired: "good", cancelled: "bad" }[id];
  return chip(DEMO.stage(id).label, tone, true);
}

/* dates */
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso) { var d = iso.split("-"); return parseInt(d[2], 10) + " " + MONTHS[parseInt(d[1], 10) - 1] + " " + d[0]; }
function shortDate(iso) { var d = iso.split("-"); return parseInt(d[2], 10) + " " + MONTHS[parseInt(d[1], 10) - 1]; }
function dayOf(iso) { return parseInt(iso.split("-")[2], 10); }
function monOf(iso) { return MONTHS[parseInt(iso.split("-")[1], 10) - 1]; }
function daysAgo(iso) { var a = new Date(DEMO.today), b = new Date(iso); return Math.round((a - b) / 86400000); }
function ago(iso) { var n = daysAgo(iso); return n <= 0 ? "Today" : n === 1 ? "Yesterday" : n + " days ago"; }

/* toast */
function toast(msg) {
  var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 2200);
}

/* modal: openModal({title, body, foot, wide}) */
function openModal(o) {
  var back = document.createElement("div"); back.className = "modal-back";
  back.innerHTML = '<div class="modal' + (o.wide ? " wide" : "") + '" role="dialog" aria-modal="true"><div class="modal-head"><h3>' + o.title + '</h3><button class="icon-btn right" data-close aria-label="Close">' + icon("x") + '</button></div><div class="modal-body">' + o.body + '</div>' + (o.foot ? '<div class="modal-foot">' + o.foot + '</div>' : "") + '</div>';
  back.addEventListener("click", function (e) { if (e.target === back || e.target.closest("[data-close]")) { back.remove(); } });
  document.body.appendChild(back);
  var f = back.querySelector("input,select,textarea"); if (f) { f.focus(); }
  return back;
}
/* drawer: a panel that slides in from the right (for create and edit forms). openDrawer({title, body, foot}) */
function openDrawer(o) {
  var back = document.createElement("div"); back.className = "drawer-back";
  back.innerHTML = '<aside class="drawer" role="dialog" aria-modal="true" aria-label="' + o.title + '"><div class="drawer-head"><h3>' + o.title + '</h3><button class="icon-btn right" data-close aria-label="Close">' + icon("x") + '</button></div><div class="drawer-body">' + o.body + '</div>' + (o.foot ? '<div class="drawer-foot">' + o.foot + '</div>' : "") + '</aside>';
  document.body.appendChild(back);
  void back.offsetWidth;   // flush styles so the slide-in animates from off-screen
  back.classList.add("in");
  back.close = function () { back.classList.remove("in"); setTimeout(function () { back.remove(); }, 260); };
  back.addEventListener("click", function (e) { if (e.target === back || e.target.closest("[data-close]")) { back.close(); } });
  setTimeout(function () { var f = back.querySelector("input,select,textarea"); if (f) { f.focus(); } }, 280);
  return back;
}
document.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") { return; }
  var d = document.querySelector(".drawer-back"); if (d) { d.close(); return; }
  var m = document.querySelector(".modal-back,.palette-back"); if (m) { m.remove(); }
});

/* ---- chart builders (SVG strings, no libraries) ---------------------- */
function lineChart(series, labels, o) {
  o = o || {}; var W = 640, H = o.h || 220, L = 34, R = 10, T = 12, B = 26;
  var max = o.max || Math.max.apply(null, [].concat.apply([], series.map(function (s) { return s.data; }))) * 1.15 || 1;
  var step = (W - L - R) / (labels.length - 1);
  function x(i) { return L + i * step; } function y(v) { return T + (H - T - B) * (1 - v / max); }
  var g = "";
  for (var k = 0; k <= 4; k++) { var gy = T + (H - T - B) * k / 4; g += '<line class="grid-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + gy + '" y2="' + gy + '"/><text x="' + (L - 8) + '" y="' + (gy + 4) + '" text-anchor="end">' + Math.round(max * (1 - k / 4)) + '</text>'; }
  labels.forEach(function (lb, i) { if (i % (o.every || 1) === 0) { g += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + lb + '</text>'; } });
  series.forEach(function (s, si) {
    var pts = s.data.map(function (v, i) { return x(i) + "," + y(v); });
    if (si === 0) { g += '<path d="M' + pts.join(" L") + ' L' + x(s.data.length - 1) + "," + (H - B) + " L" + L + "," + (H - B) + ' Z" fill="' + s.color + '" opacity="0.1"/>'; }
    g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + s.color + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
    var last = s.data.length - 1; g += '<circle cx="' + x(last) + '" cy="' + y(s.data[last]) + '" r="4" fill="' + s.color + '" stroke="var(--surface)" stroke-width="2"/>';
  });
  return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img">' + g + '</svg>';
}
function donut(parts, label) {
  var total = parts.reduce(function (a, p) { return a + p.v; }, 0), R = 62, C = 2 * Math.PI * R, off = 0, out = "";
  parts.forEach(function (p) {
    var len = p.v / total * C;
    out += '<circle r="' + R + '" cx="80" cy="80" fill="none" stroke="' + p.c + '" stroke-width="22" stroke-dasharray="' + len + " " + (C - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 80 80)"/>';
    off += len;
  });
  return '<svg class="chart" viewBox="0 0 160 160" style="max-width:10.625rem;margin:auto">' + out + '<text x="80" y="76" text-anchor="middle" style="font-size:1.625rem;font-weight:700;fill:var(--ink)">' + total + '</text><text x="80" y="95" text-anchor="middle">' + (label || "total") + '</text></svg>';
}
function legend(parts) { return '<div class="legend">' + parts.map(function (p) { return '<span><i style="background:' + p.c + '"></i>' + p.l + ' <b>' + p.v + '</b></span>'; }).join("") + '</div>'; }

/* sets --w on every expanding button label so it widens to exactly the width of its text */
function fitX(root) {
  [].forEach.call((root || document).querySelectorAll(".xbtn .xl"), function (l) { l.parentNode.style.setProperty("--w", (l.scrollWidth + 2) + "px"); });
}
if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { fitX(); }); }

/* qparam("id"): reads ?id= from the address. Some hosted viewers drop the query string, so every link
   click and redirect first remembers it for the page it opens (see shell.js), and this reads it back. */
function qparam(name) {
  var v = new URLSearchParams(location.search).get(name);
  if (v !== null) { return v; }
  try { var saved = sessionStorage.getItem("ariel-q:" + location.pathname.split("/").pop()); if (saved) { return new URLSearchParams(saved).get(name); } } catch (e) {}
  return null;
}
function rememberQuery(href) {
  try { var parts = String(href).split("#")[0].split("?"); if (parts[1]) { sessionStorage.setItem("ariel-q:" + parts[0].split("/").pop(), parts[1]); } } catch (e) {}
}
function go(href) { rememberQuery(href); location.href = href; }
document.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest("a[href]"); if (a) { rememberQuery(a.getAttribute("href")); } }, true);
