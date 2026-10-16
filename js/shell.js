/* =====================================================================
   SHELL  -  builds the sidebar (and a slim mobile bar) around each page.
   A page only needs:
     <body data-module="recruitment" data-page="candidates" data-title="Candidates" data-sub="...">
       <main id="page"> ...content... </main>
   Optional inside main: <div data-actions> buttons shown top right of the title </div>

   The sidebar is a slim icon strip. It widens over the page when the pointer
   is on it. Top: theme icon. Middle: module icons (scrolls). Bottom: your avatar,
   which opens a menu (clock in, profile, notifications, company, appearance...).
   ===================================================================== */
(function () {
  var body = document.body, root = document.documentElement;
  var moduleId = body.dataset.module || "dashboard";
  var pageId = body.dataset.page || "";
  var pageTitle = body.dataset.title || "";
  var main = document.getElementById("page");
  var actions = main.querySelector("[data-actions]");
  if (actions) { actions.remove(); }

  /* ---- saved preferences (this browser only) ---- */
  function store(k, v) { try { if (v === undefined) { return localStorage.getItem(k); } if (v === null) { localStorage.removeItem(k); return; } localStorage.setItem(k, v); } catch (e) { return null; } }
  function isDark() { var t = root.getAttribute("data-theme"); return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; }
  function accent() { var id = store("ariel-accent") || ACCENTS[0].id; return ACCENTS.filter(function (a) { return a.id === id; })[0] || ACCENTS[0]; }
  function lum(hex) { var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
  function applyLook() {
    var th = store("ariel-theme"); if (th === "light" || th === "dark") { root.setAttribute("data-theme", th); } else { root.removeAttribute("data-theme"); }
    var a = accent(), c = isDark() ? a.d : a.l;
    root.style.setProperty("--brand", c); root.style.setProperty("--brand-ink", lum(c) > 0.62 ? "#101828" : "#ffffff");
    if (store("ariel-density") === "compact") { root.setAttribute("data-density", "compact"); } else { root.removeAttribute("data-density"); }
    var sc = store("ariel-scale"); root.style.fontSize = (["70", "80", "100"].indexOf(sc) >= 0 ? sc : "80") + "%";
  }
  applyLook();

  var mod = MODULES.filter(function (m) { return m.id === moduleId; })[0] || MODULES[0];
  var small = window.innerWidth <= 720;

  /* ---- profile helpers ---- */
  function photo() { return store("ariel-photo") || DEMO.me.photo; }
  function meAvatar(cls) { var p = photo(); return p ? '<img class="av av-img ' + (cls || "") + '" src="' + p + '" alt="' + DEMO.me.name + '">' : avatar(DEMO.me.name, cls); }
  function clockStart() { var v = parseInt(store("ariel-checkin") || "0", 10); return v || 0; }
  function clockText() {
    var s = clockStart(), secs = s ? Math.floor((Date.now() - s) / 1000) : 0;
    return [Math.floor(secs / 3600), Math.floor(secs % 3600 / 60), secs % 60].map(function (n) { return (n < 10 ? "0" : "") + n; }).join(":");
  }
  var unread = DEMO.notifications.filter(function (n) { return n.u; }).length;

  /* ---- sidebar html ---- */
  function menuHtml() {
    return MODULES.map(function (m) {
      var current = m.id === moduleId;
      if (!m.items.length) {
        return '<a class="mod-btn' + (current ? " on" : "") + '" href="' + (m.href || "#") + '" aria-label="' + m.label + '">' + iconLine(m.icon) + '<span class="lbl">' + m.label + '</span></a>';
      }
      var subs = m.items.map(function (it) {
        var on = current && it.id === pageId;
        return '<a class="sub' + (on ? " on" : "") + '" href="' + (it.href || "#") + '"' + (it.href ? "" : ' title="Not designed in this prototype"') + '>' + it.label + '</a>';
      }).join("");
      return '<div class="mod' + (current ? " open" : "") + '" data-mod="' + m.id + '"><button class="mod-btn' + (current ? " on" : "") + '" data-modbtn="' + m.id + '" aria-label="' + m.label + '">' + iconLine(m.icon) + '<span class="lbl">' + m.label + '</span>' + icon("right", "chev") + '</button><div class="subs">' + subs + '</div></div>';
    }).join("");
  }
  function userBtnHtml() {
    var on = !!clockStart();
    return meAvatar("round") + '<i class="status' + (on ? " live" : "") + '"></i><span class="who"><b>' + DEMO.me.name + '</b><small>' + (on ? "Clocked in " + '<span data-clock>' + clockText() + '</span>' : DEMO.me.role) + '</small></span>';
  }
  function sidebarHtml() {
    return '<div class="sb-top"><button class="sb-bell" data-pop="notes" aria-label="Notifications">' + iconLine("bell", "lg") + (unread ? '<span class="badge">' + unread + '</span>' : "") + '</button><img class="sb-logo-img" src="assets/ariel-logo.webp" alt="Ariel Software Solutions"></div>' +
      '<nav class="sb-menu" id="sbMenu" aria-label="Modules">' + menuHtml() + '</nav>' +
      '<div class="sb-bottom"><button class="sb-user" id="sbUser" data-pop="user" aria-label="Your menu">' + userBtnHtml() + '</button></div>';
  }

  /* ---- page head: just the menu name and the page's action buttons ---- */
  var titleHtml = body.dataset.sub !== undefined
    ? '<div><h1>' + pageTitle + '</h1><p class="head-sub" id="head-sub">' + body.dataset.sub + '</p></div>'
    : '<h1>' + pageTitle + '</h1>';
  var head = body.dataset.nohead ? "" : '<div class="page-head' + (body.dataset.compact ? " compact" : "") + (body.dataset.ruled ? " ruled" : "") + '">' + titleHtml + '<div class="actions" id="head-actions"></div></div>';

  /* ---- assemble ---- */
  var app = document.createElement("div");
  app.className = "app";
  app.innerHTML = '<div class="sb-slot"><aside class="sb" id="sb">' + sidebarHtml() + '</aside></div><div class="main"><div class="m-top"><button data-act="menu" aria-label="Open menu">' + icon("menu", "lg") + '</button><span class="emblem" style="--e:1.875rem"></span><b>Ariel HR</b></div><div class="content" id="content">' + head + '</div></div>';
  body.insertBefore(app, main);
  document.getElementById("content").appendChild(main);
  /* move the real buttons (not a copy), so the click handlers the page attached keep working */
  if (actions) { var ha = document.getElementById("head-actions"); while (actions.firstChild) { ha.appendChild(actions.firstChild); } }
  var sb = document.getElementById("sb"), menu = document.getElementById("sbMenu");

  /* ---- pin button: keeps the sidebar open with names (and moves the page over); unpinned = the slim strip that opens on hover ---- */
  var pinned = store("ariel-sb-pinned") === "1" && !small;
  var tgl = document.createElement("button");
  tgl.className = "sb-toggle"; tgl.id = "sbToggle"; tgl.type = "button";
  tgl.innerHTML = icon("right", "sm");
  sb.parentNode.appendChild(tgl);
  function setPinned(on, quiet) {
    pinned = on; app.classList.toggle("pinned", on); sb.classList.toggle("expanded", on);
    tgl.setAttribute("aria-pressed", on ? "true" : "false");
    tgl.setAttribute("aria-label", on ? "Collapse sidebar" : "Keep sidebar open"); tgl.title = on ? "Collapse sidebar" : "Keep sidebar open";
    if (!quiet) { store("ariel-sb-pinned", on ? "1" : null); }
    setTimeout(fade, 240);
  }
  tgl.addEventListener("click", function () { closePop(); setPinned(!pinned); });
  tgl.addEventListener("mouseenter", function () { clearTimeout(leaveTimer); expand(true); });
  tgl.addEventListener("mouseleave", function () { leaveTimer = setTimeout(function () { expand(false); }, 140); });

  /* ---- open on hover (not while a popover is open, and not on small screens) ---- */
  var leaveTimer = null;
  function expand(on) { if (small || pinned) { return; } if (on && pop) { return; } sb.classList.toggle("expanded", on); if (on) { setTimeout(fade, 220); } }
  sb.addEventListener("mouseenter", function () { clearTimeout(leaveTimer); expand(true); });
  sb.addEventListener("mouseleave", function () { leaveTimer = setTimeout(function () { expand(false); }, 140); });
  sb.addEventListener("focusin", function () { expand(true); });

  /* ---- fade at the ends of the scrolling icons, only where more is hidden ---- */
  function fade() {
    var top = menu.scrollTop > 2, bottom = menu.scrollTop + menu.clientHeight < menu.scrollHeight - 2;
    menu.style.setProperty("--fade-top", top ? "2.125rem" : "0px");
    menu.style.setProperty("--fade-bottom", bottom ? "2.125rem" : "0px");
  }
  menu.addEventListener("scroll", fade, { passive: true });
  window.addEventListener("resize", function () { var was = small; small = window.innerWidth <= 720; if (small && !was && pinned) { setPinned(false, true); } fade(); closePop(); });
  fade();
  var cur = menu.querySelector(".mod-btn.on"); if (cur) { menu.scrollTop = Math.max(0, cur.offsetTop - 120); fade(); }
  if (pinned) { setPinned(true, true); } else { setPinned(false, true); }

  /* ---- popovers ---- */
  var pop = null;   // { kind, anchor, el }
  function lookHtml() {
    var th = store("ariel-theme") || "system", dn = store("ariel-density") || "comfortable", ac = accent().id;
    var seg = function (name, opts, cur) { return '<div class="seg full" data-seg="' + name + '">' + opts.map(function (o) { return '<button data-v="' + o[0] + '" class="' + (cur === o[0] ? "on" : "") + '">' + (o[2] ? icon(o[2], "sm") : "") + o[1] + '</button>'; }).join("") + '</div>'; };
    return '<h4>Appearance</h4><section class="set"><label>Theme</label>' + seg("theme", [["light", "Light", "sun"], ["dark", "Dark", "moon"], ["system", "Auto", "monitor"]], th) + '</section>' +
      '<section class="set"><label>Accent colour</label><div class="swatches">' + ACCENTS.map(function (a) { return '<button class="swatch' + (a.id === ac ? " on" : "") + '" data-accent="' + a.id + '" style="--sw:' + a.l + '" aria-label="' + a.name + '" title="' + a.name + '">' + icon("check") + '</button>'; }).join("") + '</div></section>' +
      '<section class="set"><label>Interface size</label>' + seg("scale", [["70", "Small"], ["80", "Default"], ["100", "Large"]], ["70", "100"].indexOf(store("ariel-scale")) >= 0 ? store("ariel-scale") : "80") + '</section>' +
      '<section class="set"><label>Density</label>' + seg("density", [["comfortable", "Comfortable"], ["compact", "Compact"]], dn) + '</section>' +
      '<section class="set"><label>Profile pictures</label>' + seg("avatars", [["photo", "Pictures"], ["initials", "Initials"]], avatarMode()) + '</section>' +
      '<section class="set"><label for="lang">Language</label><select class="select" id="lang" data-lang>' + ["English", "Hindi", "Arabic", "French", "German", "Spanish"].map(function (l) { return '<option' + (store("ariel-lang") === l ? " selected" : "") + '>' + l + '</option>'; }).join("") + '</select></section>' +
      '<div class="sep"></div><button class="item" data-do="reset-look">' + icon("refresh", "sm") + 'Reset to defaults</button>';
  }
  function userPopHtml() {
    var on = !!clockStart();
    return '<div class="head">' + meAvatar("round md") + '<div><b>' + DEMO.me.name + '</b><span class="muted" style="font-size:var(--fs-xs)">' + DEMO.me.role + '</span></div></div><div class="sep"></div>' +
      '<button class="item" data-do="clock">' + icon("clock", "sm") + (on ? "Clock out" : "Clock in") + '<span class="tail' + (on ? " live" : "") + '" data-clock>' + (on ? clockText() : "") + '</span></button>' +
      '<button class="item" data-do="myprofile">' + icon("user", "sm") + 'My profile</button>' +
      '<button class="item" data-do="theme">' + icon(isDark() ? "sun" : "moon", "sm") + (isDark() ? "Light mode" : "Dark mode") + '</button>' +
      '<button class="item" data-do="company">' + icon("building", "sm") + 'Company<span class="tail">' + DEMO.company.short + '</span></button>' +
      '<button class="item" data-do="look">' + icon("palette", "sm") + 'Appearance</button>' +
      '<button class="item" data-do="search">' + icon("search", "sm") + 'Search<span class="tail">Ctrl K</span></button>' +
      '<div class="sep"></div>' +
      '<button class="item" data-do="photo">' + icon("camera", "sm") + 'Change photo</button>' +
      '<button class="item" data-do="password">' + icon("key", "sm") + 'Reset password</button>' +
      '<button class="item" data-do="cache">' + icon("refresh", "sm") + 'Clear cache</button>' +
      '<div class="sep"></div><button class="item danger" data-do="signout">' + icon("logout", "sm") + 'Sign out</button><input type="file" accept="image/*" id="photoFile" hidden>';
  }
  function popHtml(kind) {
    if (kind === "user") { return userPopHtml(); }
    if (kind === "notes") { return '<h4>Notifications</h4>' + DEMO.notifications.map(function (n) { return '<div class="note' + (n.u ? " unread" : "") + '"><div><div>' + n.t + '</div><p>' + n.s + '</p></div></div>'; }).join("") + '<div class="sep"></div><button class="item" data-do="readall">' + icon("check", "sm") + 'Mark all as read</button>'; }
    if (kind === "company") { return '<div class="head"><img class="logo-img" src="assets/ariel-logo.webp" alt="Ariel Software Solutions" style="height:2.125rem;width:auto"></div><h4>Company</h4><a class="item on" href="#">' + icon("check", "sm") + DEMO.company.name + '</a><a class="item" href="#">' + icon("building", "sm") + 'All Company</a>'; }
    if (kind === "look") { return lookHtml(); }
    return "";
  }
  function place(el, anchor) {
    var r = anchor.getBoundingClientRect();
    el.style.left = (document.querySelector(".sb-slot").getBoundingClientRect().width + 8) + "px";
    if (r.top > window.innerHeight * 0.45) { el.style.bottom = Math.max(12, window.innerHeight - r.bottom) + "px"; el.style.top = "auto"; }
    else { el.style.top = Math.max(12, r.top) + "px"; el.style.bottom = "auto"; }
  }
  function closePop() { if (pop) { pop.el.remove(); pop = null; } }
  function openPop(kind, anchor) {
    if (pop && pop.kind === kind) { closePop(); return; }
    closePop();
    if (!pinned) { sb.classList.remove("expanded"); }           // keep the strip slim while a menu is open
    var el = document.createElement("div"); el.className = "pop"; el.setAttribute("role", "menu"); el.innerHTML = popHtml(kind);
    document.body.appendChild(el); place(el, anchor); pop = { kind: kind, anchor: anchor, el: el };
  }
  function swapPop(kind) { var a = pop ? pop.anchor : document.getElementById("sbUser"); closePop(); openPop(kind, a); }
  function refreshPop() { if (pop) { pop.el.innerHTML = popHtml(pop.kind); } }

  /* ---- clicks ---- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var trigger = t.closest("[data-pop]");
    if (trigger) { openPop(trigger.dataset.pop, trigger); return; }
    if (!t.closest(".pop")) { closePop(); }

    var mb = t.closest("[data-modbtn]");
    if (mb) {
      var box = mb.parentNode, wasOpen = box.classList.contains("open");
      [].forEach.call(document.querySelectorAll(".mod.open"), function (x) { x.classList.remove("open"); });
      if (!wasOpen) { box.classList.add("open"); }
      if (!sb.classList.contains("expanded")) { expand(true); }   // touch screens have no hover
      setTimeout(fade, 30);
      return;
    }
    var a = t.closest("[data-act]");
    if (a) {
      var act = a.dataset.act;
      if (act === "menu") { var open = app.classList.toggle("open"); sb.classList.toggle("expanded", open); }
      return;
    }
    if (small && app.classList.contains("open") && !t.closest(".sb")) { app.classList.remove("open"); sb.classList.remove("expanded"); }

    var seg = t.closest("[data-seg] button");
    if (seg) {
      var name = seg.parentNode.dataset.seg, v = seg.dataset.v;
      if (name === "theme") { store("ariel-theme", v === "system" ? null : v); }
      if (name === "scale") { store("ariel-scale", v === "80" ? null : v); }
      if (name === "density") { store("ariel-density", v === "compact" ? "compact" : null); }
      if (name === "avatars") { store("ariel-avatars", v === "initials" ? "initials" : null); location.reload(); return; }   // avatars are drawn when a page loads
      applyLook(); refreshPop(); return;
    }
    var sw = t.closest("[data-accent]");
    if (sw) { store("ariel-accent", sw.dataset.accent); applyLook(); refreshPop(); return; }

    var d = t.closest("[data-do]");
    if (!d) { return; }
    e.preventDefault();
    var what = d.dataset.do;
    if (what === "company" || what === "look") { swapPop(what); return; }
    if (what === "theme") { store("ariel-theme", isDark() ? "light" : "dark"); applyLook(); refreshPop(); return; }
    if (what === "search") { closePop(); openPalette(); return; }
    if (what === "reset-look") { var hadInitials = store("ariel-avatars"); ["ariel-theme", "ariel-accent", "ariel-density", "ariel-lang", "ariel-scale", "ariel-avatars"].forEach(function (k) { store(k, null); }); if (hadInitials) { location.reload(); return; } applyLook(); refreshPop(); toast("Appearance reset"); }
    if (what === "clock") { toggleClock(); }
    if (what === "photo") { document.getElementById("photoFile").click(); }
    if (what === "myprofile") { closePop(); toast("Opens your employee profile (demo)"); }
    if (what === "cache") { closePop(); toast("Cache cleared"); }
    if (what === "signout") { closePop(); toast("Signed out (demo)"); }
    if (what === "readall") { document.querySelectorAll(".pop .note").forEach(function (n) { n.classList.remove("unread"); }); unread = 0; var bd = document.querySelector(".sb-bell .badge"); if (bd) { bd.remove(); } }
    if (what === "password") {
      closePop();
      var mm = openModal({ title: "Reset password", body: '<div class="form-grid"><div class="full"><label class="lbl">Current password</label><input class="input" type="password" autocomplete="current-password"></div><div><label class="lbl">New password</label><input class="input" type="password" autocomplete="new-password"></div><div><label class="lbl">Confirm password</label><input class="input" type="password" autocomplete="new-password"></div></div><p class="hint">Use at least 12 characters.</p>', foot: '<button class="btn" data-close>Cancel</button><button class="btn primary" data-close id="pw">Update password</button>' });
      mm.querySelector("#pw").addEventListener("click", function () { toast("Password updated (demo only)"); });
    }
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches("[data-lang]")) { store("ariel-lang", t.value); toast("Language set to " + t.value + " (demo)"); }
    if (t.id === "photoFile" && t.files[0]) {
      var f = t.files[0];
      if (f.size > 900000) { toast("Please choose a photo under 900 KB"); return; }
      var r = new FileReader();
      r.onload = function () { store("ariel-photo", r.result); document.getElementById("sbUser").innerHTML = userBtnHtml(); closePop(); toast("Photo updated"); };
      r.readAsDataURL(f);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closePop(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (!document.querySelector(".palette-back")) { openPalette(); } }
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyLook);

  /* clock in / out: the start time is remembered, so it survives moving between pages */
  function toggleClock() {
    if (clockStart()) { store("ariel-checkin", null); toast("Clocked out"); } else { store("ariel-checkin", String(Date.now())); toast("Clocked in"); }
    document.getElementById("sbUser").innerHTML = userBtnHtml();
    refreshPop();
  }
  setInterval(function () { [].forEach.call(document.querySelectorAll("[data-clock]"), function (c) { if (clockStart()) { c.textContent = clockText(); } }); }, 1000);

  /* command palette */
  function openPalette() {
    var all = [];
    MODULES.forEach(function (m) { m.items.forEach(function (i) { all.push({ t: i.label, g: m.label, href: i.href || "#", k: "Page" }); }); });
    DEMO.candidates.forEach(function (c) { all.push({ t: c.name, g: DEMO.job(c.job).title, href: "candidate-profile.html?id=" + c.id, k: "Candidate" }); });
    DEMO.jobs.forEach(function (j) { all.push({ t: j.title, g: j.dept, href: "pipeline.html?job=" + j.id, k: "Job" }); });
    var back = document.createElement("div"); back.className = "palette-back";
    back.innerHTML = '<div class="palette"><input placeholder="Type to search pages, candidates and jobs" aria-label="Search"><ul></ul></div>';
    document.body.appendChild(back);
    var input = back.querySelector("input"), ul = back.querySelector("ul");
    function draw() {
      var q = input.value.toLowerCase(), rows = all.filter(function (r) { return !q || (r.t + " " + r.g).toLowerCase().indexOf(q) >= 0; }).slice(0, 14);
      ul.innerHTML = rows.length ? rows.map(function (r, i) { return '<li><a href="' + r.href + '" class="' + (i === 0 ? "sel" : "") + '">' + icon(r.k === "Candidate" ? "users" : r.k === "Job" ? "briefcase" : "list") + '<span>' + r.t + '</span><small>' + r.k + " in " + r.g + '</small></a></li>'; }).join("") : '<li class="empty">Nothing matches</li>';
    }
    input.addEventListener("input", draw); draw(); input.focus();
    back.addEventListener("click", function (e) { if (e.target === back) { back.remove(); } });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { var a = ul.querySelector("a"); if (a) { go(a.getAttribute("href")); } } if (e.key === "Escape") { back.remove(); } });
  }
})();
