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
var AV_COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#3b82f6", "#06b6d4", "#6366f1", "#0891b2", "#2563eb"];   /* sky family */
function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
function initials(name) { var p = name.split(" "); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase(); }
function avatar(name, size) {
  return '<span class="av ' + (size || "") + '" style="background:' + AV_COLORS[hash(name) % AV_COLORS.length] + '" title="' + name + '">' + initials(name) + '</span>';
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
  var c = score >= 85 ? "#0369a1" : score >= 70 ? "#0ea5e9" : score >= 55 ? "#7dd3fc" : "#9db4c8";
  return '<span class="ring ' + (large ? "lg" : "") + '" style="--p:' + score + ';--c:' + c + '" data-v="' + score + '" title="AI match score ' + score + '"></span>';
}
function stageChip(id) {
  var st = DEMO.stage(id);
  return '<span class="chip st" style="--cc:' + st.color + '"><i></i>' + st.label + '</span>';
}

/* popover menu: skyMenu(anchor, html, onPick, minWidthPx). Items carry data-pick="value". One open at a time. */
var _skyMenu = null, _skyAnchor = null;
function closeSkyMenu() { if (_skyMenu) { _skyMenu.remove(); _skyMenu = null; } if (_skyAnchor) { _skyAnchor.classList.remove("open"); _skyAnchor = null; } }
function skyMenu(anchor, html, onPick, minW) {
  if (_skyAnchor === anchor) { closeSkyMenu(); return null; }
  closeSkyMenu();
  var r = anchor.getBoundingClientRect(), m = document.createElement("div");
  m.className = "pop"; m.setAttribute("role", "menu"); m.innerHTML = html; document.body.appendChild(m);
  if (minW) { m.style.minWidth = minW + "px"; }
  var mw = m.offsetWidth;
  m.style.top = (r.bottom + 6) + "px"; m.style.left = Math.max(12, Math.min(window.innerWidth - mw - 12, r.left)) + "px";
  anchor.classList.add("open"); _skyMenu = m; _skyAnchor = anchor;
  m.addEventListener("click", function (e) { var it = e.target.closest("[data-pick]"); if (it && onPick) { var v = it.dataset.pick; closeSkyMenu(); onPick(v); } });
  return m;
}
document.addEventListener("click", function (e) { if (_skyMenu && !e.target.closest(".pop") && !(_skyAnchor && _skyAnchor.contains(e.target))) { closeSkyMenu(); } });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeSkyMenu(); } });

/* pills(items, current): items = [[id, label, count?]] -> pill tab html. Buttons carry data-t="id". */
function pills(items, cur) {
  return '<div class="pills" role="tablist">' + items.map(function (t) {
    return '<button role="tab" data-t="' + t[0] + '" class="' + (t[0] === cur ? "on" : "") + '" aria-selected="' + (t[0] === cur) + '">' + t[1] + (t[2] !== undefined && t[2] !== "" ? ' <span class="n">' + t[2] + '</span>' : "") + '</button>';
  }).join("") + '</div>';
}

/* swap the [data-i] placeholders on a page for real icons */
function hydrateIcons(root) { [].forEach.call((root || document).querySelectorAll("[data-i]"), function (n) { n.outerHTML = icon(n.dataset.i, n.dataset.c); }); }

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
