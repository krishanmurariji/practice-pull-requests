/* =====================================================================
   RECRUITMENT FLOW  -  one page, four steps.
     #/openings          the list of jobs (start here)
     #/create[/id]       make a new job, or edit one
     #/pipeline/id       candidates of one job, by stage
     #/interviews/id     interviews of one job
   Every step hands off to the next one. A candidate drawer (right side) lets you
   schedule an interview, add feedback and make an offer without leaving the page.
   Data is the demo data in js/data.js and lives in memory only.
   ===================================================================== */
(function () {
  var D = DEMO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ic = function (n, c) { return '<svg class="i ' + (c || "") + '" viewBox="0 0 256 256" aria-hidden="true">' + (ICONS[n] || "") + "</svg>"; };

  /* ---------- small helpers ---------- */
  var AVC = ["#0ea5e9", "#0284c7", "#0369a1", "#3b82f6", "#06b6d4", "#6366f1", "#0891b2", "#2563eb"];
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
  function ini(n) { var p = n.split(" "); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase(); }
  function av(n, c) { return '<span class="avatar ' + (c || "") + '" style="background:' + AVC[hash(n) % AVC.length] + '" title="' + esc(n) + '">' + ini(n) + "</span>"; }
  function stack(names) { return '<span class="stack">' + names.map(function (n) { return av(n, "xs"); }).join("") + "</span>"; }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function dt(iso) { return new Date(iso + "T12:00:00"); }
  function short(iso) { var d = dt(iso); return d.getDate() + " " + MON[d.getMonth()]; }
  function ago(iso) { var n = Math.round((dt(D.today) - dt(iso)) / 864e5); return n <= 0 ? "Today" : n === 1 ? "Yesterday" : n + " days ago"; }

  var ORDER = ["applied", "initial", "test", "interview", "offer", "hired"];
  var LABEL = { applied: "Applied", initial: "Screening", test: "Test", interview: "Interview", offer: "Offer", hired: "Hired", cancelled: "Rejected" };
  var COLOR = { applied: "#9db4c8", initial: "#38bdf8", test: "#60a5fa", interview: "#0ea5e9", offer: "#0369a1", hired: "#10b981", cancelled: "#f87171" };
  function sc(id) { return '<span class="sc" style="--c:' + COLOR[id] + '">' + LABEL[id] + "</span>"; }
  var J = function (id) { return D.job(+id); }, Cn = function (id) { return D.cand(+id); };
  var candsOf = function (jid) { return D.candidates.filter(function (c) { return c.job === +jid; }); };
  var ivsOf = function (jid) { return D.interviews.filter(function (i) { var c = Cn(i.cand); return c && c.job === +jid; }); };
  var ivsOfC = function (cid) { return D.interviews.filter(function (i) { return i.cand === +cid; }); };
  var firstOpen = function () { var j = D.jobs.filter(function (x) { return x.status === "open"; })[0] || D.jobs[0]; return j ? j.id : null; };
  function syncFilled(jid) { var j = J(jid); if (j) { j.filled = candsOf(jid).filter(function (c) { return c.stage === "hired"; }).length; } }

  /* ---------- state and routing ---------- */
  var STEPS = [["openings", "Openings"], ["create", "New job"], ["pipeline", "Pipeline"], ["interviews", "Interviews"]];
  var S = { view: "openings", job: null, filter: "all", q: "", itab: "upcoming", rej: false, drawer: null, idx: 0 };
  var F = null;   // the new-job form
  var DEPTS = ["Development", "Designing", "Human Resource", "Accounts", "Business Development"];
  var ROUNDS = ["Screening call", "Technical round 1", "Technical round 2", "HR round", "Final round"];

  function parse() {
    var h = location.hash.replace(/^#\/?/, "").split("/"), v = h[0], id = +h[1] || null;
    if (!STEPS.some(function (s) { return s[0] === v; })) { v = "openings"; }
    if ((v === "pipeline" || v === "interviews") && (!id || !J(id))) { id = (S.job && J(S.job)) ? S.job : firstOpen(); }
    return { view: v, job: id };
  }
  function go(view, job) { location.hash = "/" + view + (job ? "/" + job : ""); }
  function stageIdx(v) { return STEPS.map(function (s) { return s[0]; }).indexOf(v); }

  /* ---------- top thread ---------- */
  function drawThread() {
    var i = stageIdx(S.view), j = S.job ? J(S.job) : null;
    var counts = { openings: D.jobs.filter(function (x) { return x.status === "open"; }).length, create: "", pipeline: j ? candsOf(j.id).length : "", interviews: j ? ivsOf(j.id).filter(function (x) { return x.status === "Scheduled"; }).length : "" };
    $("#thread").innerHTML = '<div class="rail"><i style="width:' + (i / 3 * 100) + '%"></i></div><ol>' + STEPS.map(function (s, n) {
      var label = s[0] === "create" && S.view === "create" && F && F.id ? "Edit job" : s[1];
      return '<li><button class="node ' + (n === i ? "on" : n < i ? "done" : "") + '" data-act="step" data-v="' + s[0] + '" aria-current="' + (n === i) + '"><span class="dot">' + (n + 1) + '</span><span class="lb">' + label + (counts[s[0]] ? " <b>" + counts[s[0]] + "</b>" : "") + "</span></button></li>";
    }).join("") + "</ol>";
  }

  /* ---------- view header ---------- */
  function jobChip() {
    var j = J(S.job); if (!j) { return ""; }
    return '<div class="jobsel"><button class="jobchip" data-act="jobmenu" aria-haspopup="menu"><span class="d"></span>' + esc(j.title) + " <small>" + j.filled + "/" + j.openings + " filled</small>" + ic("down", "sm") + '</button><div class="menu" id="jobmenu" hidden>' +
      D.jobs.map(function (x) { return '<button data-act="pickjob" data-id="' + x.id + '" class="' + (x.id === j.id ? "on" : "") + '">' + esc(x.title) + "<span>" + candsOf(x.id).length + "</span></button>"; }).join("") + "</div></div>";
  }
  function head(n, title, sub, actions, chip) {
    return '<header class="vh"><div><p class="eyebrow">' + (chip || "Step " + n + " of 4") + "</p><h1>" + title + "</h1>" + (sub ? '<p class="sub">' + sub + "</p>" : "") + '</div><div class="va">' + (actions || "") + "</div></header>";
  }

  /* ---------- STEP 1: openings ---------- */
  function vOpenings() {
    var all = D.jobs, q = S.q.toLowerCase();
    var list = all.filter(function (j) { return (S.filter === "all" || j.status === S.filter) && (!q || (j.title + j.dept + j.loc + j.skills.join(" ")).toLowerCase().indexOf(q) >= 0); });
    var n = function (s) { return all.filter(function (j) { return s === "all" || j.status === s; }).length; };
    var tabs = [["all", "All"], ["open", "Open"], ["closed", "Closed"]].map(function (t) { return '<button class="' + (S.filter === t[0] ? "on" : "") + '" data-act="filter" data-f="' + t[0] + '">' + t[1] + "<sup>" + n(t[0]) + "</sup></button>"; }).join("");
    var rows = list.map(function (j, i) {
      var cs = candsOf(j.id), counts = {};
      cs.forEach(function (c) { counts[c.stage] = (counts[c.stage] || 0) + 1; });
      var bar = cs.length ? '<div class="bar">' + ORDER.concat("cancelled").filter(function (s) { return counts[s]; }).map(function (s) { return '<i style="flex:' + counts[s] + ";background:" + COLOR[s] + '" title="' + counts[s] + " " + LABEL[s] + '"></i>'; }).join("") + "</div>" : '<div class="bar none"></div>';
      return '<article class="orow ' + (j.status === "closed" ? "closed" : "") + '" style="--i:' + i + '" tabindex="0" role="link" data-act="openjob" data-id="' + j.id + '" aria-label="' + esc(j.title) + ', open pipeline">' +
        '<div class="t"><h3>' + esc(j.title) + (j.status === "closed" ? "<em>Closed</em>" : "") + "</h3><p>" + esc(j.dept) + " · " + esc(j.loc) + " · closes " + short(j.end) + "</p></div>" +
        '<div class="more"><button class="btn sm txt" data-act="editjob" data-id="' + j.id + '">' + ic("edit", "sm") + 'Edit</button><button class="btn sm txt" data-act="ivjob" data-id="' + j.id + '">' + ic("calendar", "sm") + "Interviews</button></div>" +
        '<div class="mix">' + bar + "<small>" + (cs.length ? cs.length + " candidate" + (cs.length === 1 ? "" : "s") : "No candidates yet") + "</small></div>" +
        '<div class="num"><b>' + j.filled + "</b><span>/" + j.openings + '</span></div><span class="go">' + ic("right", "sm") + "</span></article>";
    }).join("");
    return head(1, "Openings", all.filter(function (j) { return j.status === "open"; }).length + " open roles. Pick one to see its candidates.", '<button class="btn pri" data-act="newjob">' + ic("plus", "sm") + "New job</button>") +
      '<div class="tools"><div class="tabs">' + tabs + '</div><label class="find">' + ic("search", "sm") + '<input id="q" type="search" placeholder="Search" value="' + esc(S.q) + '" aria-label="Search openings"></label></div>' +
      '<div id="rows">' + (rows || '<p class="empty-line">Nothing matches. Try another word.</p>') + "</div>";
  }

  /* ---------- STEP 2: new job ---------- */
  function newForm(j) {
    return j ? { id: j.id, title: j.title, dept: j.dept, openings: j.openings, end: j.end, loc: j.loc, type: j.type, team: j.managers.slice(), skills: j.skills.slice(), desc: j.desc || "" }
      : { id: null, title: "", dept: "Development", openings: 1, end: "2026-11-30", loc: "Gurugram", type: "Full time", team: [], skills: [], desc: "" };
  }
  function vCreate() {
    var f = F, edit = !!f.id, show = f.title.trim().length >= 3 || edit;
    return head(2, edit ? "Edit job" : "New job", edit ? "Changes show up everywhere straight away." : "Start with the role. The rest appears as you go.", edit ? "" : "", edit ? jobChip() : "") +
      '<div class="make"><section><input class="big" id="title" data-f="title" placeholder="What role are you hiring for?" value="' + esc(f.title) + '" autocomplete="off" aria-label="Job title"><p class="hint">For example, Senior Django Developer</p>' +
      '<div class="rest ' + (show ? "show" : "") + '" id="rest"><div><div class="pad">' +
      '<div class="grid2"><div class="fld"><label>Department</label><select data-f="dept">' + DEPTS.map(function (d) { return "<option" + (d === f.dept ? " selected" : "") + ">" + d + "</option>"; }).join("") + "</select></div>" +
      '<div class="fld"><label>Vacancies</label><div class="step"><button data-act="vac" data-d="-1" aria-label="Fewer">−</button><b id="vac">' + f.openings + '</b><button data-act="vac" data-d="1" aria-label="More">+</button></div></div>' +
      '<div class="fld"><label>Location</label><input class="line" data-f="loc" value="' + esc(f.loc) + '"></div><div class="fld"><label>Closing date</label><input class="line" type="date" data-f="end" value="' + esc(f.end) + '"></div></div>' +
      '<div class="fld"><label>Type</label><div class="seg">' + ["Full time", "Contract", "Intern"].map(function (t) { return '<button data-act="type" data-v="' + t + '" class="' + (f.type === t ? "on" : "") + '">' + t + "</button>"; }).join("") + "</div></div>" +
      '<div class="fld"><label>Hiring team</label><div class="seg">' + D.team.map(function (m) { return '<button data-act="member" data-v="' + esc(m) + '" class="' + (f.team.indexOf(m) >= 0 ? "on" : "") + '">' + esc(m) + "</button>"; }).join("") + "</div></div>" +
      '<div class="fld"><label>Skills</label><div class="tagbox" id="tagbox">' + skillsHtml() + '</div><p class="hint">Type a skill and press Enter</p></div>' +
      '<div class="fld"><label>About the role</label><textarea data-f="desc" placeholder="What will they do? What matters most?">' + esc(f.desc) + "</textarea></div>" +
      "</div></div></div>" +
      '<div class="actions-row"><button class="btn txt" data-act="step" data-v="openings">Cancel</button><span class="sp"></span><button class="btn pri" id="publish" data-act="publish"' + (show ? "" : " disabled") + ">" + (edit ? "Save changes" : "Publish") + ' and open pipeline <span class="arr">' + ic("right", "sm") + "</span></button></div></section>" +
      '<aside class="pv"><p class="cap">Live preview</p><div class="card" id="pv"></div></aside></div>';
  }
  function skillsHtml() { return F.skills.map(function (s, i) { return '<span class="tg">' + esc(s) + '<button data-act="rmskill" data-i="' + i + '" aria-label="Remove ' + esc(s) + '">×</button></span>'; }).join("") + '<input id="skillIn" placeholder="' + (F.skills.length ? "" : "Add a skill") + '" autocomplete="off">'; }
  function drawPreview() {
    var f = F, el = $("#pv"); if (!el) { return; }
    el.innerHTML = '<h3 class="' + (f.title.trim() ? "" : "ph") + '">' + (esc(f.title.trim()) || "Your job title") + "</h3><p>" + esc(f.dept) + " · " + esc(f.loc || "Location") + " · " + esc(f.type) + "</p>" +
      '<div class="tags">' + f.skills.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + '</div><div class="meta"><span>Closes ' + (f.end ? short(f.end) : "-") + "<br>Team: " + (f.team.length ? esc(f.team.join(", ")) : "Admin User") + '</span><span><b>0</b> / ' + f.openings + "</span></div>" +
      '<p class="after">' + ic("right", "sm") + "Next, you land in its pipeline, ready for candidates.</p>";
  }

  /* ---------- STEP 3: pipeline ---------- */
  function vPipeline() {
    var j = J(S.job), cs = candsOf(j.id);
    var chip = jobChip();
    var rej = cs.filter(function (c) { return c.stage === "cancelled"; }).length;
    var acts = '<button class="btn" data-act="addcand">' + ic("plus", "sm") + 'Candidate</button><button class="btn pri" data-act="step" data-v="interviews">Interviews <span class="arr">' + ic("right", "sm") + "</span></button>";
    var sub = cs.length + " candidate" + (cs.length === 1 ? "" : "s") + " · " + j.filled + " of " + j.openings + " filled · closes " + short(j.end);
    if (!cs.length) {
      return head(3, "Pipeline", "", "", chip) + '<div class="hero-empty"><div class="ring">' + ic("users") + "</div><h2>The opening is live.</h2><p>No candidates yet. Add one, and they will appear here.</p><div class=\"va\"><button class=\"btn pri\" data-act=\"addcand\">" + ic("plus", "sm") + 'Add a candidate</button><button class="btn" data-act="copylink">' + ic("link", "sm") + "Copy public link</button></div></div>";
    }
    var stages = ORDER.concat(S.rej ? ["cancelled"] : []);
    var lanes = stages.map(function (s, i) {
      var items = cs.filter(function (c) { return c.stage === s; });
      return '<section class="lane" data-stage="' + s + '" style="--i:' + i + '"><header><i style="--c:' + COLOR[s] + '"></i>' + LABEL[s] + "<b>" + items.length + "</b></header>" +
        items.map(card).join("") + (items.length ? "" : '<div class="drop">Drop here</div>') + "</section>";
    }).join("");
    return head(3, "Pipeline", sub, acts + (rej ? '<button class="btn txt" data-act="rej">' + (S.rej ? "Hide" : "Show") + " rejected (" + rej + ")</button>" : ""), chip) + '<div class="board" id="board">' + lanes + "</div>";
  }
  function card(c) {
    var next = ORDER[ORDER.indexOf(c.stage) + 1];
    var quick = c.stage === "hired" || c.stage === "cancelled" ? "" : '<div class="qa">' + (c.stage !== "interview" && c.stage !== "offer" ? '<button data-act="schedule" data-id="' + c.id + '" title="Schedule interview" aria-label="Schedule interview">' + ic("calendar", "sm") + "</button>" : "") +
      (next ? '<button data-act="advance" data-id="' + c.id + '" title="Move to ' + LABEL[next] + '" aria-label="Move to ' + LABEL[next] + '">' + ic("right", "sm") + "</button>" : "") + "</div>";
    return '<div class="pc" draggable="true" tabindex="0" data-act="card" data-id="' + c.id + '"><div class="r1">' + av(c.name) + "<div><b>" + esc(c.name) + "</b><small>" + c.exp + " yrs · " + esc(c.loc) + '</small></div><span class="ai" title="AI match">' + c.ai + "</span></div>" + quick + "</div>";
  }

  /* ---------- STEP 4: interviews ---------- */
  function vInterviews() {
    var j = J(S.job), all = ivsOf(j.id), tab = S.itab;
    var sets = { upcoming: all.filter(function (i) { return i.status === "Scheduled"; }), feedback: all.filter(function (i) { return i.status === "Feedback pending"; }), done: all.filter(function (i) { return i.status === "Completed" || i.status === "Cancelled"; }) };
    var tabs = [["upcoming", "Upcoming"], ["feedback", "Needs feedback"], ["done", "Done"]].map(function (t) { return '<button class="' + (tab === t[0] ? "on" : "") + '" data-act="itab" data-t="' + t[0] + '">' + t[1] + "<sup>" + sets[t[0]].length + "</sup></button>"; }).join("");
    var ready = candsOf(j.id).filter(function (c) { return (c.stage === "initial" || c.stage === "test") && !ivsOfC(c.id).some(function (i) { return i.status === "Scheduled"; }); });
    var strip = ready.length ? '<div class="ready"><span class="lab">Ready to schedule</span>' + ready.map(function (c) { return '<button data-act="schedule" data-id="' + c.id + '">' + av(c.name) + esc(c.name.split(" ")[0]) + ic("plus", "sm") + "</button>"; }).join("") + "</div>" : "";
    var list = sets[tab].slice().sort(function (a, b) { var k = (a.date + a.time) < (b.date + b.time) ? -1 : 1; return tab === "done" ? -k : k; });
    var days = []; list.forEach(function (i) { var d = days[days.length - 1]; if (d && d.date === i.date) { d.items.push(i); } else { days.push({ date: i.date, items: [i] }); } });
    var body = days.map(function (d, n) {
      var x = dt(d.date);
      return '<section class="day" style="--i:' + n + '"><div class="dd"><b>' + x.getDate() + "</b><span>" + WD[x.getDay()] + " " + MON[x.getMonth()] + "</span>" + (d.date === D.today ? "<br><em>Today</em>" : "") + "</div><div>" + d.items.map(ivRow).join("") + "</div></section>";
    }).join("") || '<p class="empty-line">' + (tab === "upcoming" ? "Nothing scheduled. Pick someone above, or from the pipeline." : tab === "feedback" ? "All feedback is in." : "No past interviews yet.") + "</p>";
    return head(4, "Interviews", sets.upcoming.length + " upcoming · " + sets.feedback.length + " waiting for feedback", '<button class="btn" data-act="step" data-v="pipeline">' + ic("left", "sm") + 'Pipeline</button>', jobChip()) +
      strip + '<div class="tools" style="margin-bottom:1rem"><div class="tabs">' + tabs + "</div></div>" + body;
  }
  function ivRow(i) {
    var c = Cn(i.cand), pend = i.status === "Feedback pending", sched = i.status === "Scheduled";
    var act = pend || sched ? '<button class="btn sm pri" data-act="feedback" data-iv="' + i.id + '">Add feedback</button>' : "";
    var tag = pend ? '<span class="tag">Feedback due</span>' : i.status === "Completed" ? '<span class="tag ok">' + (i.verdict || "Done") + "</span>" : i.status === "Cancelled" ? '<span class="tag no">Cancelled</span>' : "";
    return '<div class="iv"><div class="tm"><b>' + i.time + "</b><small>" + i.dur + '</small></div><div class="wh" data-act="card" data-id="' + c.id + '">' + av(c.name) + "<div><b>" + esc(c.name) + "</b><small>" + (i.mode === "Video call" ? ic("video") : "") + esc(i.round) + " · " + esc(i.mode) + '</small></div></div><div class="ia">' + stack(i.who) + tag + act + "</div></div>";
  }

  /* ---------- drawer ---------- */
  function drawDrawer() {
    var d = S.drawer, el = $("#drawer");
    $("#scrim").classList.toggle("open", !!d); el.classList.toggle("open", !!d);
    if (!d) { return; }
    el.innerHTML = '<button class="dx" data-act="close" aria-label="Close">' + ic("x") + "</button>" + drawerHtml(d);
    var f = el.querySelector("[autofocus]"); if (f) { setTimeout(function () { f.focus(); }, 380); }
  }
  function drawerHtml(d) {
    var c = d.cand ? Cn(d.cand) : null;
    if (d.mode === "done") {
      return '<div class="dbody"><div class="done-box"><div class="ring">' + ic("check") + "</div><h2>" + d.title + "</h2><p>" + d.text + '</p></div></div><div class="dfoot">' + d.links.map(function (l, n) { return '<button class="btn ' + (n === 0 ? "pri" : "") + '" data-act="' + l.act + '" ' + (l.attrs || "") + ">" + l.label + "</button>"; }).join("") + "</div>";
    }
    if (d.mode === "add") {
      return '<div class="dbody dform"><div class="dhead"><div><h2>Add a candidate</h2><p>to ' + esc(J(S.job).title) + '</p></div></div><div class="fld"><label class="lab">Full name</label><input data-df="name" value="' + esc(d.f.name) + '" autofocus placeholder="Name"></div>' +
        '<div class="fld"><label class="lab">Email</label><input data-df="email" type="email" value="' + esc(d.f.email) + '" placeholder="name@mail.com"></div><div class="fld"><label class="lab">Source</label><select data-df="source">' + ["Website", "LinkedIn", "Naukri", "Referral", "Email"].map(function (s) { return "<option" + (s === d.f.source ? " selected" : "") + ">" + s + "</option>"; }).join("") + '</select></div>' +
        '<div class="fld"><label class="lab">Resume</label><input type="file"></div></div><div class="dfoot"><button class="btn pri" data-act="savecand">Add to pipeline</button></div>';
    }
    if (d.mode === "schedule") {
      var f = d.f;
      return '<div class="dbody dform"><div class="dhead">' + av(c.name, "lg") + "<div><h2>Schedule interview</h2><p>" + esc(c.name) + " · " + esc(J(c.job).title) + '</p></div></div>' +
        '<div class="fld"><label class="lab">Round</label><select data-df="round">' + ROUNDS.map(function (r) { return "<option" + (r === f.round ? " selected" : "") + ">" + r + "</option>"; }).join("") + "</select></div>" +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem"><div class="fld"><label class="lab">Date</label><input data-df="date" type="date" value="' + f.date + '"></div><div class="fld"><label class="lab">Time</label><input data-df="time" type="time" value="' + f.time + '"></div><div class="fld"><label class="lab">Length</label><select data-df="dur">' + ["30 min", "45 min", "60 min"].map(function (x) { return "<option" + (x === f.dur ? " selected" : "") + ">" + x + "</option>"; }).join("") + "</select></div></div>" +
        '<div class="fld"><label class="lab">Mode</label><div class="seg">' + ["Video call", "On-site", "Phone"].map(function (m) { return '<button data-act="dset" data-k="mode" data-v="' + m + '" class="' + (f.mode === m ? "on" : "") + '">' + m + "</button>"; }).join("") + "</div></div>" +
        '<div class="fld"><label class="lab">Interviewers</label><div class="seg">' + D.team.map(function (m) { return '<button data-act="dwho" data-v="' + esc(m) + '" class="' + (f.who.indexOf(m) >= 0 ? "on" : "") + '">' + esc(m) + "</button>"; }).join("") + '</div></div></div>' +
        '<div class="dfoot"><button class="btn pri" data-act="savesched">Send invite <span class="arr">' + ic("right", "sm") + '</span></button><div class="row2"><button class="btn txt sm" data-act="back">Back</button></div></div>';
    }
    if (d.mode === "feedback") {
      var iv = D.interviews.filter(function (x) { return x.id === d.iv; })[0], g = d.f;
      return '<div class="dbody dform"><div class="dhead">' + av(c.name, "lg") + "<div><h2>Feedback</h2><p>" + esc(c.name) + " · " + esc(iv.round) + '</p></div></div>' +
        '<div class="fld"><label class="lab">How did it go?</label><div class="rate">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="dset" data-k="rating" data-v="' + n + '" class="' + (g.rating >= n ? "on" : "") + '" aria-label="' + n + ' stars">' + ic("starFill") + "</button>"; }).join("") + "</div></div>" +
        '<div class="fld"><label class="lab">Decision</label><div class="seg">' + [["forward", "Move forward"], ["hold", "Hold"], ["reject", "Reject"]].map(function (v) { return '<button data-act="dset" data-k="verdict" data-v="' + v[0] + '" class="' + (g.verdict === v[0] ? "on" : "") + '">' + v[1] + "</button>"; }).join("") + "</div></div>" +
        '<div class="fld"><label class="lab">Notes</label><textarea data-df="note" placeholder="Strengths, concerns, anything the next person should know">' + esc(g.note) + '</textarea></div></div><div class="dfoot"><button class="btn pri" data-act="savefb"' + (g.verdict && g.rating ? "" : " disabled") + '>Save feedback</button><div class="row2"><button class="btn txt sm" data-act="back">Back</button></div></div>';
    }
    /* view */
    var iv = ivsOfC(c.id).sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? 1 : -1; });
    var idx = ORDER.indexOf(c.stage);
    var track = ORDER.map(function (s, n) { return '<button data-act="setstage" data-id="' + c.id + '" data-s="' + s + '" class="' + (c.stage === s ? "on" : idx >= 0 && n < idx ? "done" : "") + '">' + LABEL[s] + "</button>"; }).join("");
    var open = iv.filter(function (i) { return i.status === "Scheduled" || i.status === "Feedback pending"; })[0];
    var cta = "", sec = "";
    if (c.stage === "cancelled") { cta = '<button class="btn pri" data-act="setstage" data-id="' + c.id + '" data-s="applied">Reopen candidate</button>'; }
    else if (c.stage === "hired") { cta = '<button class="btn" data-act="step" data-v="pipeline">Back to pipeline</button>'; }
    else if (c.stage === "offer") { cta = '<button class="btn pri" data-act="setstage" data-id="' + c.id + '" data-s="hired">Mark as hired</button>'; }
    else if (open) { cta = '<button class="btn pri" data-act="feedback" data-iv="' + open.id + '">Add feedback</button>'; }
    else { cta = '<button class="btn pri" data-act="schedule" data-id="' + c.id + '">Schedule interview <span class="arr">' + ic("right", "sm") + "</span></button>"; }
    if (c.stage !== "hired" && c.stage !== "cancelled" && c.stage !== "offer" && !open && ORDER[idx + 1] && ORDER[idx + 1] !== "interview") { sec = '<button class="btn" data-act="advance" data-id="' + c.id + '">Move to ' + LABEL[ORDER[idx + 1]] + "</button>"; }
    return '<div class="dbody"><div class="dhead">' + av(c.name, "lg") + "<div><h2>" + esc(c.name) + "</h2><p>" + esc(J(c.job).title) + "</p></div></div>" +
      '<div class="track">' + (c.stage === "cancelled" ? '<span class="sc" style="--c:' + COLOR.cancelled + '">Rejected</span>' : track) + "</div>" +
      '<div class="sec"><label class="lab">Rating</label><div class="rate">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="rate" data-id="' + c.id + '" data-n="' + n + '" class="' + (c.rating >= n ? "on" : "") + '" aria-label="' + n + ' stars">' + ic("starFill") + "</button>"; }).join("") + "</div></div>" +
      (iv.length ? '<div class="sec"><label class="lab">Interviews</label>' + iv.map(function (i) { return '<div class="mini"><div class="g"><b>' + esc(i.round) + "</b><small>" + short(i.date) + " · " + i.time + " · " + i.status + '</small></div><button class="lnk" data-act="ivjob" data-id="' + c.job + '">View</button></div>'; }).join("") + "</div>" : "") +
      '<dl class="facts"><dt>Email</dt><dd>' + esc(c.email) + "</dd><dt>Phone</dt><dd>" + esc(c.phone) + "</dd><dt>Location</dt><dd>" + esc(c.loc) + "</dd><dt>Experience</dt><dd>" + c.exp + " yrs · notice " + esc(c.notice) + "</dd><dt>Source</dt><dd>" + esc(c.source) + " · " + ago(c.applied) + "</dd><dt>AI match</dt><dd>" + c.ai + " of 100</dd></dl>" +
      '<div class="chips">' + c.skills.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div></div>" +
      '<div class="dfoot">' + cta + sec + (c.stage !== "cancelled" && c.stage !== "hired" ? '<div class="row2"><button class="btn txt sm danger" data-act="reject" data-id="' + c.id + '">Reject</button></div>' : "") + "</div>";
  }
  function openDrawer(d) { S.drawer = d; drawDrawer(); }
  function closeDrawer() { S.drawer = null; drawDrawer(); }
  function sched(cid) {
    var c = Cn(cid), j = J(c.job);
    S.drawer = { mode: "schedule", cand: c.id, f: { round: c.stage === "interview" ? "Technical round 2" : c.stage === "test" ? "Technical round 1" : "Screening call", date: "2026-10-12", time: "11:00", dur: "45 min", mode: "Video call", who: j.managers.slice(0, 2) } };
    drawDrawer();
  }

  /* ---------- toast ---------- */
  function toast(msg, label, fn) {
    var t = document.createElement("div"); t.className = "toast"; t.innerHTML = "<span>" + msg + "</span>";
    if (label) { var b = document.createElement("button"); b.textContent = label; b.onclick = function () { t.remove(); fn(); }; t.appendChild(b); }
    $("#toasts").appendChild(t); setTimeout(function () { t.remove(); }, label ? 6000 : 2600);
  }

  /* ---------- rendering ---------- */
  function render() {
    var r = parse(), prev = S.idx;
    S.view = r.view; if (r.job) { S.job = r.job; }
    if (S.view !== "create") { F = null; } else if (!F) { F = newForm(r.job ? J(r.job) : null); }
    if (S.view === "create" && r.job && F && F.id !== r.job) { F = newForm(J(r.job)); }
    S.idx = stageIdx(S.view);
    var html = { openings: vOpenings, create: vCreate, pipeline: vPipeline, interviews: vInterviews }[S.view]();
    var st = $("#stage"); st.classList.toggle("wide", S.view === "pipeline"); st.innerHTML = '<div class="view ' + (S.idx < prev ? "back" : "") + '">' + html + "</div>";
    drawThread();
    if (S.view === "create") { drawPreview(); }
    document.title = { openings: "Openings", create: "New job", pipeline: "Pipeline", interviews: "Interviews" }[S.view] + " · Recruitment";
  }
  /* redraw the current step without the slide animation (after a small change) */
  function refresh() {
    var r = parse(); S.view = r.view;
    var html = { openings: vOpenings, create: vCreate, pipeline: vPipeline, interviews: vInterviews }[S.view]();
    var v = $("#stage .view"); if (v) { v.innerHTML = html; v.style.animation = "none"; }
    drawThread(); if (S.view === "create") { drawPreview(); }
  }

  /* ---------- actions ---------- */
  function setStage(cid, to, quiet) {
    var c = Cn(cid), from = c.stage; if (from === to) { return; }
    c.stage = to; syncFilled(c.job);
    if (!quiet) { toast(esc(c.name.split(" ")[0]) + " moved to " + LABEL[to] + (to === "hired" ? ". Opening filled " + J(c.job).filled + "/" + J(c.job).openings + "." : "")); }
  }
  function afterChange() { refresh(); if (S.drawer) { drawDrawer(); } }

  var A = {
    step: function (a) { var v = a.dataset.v; closeDrawer(); if (v === "create") { F = null; go("create"); } else if (v === "pipeline" || v === "interviews") { go(v, S.job || firstOpen()); } else { go(v); } },
    openjob: function (a) { go("pipeline", a.dataset.id); },
    editjob: function (a, e) { e.stopPropagation(); F = null; go("create", a.dataset.id); },
    ivjob: function (a, e) { e.stopPropagation(); closeDrawer(); go("interviews", a.dataset.id); },
    newjob: function () { F = null; go("create"); },
    filter: function (a) { S.filter = a.dataset.f; refresh(); },
    itab: function (a) { S.itab = a.dataset.t; refresh(); },
    rej: function () { S.rej = !S.rej; refresh(); },
    jobmenu: function (a, e) { e.stopPropagation(); var m = $("#jobmenu"); m.hidden = !m.hidden; },
    pickjob: function (a) { var v = S.view === "interviews" ? "interviews" : S.view === "create" ? "create" : "pipeline"; go(v, a.dataset.id); },
    copylink: function () { toast("Public link copied"); },
    /* the job form */
    vac: function (a) { F.openings = Math.max(1, F.openings + +a.dataset.d); $("#vac").textContent = F.openings; drawPreview(); },
    type: function (a) { F.type = a.dataset.v; [].forEach.call(a.parentNode.children, function (b) { b.classList.toggle("on", b === a); }); drawPreview(); },
    member: function (a) { var i = F.team.indexOf(a.dataset.v); if (i >= 0) { F.team.splice(i, 1); } else { F.team.push(a.dataset.v); } a.classList.toggle("on"); drawPreview(); },
    rmskill: function (a) { F.skills.splice(+a.dataset.i, 1); $("#tagbox").innerHTML = skillsHtml(); $("#skillIn").focus(); drawPreview(); },
    publish: function () {
      var f = F, title = f.title.trim(); if (title.length < 3) { return; }
      var team = f.team.length ? f.team : ["Admin User"], id;
      if (f.id) { var j = J(f.id); j.title = title; j.dept = f.dept; j.openings = Math.max(f.openings, j.filled); j.end = f.end || j.end; j.loc = f.loc; j.type = f.type; j.managers = team; j.skills = f.skills; j.desc = f.desc; id = j.id; toast("Saved " + esc(title)); }
      else { id = Math.max.apply(null, D.jobs.map(function (x) { return x.id; })) + 1; D.jobs.unshift({ id: id, title: title, dept: f.dept, openings: f.openings, filled: 0, loc: f.loc, type: f.type, exp: "Not set", managers: team, start: D.today, end: f.end || "2026-11-30", status: "open", skills: f.skills, salary: "Not set", desc: f.desc }); toast(esc(title) + " is live"); }
      F = null; go("pipeline", id);
    },
    /* candidates */
    card: function (a, e) { if (e.target.closest(".qa")) { return; } openDrawer({ mode: "view", cand: +a.dataset.id }); },
    addcand: function () { openDrawer({ mode: "add", f: { name: "", email: "", source: "Website" } }); },
    savecand: function () {
      var f = S.drawer.f; if (!f.name.trim()) { toast("Please enter a name"); return; }
      var id = Math.max.apply(null, D.candidates.map(function (c) { return c.id; })) + 1;
      D.candidates.push({ id: id, name: f.name.trim(), email: f.email || "not.set@mail.com", phone: "Not set", job: S.job, stage: "applied", source: f.source, applied: D.today, rating: 0, ai: 70, exp: 0, loc: "Not set", notice: "Not set", ctc: "Not set", skills: [] });
      refresh(); openDrawer({ mode: "done", cand: id, title: "Added", text: esc(f.name.trim()) + " is in the Applied column.", links: [{ act: "card", label: "Open candidate", attrs: 'data-id="' + id + '"' }, { act: "close", label: "Back to pipeline" }] });
    },
    advance: function (a, e) {
      e.stopPropagation(); var c = Cn(a.dataset.id), next = ORDER[ORDER.indexOf(c.stage) + 1]; if (!next) { return; }
      if (next === "interview") { sched(c.id); return; }
      setStage(c.id, next); afterChange();
    },
    setstage: function (a) { var to = a.dataset.s; if (to === "interview" && !ivsOfC(a.dataset.id).some(function (i) { return i.status === "Scheduled"; })) { sched(a.dataset.id); return; } setStage(a.dataset.id, to); afterChange(); },
    reject: function (a) { setStage(a.dataset.id, "cancelled"); closeDrawer(); refresh(); },
    rate: function (a) { var c = Cn(a.dataset.id); c.rating = c.rating === +a.dataset.n ? 0 : +a.dataset.n; drawDrawer(); },
    /* interviews */
    schedule: function (a, e) { e.stopPropagation(); sched(a.dataset.id); },
    dset: function (a) { S.drawer.f[a.dataset.k] = a.dataset.k === "rating" ? +a.dataset.v : a.dataset.v; drawDrawer(); },
    dwho: function (a) { var w = S.drawer.f.who, i = w.indexOf(a.dataset.v); if (i >= 0) { w.splice(i, 1); } else { w.push(a.dataset.v); } drawDrawer(); },
    savesched: function () {
      var d = S.drawer, f = d.f, c = Cn(d.cand);
      if (!f.who.length) { toast("Pick at least one interviewer"); return; }
      var id = Math.max.apply(null, D.interviews.map(function (i) { return i.id; })) + 1;
      D.interviews.push({ id: id, cand: c.id, round: f.round, date: f.date, time: f.time, dur: f.dur, mode: f.mode, who: f.who.slice(), status: "Scheduled" });
      setStage(c.id, "interview", true); S.itab = "upcoming"; refresh();
      openDrawer({ mode: "done", cand: c.id, title: "Invite sent", text: esc(c.name) + " · " + esc(f.round) + "<br>" + WD[dt(f.date).getDay()] + " " + short(f.date) + " at " + f.time, links: [{ act: "ivjob", label: "See it in Interviews", attrs: 'data-id="' + c.job + '"' }, { act: "close", label: "Stay in pipeline" }] });
    },
    feedback: function (a, e) { e.stopPropagation(); var iv = D.interviews.filter(function (i) { return i.id === +a.dataset.iv; })[0]; openDrawer({ mode: "feedback", cand: iv.cand, iv: iv.id, f: { rating: 0, verdict: "", note: "" } }); },
    savefb: function () {
      var d = S.drawer, g = d.f, iv = D.interviews.filter(function (i) { return i.id === d.iv; })[0], c = Cn(iv.cand);
      iv.status = "Completed"; iv.verdict = { forward: "Moved forward", hold: "On hold", reject: "Rejected" }[g.verdict]; if (g.rating) { c.rating = g.rating; }
      var links, title, text;
      if (g.verdict === "forward") { setStage(c.id, "offer", true); title = "Moved to Offer"; text = esc(c.name) + " passed this round."; links = [{ act: "step", label: "Open pipeline", attrs: 'data-v="pipeline"' }, { act: "close", label: "Stay here" }]; }
      else if (g.verdict === "reject") { setStage(c.id, "cancelled", true); title = "Marked as rejected"; text = esc(c.name) + " is out of the running."; links = [{ act: "close", label: "Done" }]; }
      else { title = "Feedback saved"; text = esc(c.name) + " stays in " + LABEL[c.stage] + "."; links = [{ act: "close", label: "Done" }]; }
      S.itab = "feedback"; refresh(); openDrawer({ mode: "done", cand: c.id, title: title, text: text, links: links });
    },
    back: function () { var c = S.drawer.cand; openDrawer({ mode: "view", cand: c }); },
    close: function () { closeDrawer(); }
  };

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-act]");
    if (!e.target.closest(".jobsel")) { var m = $("#jobmenu"); if (m) { m.hidden = true; } }
    if (!a) { return; }
    if (a.id === "scrim" && e.target !== a) { return; }
    var fn = A[a.dataset.act]; if (fn) { fn(a, e); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (S.drawer) { closeDrawer(); } var m = $("#jobmenu"); if (m) { m.hidden = true; } return; }
    if (e.key === "Enter" && e.target.matches && e.target.matches(".orow, .pc")) { e.target.click(); return; }
    if ((e.key === "Enter" || e.key === ",") && e.target.id === "skillIn") {
      e.preventDefault(); var v = e.target.value.trim(); if (v && F.skills.indexOf(v) < 0) { F.skills.push(v); $("#tagbox").innerHTML = skillsHtml(); $("#skillIn").focus(); drawPreview(); }
    }
    if (e.key === "Backspace" && e.target.id === "skillIn" && !e.target.value && F.skills.length) { F.skills.pop(); $("#tagbox").innerHTML = skillsHtml(); $("#skillIn").focus(); drawPreview(); }
  });
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.id === "q") { S.q = t.value; var rows = $("#rows"); var keep = t.selectionStart; refresh(); var q = $("#q"); q.focus(); q.setSelectionRange(keep, keep); return; }
    if (t.dataset.f && F) {
      F[t.dataset.f] = t.value; drawPreview();
      if (t.dataset.f === "title") { var ok = F.title.trim().length >= 3; $("#rest").classList.toggle("show", ok || !!F.id); $("#publish").disabled = !ok; }
    }
    if (t.dataset.df && S.drawer) { S.drawer.f[t.dataset.df] = t.value; }
  });
  document.addEventListener("change", function (e) { var t = e.target; if (t.dataset.df && S.drawer) { S.drawer.f[t.dataset.df] = t.value; } });

  /* drag and drop between columns */
  var dragId = null;
  document.addEventListener("dragstart", function (e) { var k = e.target.closest && e.target.closest(".pc"); if (!k) { return; } dragId = +k.dataset.id; k.classList.add("drag"); e.dataTransfer.setData("text/plain", dragId); });
  document.addEventListener("dragend", function () { dragId = null; var b = $("#board"); if (b) { refresh(); } });
  document.addEventListener("dragover", function (e) { var l = e.target.closest && e.target.closest(".lane"); if (l && dragId) { e.preventDefault(); [].forEach.call(document.querySelectorAll(".lane"), function (x) { x.classList.toggle("over", x === l); }); } });
  document.addEventListener("drop", function (e) {
    var l = e.target.closest && e.target.closest(".lane"); if (!l || !dragId) { return; }
    e.preventDefault(); var id = dragId, to = l.dataset.stage; dragId = null;
    if (to === "interview" && !ivsOfC(id).some(function (i) { return i.status === "Scheduled"; }) && Cn(id).stage !== "interview") { refresh(); sched(id); return; }
    setStage(id, to); refresh();
  });

  window.addEventListener("hashchange", function () { closeDrawer(); render(); window.scrollTo(0, 0); });
  render();
})();
