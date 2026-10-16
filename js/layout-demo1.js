/* =====================================================================
   LAYOUT "METRONIC DEMO 1"  (try it: Appearance > Layout > Metronic, or ?layout=demo1)
   Runs after shell.js has built the normal page. It swaps the strip + panel for:
     - a full sidebar: logo, sections, modules that open like an accordion;
       the small box button on its edge folds it to an icon strip (hover shows the pages)
     - a top bar: the current module's pages as a horizontal menu, and on the right
       search, notifications and your profile (their popovers are shell.js's own)
   ===================================================================== */
(function () {
  var app = document.querySelector(".app");
  if (!app || typeof MODULES === "undefined") { return; }
  var body = document.body, root = document.documentElement;
  var moduleId = body.dataset.module || "dashboard", pageId = body.dataset.page || "";
  var mainEl = app.querySelector(".main"), content = document.getElementById("content");
  var small = window.innerWidth <= 720;

  function store(k, v) { try { if (v === undefined) { return localStorage.getItem(k); } if (v === null) { localStorage.removeItem(k); return; } localStorage.setItem(k, v); } catch (e) { return null; } }
  function byId(id) { return MODULES.filter(function (m) { return m.id === id; })[0]; }
  function firstPage(m) { return m.items.filter(function (i) { return i.href; })[0]; }

  var GROUPS = [["", ["dashboard"]], ["People", ["employee", "attendance", "leave"]], ["Pay", ["payroll", "payroll-pro"]], ["Talent", ["recruitment", "onboarding", "offboarding", "performance"]], ["Workspace", ["project", "assets", "helpdesk", "reports"]]];
  var placed = {};
  GROUPS.forEach(function (g) { g[1].forEach(function (id) { placed[id] = 1; }); });
  var rest = MODULES.filter(function (m) { return !placed[m.id]; });
  if (rest.length) { GROUPS.push(["More", rest.map(function (m) { return m.id; })]); }

  /* ---- sidebar ---- */
  function itemHtml(m) {
    var on = m.id === moduleId, ic = iconLine(m.icon);
    if (!m.items.length) { return '<a class="d1-item' + (on ? " on" : "") + '" href="' + (m.href || "#") + '" data-tip="' + m.label + '">' + ic + '<span class="d1-lbl">' + m.label + '</span></a>'; }
    var subs = m.items.map(function (it) {
      var cur = on && it.id === pageId;
      return it.href ? '<a class="d1-sub' + (cur ? " on" : "") + '" href="' + it.href + '">' + it.label + '</a>' : '<span class="d1-sub off" title="Not designed in this prototype">' + it.label + '</span>';
    }).join("");
    return '<div class="d1-mod' + (on ? " open" : "") + '" data-mod="' + m.id + '"><button type="button" class="d1-item' + (on ? " on" : "") + '" data-d1mod="' + m.id + '">' + ic + '<span class="d1-lbl">' + m.label + '</span>' + icon("down", "d1-chev") + '</button><div class="d1-subs">' + subs + '</div></div>';
  }
  function menuHtml() {
    return GROUPS.map(function (g) {
      var mods = g[1].map(byId).filter(Boolean);
      if (!mods.length) { return ""; }
      return '<div class="d1-group">' + (g[0] ? '<div class="d1-sec"><span>' + g[0] + '</span></div>' : "") + mods.map(itemHtml).join("") + '</div>';
    }).join("");
  }
  var sb = document.createElement("aside");
  sb.className = "d1-sb"; sb.id = "d1sb";
  sb.innerHTML = '<a class="d1-logo" href="recruitment-dashboard.html" aria-label="Ariel Software Solutions"><img class="logo-img full" src="assets/ariel-logo-sm.png" alt="Ariel Software Solutions"><span class="emblem mini" style="--e:2rem"></span></a><nav class="d1-menu" aria-label="Modules">' + menuHtml() + '</nav>';
  app.insertBefore(sb, app.firstChild);

  /* the small box button on the sidebar edge */
  var tgl = document.createElement("button");
  tgl.type = "button"; tgl.className = "d1-toggle"; tgl.id = "d1Toggle";
  tgl.innerHTML = icon("left", "sm");
  app.appendChild(tgl);

  /* ---- top bar ---- */
  var mod = byId(moduleId) || MODULES[0];
  var unread = (typeof DEMO !== "undefined" ? DEMO.notifications.filter(function (n) { return n.u; }).length : 0);
  function meFace() {
    var p = store("ariel-photo") || (DEMO.me && DEMO.me.photo);
    return p ? '<img class="av av-img round" src="' + p + '" alt="' + DEMO.me.name + '">' : avatar(DEMO.me.name, "round");
  }
  var nav = mod.items.length ? mod.items.map(function (it) {
    return it.href ? '<a class="d1-link' + (it.id === pageId ? " on" : "") + '" href="' + it.href + '">' + it.label + '</a>' : '<span class="d1-link off" title="Not designed in this prototype">' + it.label + '</span>';
  }).join("") : "";
  var top = document.createElement("header");
  top.className = "d1-top";
  top.innerHTML = '<button type="button" class="d1-burger" data-d1="burger" aria-label="Open menu">' + icon("menu", "lg") + '</button><nav class="d1-nav" aria-label="' + mod.label + ' pages">' + nav + '</nav>' +
    '<div class="d1-tools"><button type="button" class="d1-ib" data-do="search" aria-label="Search" title="Search (Ctrl K)">' + icon("search") + '</button>' +
    '<button type="button" class="d1-ib" data-pop="notes" aria-label="Notifications" title="Notifications">' + iconLine("bell") + (unread ? '<span class="badge">' + unread + '</span>' : "") + '</button>' +
    '<button type="button" class="d1-me" data-pop="user" aria-label="Your menu" title="' + DEMO.me.name + '">' + meFace() + '</button></div>';
  mainEl.insertBefore(top, content);

  /* ---- folded / open ---- */
  var folded = store("ariel-d1-folded") === "1" && !small;
  function setFolded(on, quiet) {
    folded = on; app.classList.toggle("d1-folded", on);
    tgl.setAttribute("aria-pressed", on ? "true" : "false"); tgl.setAttribute("aria-label", on ? "Open the sidebar" : "Fold the sidebar"); tgl.title = on ? "Open the sidebar" : "Fold the sidebar";
    if (!quiet) { store("ariel-d1-folded", on ? "1" : null); }
    hideFly();
  }

  /* hover card with a module's pages while the sidebar is folded */
  var flyEl = null, flyAnchor = null, flyTimer = null;
  function hideFly() { clearTimeout(flyTimer); if (flyEl) { flyEl.remove(); flyEl = null; flyAnchor = null; } }
  function dropFly() { clearTimeout(flyTimer); flyTimer = setTimeout(hideFly, 180); }
  function showFly(btn, m) {
    clearTimeout(flyTimer); if (flyAnchor === btn) { return; } hideFly();
    flyEl = document.createElement("div"); flyEl.className = "fly";
    flyEl.innerHTML = '<div class="fly-h"><span class="fly-ic">' + iconLine(m.icon) + '</span><b>' + m.label + '</b></div><div class="fly-l">' + m.items.map(function (it) {
      var on = m.id === moduleId && it.id === pageId;
      return it.href ? '<a class="fi' + (on ? " on" : "") + '" href="' + it.href + '">' + it.label + '</a>' : '<span class="fi off" title="Not designed in this prototype">' + it.label + '</span>';
    }).join("") + '</div>';
    document.body.appendChild(flyEl); flyAnchor = btn;
    var r = btn.getBoundingClientRect();
    flyEl.style.left = (r.right + 10) + "px"; flyEl.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - flyEl.offsetHeight - 8)) + "px";
    flyEl.addEventListener("mouseenter", function () { clearTimeout(flyTimer); }); flyEl.addEventListener("mouseleave", dropFly);
  }
  var tipEl = null;
  function hideTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
  document.addEventListener("mouseover", function (e) {
    if (!folded || small) { return; }
    if (e.target.closest(".fly")) { clearTimeout(flyTimer); return; }
    var it = e.target.closest(".d1-sb .d1-item");
    if (!it) { hideTip(); if (flyEl) { dropFly(); } return; }
    var m = it.dataset.d1mod ? byId(it.dataset.d1mod) : null;
    if (m && m.items.length) { hideTip(); showFly(it, m); return; }
    hideFly(); hideTip();
    var r = it.getBoundingClientRect(); tipEl = document.createElement("div"); tipEl.className = "tip"; tipEl.textContent = it.dataset.tip || it.textContent.trim(); document.body.appendChild(tipEl);
    tipEl.style.left = (r.right + 10) + "px"; tipEl.style.top = (r.top + r.height / 2 - tipEl.offsetHeight / 2) + "px";
  });

  /* ---- clicks ---- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("#d1Toggle")) { if (small) { app.classList.remove("d1-open"); } else { setFolded(!folded); } return; }
    var mb = t.closest("[data-d1mod]");
    if (mb) {
      var m = byId(mb.dataset.d1mod);
      if (folded && !small) { var f = firstPage(m); if (f) { location.href = f.href; } return; }
      var box = mb.parentNode, wasOpen = box.classList.contains("open");
      [].forEach.call(sb.querySelectorAll(".d1-mod.open"), function (x) { x.classList.remove("open"); });
      if (!wasOpen) { box.classList.add("open"); }
      return;
    }
    if (t.closest("[data-d1=burger]")) { app.classList.toggle("d1-open"); return; }
    if (small && app.classList.contains("d1-open") && !t.closest(".d1-sb")) { app.classList.remove("d1-open"); }
    if (!t.closest(".fly")) { hideFly(); }
    hideTip();
  }, true);
  window.addEventListener("resize", function () { small = window.innerWidth <= 720; if (small) { app.classList.remove("d1-folded"); } else { app.classList.toggle("d1-folded", folded); app.classList.remove("d1-open"); } });

  app.classList.add("l-demo1");
  setFolded(folded, true);
})();
