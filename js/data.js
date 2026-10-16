/* =====================================================================
   DATA  -  the whole menu and all demo records live here.
   Edit MODULES to change the navigation. Edit DEMO to change sample data.
   Pages never hard-code names, they read from these two objects.
   ===================================================================== */

/* ---- NAVIGATION -------------------------------------------------------
   Every module and submenu of the current Ariel HR app is kept.
   `href` is the page that exists in this prototype; items without an href
   show as "not designed yet" and do nothing.                               */
var MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "index.html", items: [] },
  { id: "employee", label: "Employee", icon: "users", items: [
    { label: "My Dashboard" }, { label: "Employees" }, { label: "Organization Chart" },
    { label: "Work Structure" }, { label: "Work Requests" }, { label: "Work Schedules" }, { label: "Policies & Discipline" } ] },
  { id: "attendance", label: "Attendance", icon: "clock", items: [
    { label: "Dashboard" }, { label: "Biometric Devices" }, { label: "My Attendances" }, { label: "Attendances" },
    { label: "Attendance Requests" }, { label: "Hour Account" }, { label: "Work Records" },
    { label: "Attendance Activities" }, { label: "Late Come Early Out" } ] },
  { id: "leave", label: "Leave", icon: "calendar", items: [
    { label: "Dashboard" }, { label: "My Leave Requests" }, { label: "Compensatory Leave Requests" }, { label: "Leave Requests" },
    { label: "Leave Allocation Request" }, { label: "Assigned Leave" }, { label: "Leave Types" },
    { label: "Holidays" }, { label: "Company Leaves" } ] },
  { id: "payroll", label: "Payroll", icon: "wallet", items: [
    { label: "Dashboard" }, { label: "Payslips" }, { label: "Allowances" }, { label: "Deductions" },
    { label: "Loan / Advanced Salary" }, { label: "Encashments & Reimbursements" }, { label: "Contract" }, { label: "Federal Tax" } ] },
  { id: "payroll-pro", label: "Payroll Pro", icon: "coins", items: [
    { label: "Tax Regime" }, { label: "Salary Structure" }, { label: "Salary Overview" },
    { label: "Pay Revisions" }, { label: "Run Payroll" }, { label: "My Finance" } ] },
  { id: "recruitment", label: "Recruitment", icon: "briefcase", items: [
    { id: "dashboard",      label: "Dashboard",                 href: "recruitment-dashboard.html" },
    { id: "job-openings",   label: "Job Openings",              href: "job-openings.html", count: 7 },
    { id: "open-jobs",      label: "Open Jobs",                 href: "open-jobs.html" },
    { id: "candidates",     label: "Candidates",                href: "candidates.html", count: 24 },
    { id: "interviews",     label: "Interview",                 href: "interviews.html", count: 8 },
    { id: "pipeline",       label: "Recruitment Pipeline",      href: "pipeline.html" },
    { id: "survey",         label: "Recruitment Survey",        href: "survey.html" }
    /* hidden for now:
    { id: "stages",         label: "Stages",                    href: "stages.html" },
    { id: "skill-zone",     label: "Skill Zone",                href: "skill-zone.html" },
    { id: "email-apps",     label: "Email Applications",        href: "email-applications.html", count: 3 },
    { id: "intake-mailbox", label: "Candidate Intake Mailbox",  href: "intake-mailbox.html" },
    */
    ] },
  { id: "onboarding", label: "Onboarding", icon: "userplus", items: [
    { label: "Dashboard" }, { label: "My Tasks" }, { label: "Candidates" }, { label: "Task Templates" } ] },
  { id: "offboarding", label: "Offboarding", icon: "logout", items: [
    { label: "Dashboard" }, { label: "Resignation Letters" }, { label: "Exit Process" },
    { label: "My Exit Tasks" }, { label: "My Exit Survey" } ] },
  { id: "performance", label: "Performance", icon: "trending", items: [
    { label: "Dashboard" }, { label: "Objectives" }, { label: "Key Results" }, { label: "360 Feedback" },
    { label: "Meetings" }, { label: "Bonus Points" }, { label: "Objective Template" },
    { label: "Question Template" }, { label: "Period" } ] },
  { id: "project", label: "Project", icon: "layers", items: [
    { label: "Dashboard" }, { label: "Projects" }, { label: "Tasks" }, { label: "Timesheet" } ] },
  { id: "assets", label: "Assets", icon: "laptop", items: [
    { label: "Dashboard" }, { label: "Assets" }, { label: "Asset Batches" },
    { label: "Requests & Allocation" }, { label: "Asset History" } ] },
  { id: "helpdesk", label: "Helpdesk", icon: "lifebuoy", items: [
    { label: "Dashboard" }, { label: "Tickets" }, { label: "FAQs" } ] },
  { id: "reports", label: "Reports", icon: "chart", items: [
    { label: "Recruitment" }, { label: "Employee" }, { label: "Attendance" }, { label: "Leave" },
    { label: "Payroll" }, { label: "Asset" }, { label: "Performance" } ] }
];

/* ---- DEMO RECORDS ---------------------------------------------------- */
var DEMO = {
  today: "2026-10-09",
  company: { name: "Ariel Software Solutions Pvt Ltd", short: "Ariel Software", scope: "Selected company" },
  me: { name: "Admin User", role: "HR Administrator", photo: null /* put an image path here to show a photo instead of initials */ },

  team: ["Sonali Thakur", "Krishan Murari", "Aman Verma", "Priya Nair", "Rohit Sharma", "Admin User"],

  stages: [
    { id: "applied",   label: "Applied",   color: "#8593a4" },
    { id: "initial",   label: "Initial",   color: "#1597e5" },
    { id: "test",      label: "Test",      color: "#6552d0" },
    { id: "interview", label: "Interview", color: "#e08a1e" },
    { id: "offer",     label: "Offer",     color: "#0f8f8f" },
    { id: "hired",     label: "Hired",     color: "#1a8f5a" },
    { id: "cancelled", label: "Cancelled", color: "#cf3d2c" }
  ],

  jobs: [
    { id: 1, title: "Senior Django Developer", dept: "Development", openings: 3, filled: 1, loc: "Gurugram, Hybrid", type: "Full time", exp: "4-7 yrs", managers: ["Sonali Thakur", "Aman Verma"], start: "2026-09-01", end: "2026-11-15", status: "open", skills: ["Python", "Django", "PostgreSQL", "REST"], salary: "14 - 22 LPA", desc: "Own the design and delivery of our core HR platform services. You will build APIs and background jobs in Django, review code, and mentor two junior developers. Strong PostgreSQL and testing habits matter more than any single framework." },
    { id: 2, title: "UI/UX Designer", dept: "Designing", openings: 1, filled: 0, loc: "Remote", type: "Full time", exp: "2-4 yrs", managers: ["Priya Nair"], start: "2026-09-12", end: "2026-10-30", status: "open", skills: ["Figma", "Design systems", "Prototyping"], salary: "8 - 12 LPA", desc: "Shape the look and feel of our HR products from first sketch to shipped screens. You will keep the design system consistent, run quick usability sessions, and work closely with developers during build." },
    { id: 3, title: "QA Engineer", dept: "Development", openings: 2, filled: 1, loc: "Gurugram", type: "Full time", exp: "2-5 yrs", managers: ["Aman Verma"], start: "2026-08-20", end: "2026-10-20", status: "open", skills: ["Selenium", "API testing", "Test plans"], salary: "6 - 10 LPA", desc: "Plan and run manual and automated tests for every release. You will write test plans, automate the API and UI checks that matter, and help the team catch problems before customers do." },
    { id: 4, title: "HR Executive", dept: "Human Resource", openings: 1, filled: 0, loc: "Gurugram", type: "Full time", exp: "1-3 yrs", managers: ["Krishan Murari"], start: "2026-09-25", end: "2026-11-05", status: "open", skills: ["Recruitment", "HRIS", "Communication"], salary: "4 - 6 LPA", desc: "Support hiring and employee onboarding end to end. You will screen candidates, coordinate interviews, keep records tidy in our HR system, and be the first friendly face for new joiners." },
    { id: 5, title: "DevOps Engineer", dept: "Development", openings: 1, filled: 0, loc: "Remote", type: "Contract", exp: "3-6 yrs", managers: ["Rohit Sharma"], start: "2026-10-01", end: "2026-12-01", status: "open", skills: ["AWS", "Docker", "CI/CD", "Linux"], salary: "12 - 18 LPA", desc: "Keep our environments fast, secure and repeatable. You will manage cloud infrastructure, containers and deployment pipelines, and set up monitoring so problems are found early." },
    { id: 6, title: "Business Analyst", dept: "Business Development", openings: 2, filled: 2, loc: "Gurugram", type: "Full time", exp: "3-5 yrs", managers: ["Sonali Thakur"], start: "2026-07-10", end: "2026-09-30", status: "closed", skills: ["Requirements", "SQL", "Stakeholders"], salary: "9 - 14 LPA", desc: "Turn business needs into clear requirements for the product team. You will talk to stakeholders, write user stories, analyse data with SQL, and check that what ships solves the problem." },
    { id: 7, title: "Accounts Executive", dept: "Accounts", openings: 1, filled: 0, loc: "Gurugram", type: "Full time", exp: "1-4 yrs", managers: ["Admin User"], start: "2026-10-05", end: "2026-11-30", status: "open", skills: ["Tally", "GST", "Reconciliation"], salary: "3.5 - 5.5 LPA", desc: "Run day-to-day accounting for the company. You will handle invoices, GST filing, bank reconciliation and month-end close, and keep our books ready for audit." }
  ],

  /* stage = id from `stages`; job = id from `jobs`; ai = 0-100 resume match score */
  candidates: [
    { id: 1,  name: "Ishaan Malhotra", email: "ishaan.malhotra@mail.com", phone: "+91 98100 22411", job: 1, stage: "interview", source: "LinkedIn", applied: "2026-09-18", rating: 4, ai: 91, exp: 6, loc: "Noida", notice: "30 days", ctc: "17 LPA", skills: ["Python", "Django", "PostgreSQL", "Celery"] },
    { id: 2,  name: "Ananya Krishnan", email: "ananya.k@mail.com", phone: "+91 98730 11872", job: 1, stage: "test", source: "Naukri", applied: "2026-09-24", rating: 3, ai: 84, exp: 5, loc: "Gurugram", notice: "60 days", ctc: "18 LPA", skills: ["Python", "Django", "REST", "Redis"] },
    { id: 3,  name: "Rahul Bhatia", email: "rahul.bhatia@mail.com", phone: "+91 99112 70345", job: 1, stage: "offer", source: "Referral", applied: "2026-09-10", rating: 5, ai: 95, exp: 7, loc: "Delhi", notice: "45 days", ctc: "21 LPA", skills: ["Python", "Django", "AWS", "PostgreSQL"] },
    { id: 4,  name: "Meera Subramanian", email: "meera.s@mail.com", phone: "+91 98186 44120", job: 1, stage: "initial", source: "Website", applied: "2026-10-02", rating: 0, ai: 72, exp: 4, loc: "Faridabad", notice: "Immediate", ctc: "13 LPA", skills: ["Python", "Flask", "Django"] },
    { id: 5,  name: "Karan Oberoi", email: "karan.oberoi@mail.com", phone: "+91 97110 38852", job: 1, stage: "hired", source: "LinkedIn", applied: "2026-08-30", rating: 5, ai: 93, exp: 8, loc: "Gurugram", notice: "Joined", ctc: "22 LPA", skills: ["Python", "Django", "System design"] },
    { id: 6,  name: "Sneha Pillai", email: "sneha.pillai@mail.com", phone: "+91 99588 21764", job: 2, stage: "interview", source: "Referral", applied: "2026-09-20", rating: 4, ai: 88, exp: 3, loc: "Bengaluru", notice: "30 days", ctc: "11 LPA", skills: ["Figma", "Design systems", "User research"] },
    { id: 7,  name: "Arjun Nair", email: "arjun.nair@mail.com", phone: "+91 98910 55603", job: 2, stage: "test", source: "Behance", applied: "2026-09-28", rating: 3, ai: 79, exp: 2, loc: "Remote", notice: "15 days", ctc: "9 LPA", skills: ["Figma", "Prototyping", "Illustration"] },
    { id: 8,  name: "Divya Menon", email: "divya.menon@mail.com", phone: "+91 98999 33210", job: 2, stage: "applied", source: "Email", applied: "2026-10-06", rating: 0, ai: 66, exp: 2, loc: "Pune", notice: "30 days", ctc: "8 LPA", skills: ["Figma", "Adobe XD"] },
    { id: 9,  name: "Vikram Joshi", email: "vikram.joshi@mail.com", phone: "+91 98115 90877", job: 3, stage: "interview", source: "Naukri", applied: "2026-09-15", rating: 4, ai: 86, exp: 4, loc: "Noida", notice: "30 days", ctc: "9 LPA", skills: ["Selenium", "Postman", "API testing", "Java"] },
    { id: 10, name: "Pooja Chauhan", email: "pooja.chauhan@mail.com", phone: "+91 97180 11940", job: 3, stage: "hired", source: "Website", applied: "2026-08-28", rating: 4, ai: 82, exp: 3, loc: "Gurugram", notice: "Joined", ctc: "7.5 LPA", skills: ["Selenium", "Test plans", "JIRA"] },
    { id: 11, name: "Nikhil Rao", email: "nikhil.rao@mail.com", phone: "+91 99710 66231", job: 3, stage: "initial", source: "LinkedIn", applied: "2026-10-03", rating: 2, ai: 69, exp: 2, loc: "Delhi", notice: "Immediate", ctc: "6 LPA", skills: ["Manual testing", "JIRA"] },
    { id: 12, name: "Tanvi Deshmukh", email: "tanvi.d@mail.com", phone: "+91 98500 12098", job: 3, stage: "cancelled", source: "Naukri", applied: "2026-09-12", rating: 2, ai: 58, exp: 1, loc: "Mumbai", notice: "30 days", ctc: "5 LPA", skills: ["Manual testing"] },
    { id: 13, name: "Aditya Saxena", email: "aditya.saxena@mail.com", phone: "+91 98187 45512", job: 4, stage: "interview", source: "Referral", applied: "2026-10-01", rating: 4, ai: 83, exp: 2, loc: "Gurugram", notice: "30 days", ctc: "5 LPA", skills: ["Recruitment", "Sourcing", "HRIS"] },
    { id: 14, name: "Ritika Sen", email: "ritika.sen@mail.com", phone: "+91 98730 90011", job: 4, stage: "initial", source: "LinkedIn", applied: "2026-10-05", rating: 0, ai: 74, exp: 3, loc: "Noida", notice: "45 days", ctc: "5.5 LPA", skills: ["Recruitment", "Onboarding", "Excel"] },
    { id: 15, name: "Harsh Vardhan", email: "harsh.v@mail.com", phone: "+91 99100 87344", job: 5, stage: "test", source: "LinkedIn", applied: "2026-10-02", rating: 3, ai: 87, exp: 5, loc: "Remote", notice: "30 days", ctc: "16 LPA", skills: ["AWS", "Docker", "Terraform", "CI/CD"] },
    { id: 16, name: "Simran Kaur", email: "simran.kaur@mail.com", phone: "+91 98110 20987", job: 5, stage: "applied", source: "Website", applied: "2026-10-07", rating: 0, ai: 77, exp: 4, loc: "Chandigarh", notice: "60 days", ctc: "14 LPA", skills: ["Linux", "Docker", "Jenkins"] },
    { id: 17, name: "Rohan Kapoor", email: "rohan.kapoor@mail.com", phone: "+91 98999 11805", job: 5, stage: "interview", source: "Referral", applied: "2026-09-26", rating: 4, ai: 90, exp: 6, loc: "Gurugram", notice: "30 days", ctc: "17 LPA", skills: ["AWS", "Kubernetes", "Terraform"] },
    { id: 18, name: "Neha Agarwal", email: "neha.agarwal@mail.com", phone: "+91 97173 55820", job: 6, stage: "hired", source: "Naukri", applied: "2026-07-22", rating: 5, ai: 89, exp: 4, loc: "Delhi", notice: "Joined", ctc: "12 LPA", skills: ["Requirements", "SQL", "Power BI"] },
    { id: 19, name: "Siddharth Rawat", email: "sid.rawat@mail.com", phone: "+91 98100 77435", job: 6, stage: "hired", source: "LinkedIn", applied: "2026-07-30", rating: 4, ai: 85, exp: 5, loc: "Gurugram", notice: "Joined", ctc: "13.5 LPA", skills: ["Requirements", "Stakeholders", "SQL"] },
    { id: 20, name: "Kavya Iyer", email: "kavya.iyer@mail.com", phone: "+91 98730 66512", job: 7, stage: "applied", source: "Email", applied: "2026-10-08", rating: 0, ai: 71, exp: 2, loc: "Gurugram", notice: "15 days", ctc: "4 LPA", skills: ["Tally", "GST"] },
    { id: 21, name: "Manish Tiwari", email: "manish.tiwari@mail.com", phone: "+91 99588 44019", job: 7, stage: "initial", source: "Naukri", applied: "2026-10-06", rating: 3, ai: 80, exp: 3, loc: "Noida", notice: "30 days", ctc: "4.5 LPA", skills: ["Tally", "GST", "Reconciliation"] },
    { id: 22, name: "Lavanya Reddy", email: "lavanya.reddy@mail.com", phone: "+91 98480 20766", job: 1, stage: "applied", source: "Email", applied: "2026-10-08", rating: 0, ai: 76, exp: 5, loc: "Hyderabad", notice: "60 days", ctc: "16 LPA", skills: ["Python", "Django", "Kafka"] },
    { id: 23, name: "Gaurav Mehra", email: "gaurav.mehra@mail.com", phone: "+91 98188 31245", job: 2, stage: "offer", source: "LinkedIn", applied: "2026-09-08", rating: 5, ai: 92, exp: 4, loc: "Remote", notice: "30 days", ctc: "12 LPA", skills: ["Figma", "Design systems", "Motion"] },
    { id: 24, name: "Ira Bansal", email: "ira.bansal@mail.com", phone: "+91 99107 90344", job: 4, stage: "applied", source: "Website", applied: "2026-10-09", rating: 0, ai: 63, exp: 1, loc: "Gurugram", notice: "15 days", ctc: "3.5 LPA", skills: ["Communication", "Excel"] }
  ],

  interviews: [
    { id: 1, cand: 1,  round: "Technical round 2", date: "2026-10-09", time: "11:00", dur: "60 min", mode: "Video call", who: ["Sonali Thakur", "Aman Verma"], status: "Scheduled" },
    { id: 2, cand: 6,  round: "Portfolio review",   date: "2026-10-09", time: "15:30", dur: "45 min", mode: "Video call", who: ["Priya Nair"], status: "Scheduled" },
    { id: 3, cand: 9,  round: "Technical round 1", date: "2026-10-10", time: "10:30", dur: "45 min", mode: "On-site", who: ["Aman Verma"], status: "Scheduled" },
    { id: 4, cand: 13, round: "HR round",           date: "2026-10-12", time: "12:00", dur: "30 min", mode: "On-site", who: ["Krishan Murari"], status: "Scheduled" },
    { id: 5, cand: 17, round: "System design",      date: "2026-10-13", time: "16:00", dur: "60 min", mode: "Video call", who: ["Rohit Sharma", "Sonali Thakur"], status: "Scheduled" },
    { id: 6, cand: 3,  round: "Final round",        date: "2026-10-07", time: "14:00", dur: "45 min", mode: "On-site", who: ["Sonali Thakur"], status: "Feedback pending" },
    { id: 7, cand: 23, round: "Design challenge",   date: "2026-10-05", time: "11:30", dur: "60 min", mode: "Video call", who: ["Priya Nair"], status: "Completed" },
    { id: 8, cand: 12, round: "Phone screen",       date: "2026-09-30", time: "17:00", dur: "20 min", mode: "Phone", who: ["Krishan Murari"], status: "Cancelled" }
  ],

  surveys: [
    { id: 1, name: "Technical screening", used: 3, questions: [
      { q: "How many years have you worked with your primary language or framework?", type: "Number" },
      { q: "Which of these have you used in production?", type: "Multiple choice", options: ["Docker", "Kubernetes", "Celery", "Redis"] },
      { q: "Are you comfortable with an on-call rotation?", type: "Yes / No" },
      { q: "Share a link to code or a project you are proud of.", type: "Short text" } ] },
    { id: 2, name: "Culture and expectations", used: 5, questions: [
      { q: "What kind of team do you do your best work in?", type: "Long text" },
      { q: "Rate your comfort with remote work.", type: "Rating (1 to 5)" },
      { q: "Preferred working model", type: "Single choice", options: ["On-site", "Hybrid", "Remote"] } ] },
    { id: 3, name: "Notice period and compensation", used: 7, questions: [
      { q: "What is your current notice period?", type: "Single choice", options: ["Immediate", "15 days", "30 days", "60 days", "90 days"] },
      { q: "Expected compensation (LPA)", type: "Number" },
      { q: "Can the notice period be bought out?", type: "Yes / No" } ] }
  ],

  /* recruitment stage setup per job (Stages page) */
  stageSetup: [
    { job: 1, stages: [["Applied", "applied", "Sonali Thakur"], ["Initial", "initial", "Sonali Thakur"], ["Test", "test", "Aman Verma"], ["Interview", "interview", "Sonali Thakur, Aman Verma"], ["Offer", "offer", "Admin User"], ["Hired", "hired", "Admin User"], ["Cancelled", "cancelled", "Admin User"]] },
    { job: 2, stages: [["Applied", "applied", "Priya Nair"], ["Portfolio review", "initial", "Priya Nair"], ["Design challenge", "test", "Priya Nair"], ["Interview", "interview", "Priya Nair"], ["Offer", "offer", "Admin User"], ["Hired", "hired", "Admin User"], ["Cancelled", "cancelled", "Admin User"]] },
    { job: 3, stages: [["Applied", "applied", "Aman Verma"], ["Initial", "initial", "Aman Verma"], ["Test", "test", "Aman Verma"], ["Interview", "interview", "Aman Verma"], ["Hired", "hired", "Admin User"], ["Cancelled", "cancelled", "Admin User"]] }
  ],

  skillZones: [
    { id: 1, name: "Python and Django", note: "Strong backend profiles worth reaching out to again.", cands: [1, 2, 3, 4, 22] },
    { id: 2, name: "Product design", note: "Designers with systems thinking.", cands: [6, 7, 23] },
    { id: 3, name: "Cloud and DevOps", note: "AWS, containers and infrastructure as code.", cands: [15, 16, 17] },
    { id: 4, name: "Quality engineering", note: "Automation and API testers.", cands: [9, 10, 11] },
    { id: 5, name: "Finance operations", note: "Tally, GST, reconciliation.", cands: [20, 21] }
  ],

  intake: [
    { id: 1, at: "2026-10-09 09:42", from: "kavya.iyer@mail.com", subject: "Application: Accounts Executive", result: "Candidate created", job: "Accounts Executive", conf: 94, files: 1 },
    { id: 2, at: "2026-10-09 08:15", from: "ira.bansal@mail.com", subject: "HR Executive opening", result: "Candidate created", job: "HR Executive", conf: 88, files: 1 },
    { id: 3, at: "2026-10-08 18:31", from: "lavanya.reddy@mail.com", subject: "Senior Django role", result: "Candidate created", job: "Senior Django Developer", conf: 91, files: 2 },
    { id: 4, at: "2026-10-08 13:20", from: "careers@talentdesk.in", subject: "Profiles for your requirement", result: "Needs review", job: "Not matched", conf: 41, files: 4 },
    { id: 5, at: "2026-10-07 21:05", from: "sachin.p@mail.com", subject: "Resume", result: "Needs review", job: "QA Engineer", conf: 57, files: 1 },
    { id: 6, at: "2026-10-07 11:48", from: "ishaan.malhotra@mail.com", subject: "Following up on my application", result: "Already exists", job: "Senior Django Developer", conf: 99, files: 0 },
    { id: 7, at: "2026-10-06 16:02", from: "divya.menon@mail.com", subject: "UI/UX Designer application", result: "Candidate created", job: "UI/UX Designer", conf: 90, files: 1 },
    { id: 8, at: "2026-10-05 10:17", from: "newsletter@jobs.example", subject: "Weekly digest", result: "Ignored", job: "-", conf: 12, files: 0 },
    { id: 9, at: "2026-10-04 19:40", from: "m.verma@mail.com", subject: "Application", result: "Failed", job: "-", conf: 0, files: 1 }
  ],

  notifications: [
    { t: "Ishaan Malhotra has an interview today at 11:00", s: "5 min ago", u: true },
    { t: "3 new applications arrived by email", s: "1 hour ago", u: true },
    { t: "Rahul Bhatia's offer is waiting for approval", s: "Yesterday", u: true },
    { t: "Feedback pending for Rahul Bhatia's final round", s: "Yesterday", u: false },
    { t: "Business Analyst opening was closed", s: "2 days ago", u: false }
  ]
};

/* small helpers shared by pages */
/* openings that are also posted on LinkedIn (a real app would store this on the job) */
[1, 2, 4, 5].forEach(function (id) { DEMO.jobs.filter(function (j) { return j.id === id; })[0].linkedin = true; });
DEMO.job = function (id) { return DEMO.jobs.filter(function (j) { return j.id === id; })[0]; };
DEMO.cand = function (id) { return DEMO.candidates.filter(function (c) { return c.id === id; })[0]; };
DEMO.stage = function (id) { return DEMO.stages.filter(function (s) { return s.id === id; })[0]; };

/* accent colours offered in Appearance. l = light theme value, d = dark theme value. */
var ACCENTS = [
  { id: "blue",   name: "Blue",   l: "#1d6fe8", d: "#5b9bff" },
  { id: "ink",    name: "Ink",    l: "#101828", d: "#e9eef7" },
  { id: "green",  name: "Green",  l: "#12805c", d: "#4ccf9e" },
  { id: "teal",   name: "Teal",   l: "#0e8f8f", d: "#55d0d0" },
  { id: "violet", name: "Violet", l: "#6552d0", d: "#a597f2" },
  { id: "orange", name: "Orange", l: "#d9731a", d: "#f2a257" },
  { id: "rose",   name: "Rose",   l: "#d6457a", d: "#f08ab0" }
];


/* ---- the full candidate application form ---------------------------------------------------
   The records above only hold a few fields. DEMO.fillProfile(c) adds the rest of the form
   (date of birth, address, education, work history, salary and so on) the first time a profile
   is opened. The values are sample data worked out from the candidate's name, department and
   years of experience, so the same person always gets the same answers. A field that is already
   on the record is never replaced, so real data wins. */
(function () {
  var hh = function (str) { var n = 0; for (var i = 0; i < str.length; i++) { n = (n * 31 + str.charCodeAt(i)) >>> 0; } return n; };
  var CITY = { Noida: ["Uttar Pradesh", "201301"], Gurugram: ["Haryana", "122001"], Delhi: ["Delhi", "110001"], Faridabad: ["Haryana", "121001"], Bengaluru: ["Karnataka", "560001"], Pune: ["Maharashtra", "411001"], Mumbai: ["Maharashtra", "400001"], Chandigarh: ["Chandigarh", "160017"], Hyderabad: ["Telangana", "500001"] };
  var DEG = { "Development": ["B.Tech", "Computer Science"], "Designing": ["B.Des", "Visual Communication"], "Human Resource": ["MBA", "Human Resources"], "Accounts": ["B.Com", "Accounting and Finance"], "Business Development": ["MBA", "Marketing"] };
  var UNI = ["GLA University", "Delhi Technological University", "Symbiosis Institute", "Amity University", "Christ University", "Manipal University", "Lovely Professional University", "Chandigarh University"];
  var SCHOOL = ["K.M.P.S", "St. Xavier's School", "Delhi Public School", "Kendriya Vidyalaya", "Modern School", "Ryan International"];
  var ROLE = { "Development": ["Software Engineer I", "Software Engineer II"], "Designing": ["Product Designer", "Senior Product Designer"], "Human Resource": ["HR Associate", "HR Executive"], "Accounts": ["Accounts Assistant", "Accounts Executive"], "Business Development": ["Business Analyst", "Senior Business Analyst"] };
  var FIRM = ["Milliman", "Northwind Technologies", "Finserve Labs", "Brightpath Solutions", "Orbit Systems", "Kestrel Digital", "Lumina Works"];
  var WHERE = ["Gurugram, Haryana", "Noida, Uttar Pradesh", "Bengaluru, Karnataka", "Pune, Maharashtra", "Hyderabad, Telangana", "Delhi"];
  var STREET = ["Sector 14", "Model Town", "Civil Lines", "Green Park", "Indira Nagar", "MG Road"];
  var WHY = [
    "I feel it is time to move forward and focus on my personal and professional growth. I am grateful for the opportunities and knowledge I gained here, and I believe exploring new opportunities will let me take on fresh challenges and work toward my long-term career goals.",
    "I am looking for a role with more ownership and a wider scope than I have today. I enjoyed working with my team, but I want to grow into bigger responsibilities.",
    "My current company is moving in a direction that does not match my skills and interests. I want to work on products where I can use my strengths every day.",
    "I want a better work-life balance and a shorter commute, and I am keen to join a team that values learning and mentoring."
  ];
  DEMO.fillProfile = function (c) {
    if (c._p) { return c; }
    var j = DEMO.job(c.job) || { dept: "Development", title: "" }, h = hh(c.name), r = function (k, n) { return hh(c.name + "|" + k) % n; };
    var loc = CITY[c.loc] || ["Uttar Pradesh", "226001"], exp = parseFloat(c.ctc) ? Math.round(parseFloat(c.ctc) * 100000) : null;
    var set = function (k, v) { if (c[k] === undefined) { c[k] = v; } };
    set("negotiable", r(1, 3) !== 0);
    set("gender", ["Male", "Female", "Male", "Female", "Male", "Female", "Male", "Female", "Other"][r(2, 9)]);
    var age = 22 + c.exp + r(3, 3), mo = 1 + r(4, 12), dy = 1 + r(5, 28);
    set("dob", (2026 - age) + "-" + (mo < 10 ? "0" : "") + mo + "-" + (dy < 10 ? "0" : "") + dy);
    set("state", loc[0]); set("country", "India"); set("zip", loc[1].slice(0, 3) + (100 + r(6, 900)));
    set("address", "#" + (100 + r(7, 900)) + ", " + STREET[r(8, STREET.length)]);
    set("portfolio", r(9, 3) === 0 ? "https://portfolio.example.com/" + c.name.toLowerCase().replace(/[^a-z]+/g, "-") : "");
    var roles = ROLE[j.dept] || ["Associate", "Senior Associate"];
    set("appliedPosition", roles[c.exp >= 4 ? 1 : 0].replace(/ I+$/, "") + " - (" + j.dept + ")");
    set("expMonths", r(10, 12));
    set("expDays", r(21, 28));
    set("availableToJoin", c.notice === "Immediate" ? "Immediate" : c.notice === "Joined" ? "Joined" : String(c.notice).replace(/days/i, "Days"));
    set("reasonToLeave", WHY[r(11, WHY.length)]);
    set("expectedSalary", exp); set("currentSalary", exp ? Math.round(exp * 0.82 / 1000) * 1000 : null);
    var gy = 2026 - c.exp, d = DEG[j.dept] || ["Bachelor's degree", "General"], commerce = j.dept === "Accounts" || j.dept === "Business Development";
    set("education", [
      { degree: d[0], branch: d[1], school: UNI[r(12, UNI.length)], score: (62 + r(13, 33)) + "", from: "July 1, " + (gy - 4), to: "June 1, " + gy, where: c.loc },
      { degree: "Senior Secondary High School", branch: commerce ? "Commerce" : "PCM", school: SCHOOL[r(14, SCHOOL.length)], score: (70 + r(15, 26)) + "", from: "April 1, " + (gy - 6), to: "April 1, " + (gy - 5), where: c.loc },
      { degree: "High School", branch: "", school: SCHOOL[r(16, SCHOOL.length)], score: (70 + r(17, 26)) + "", from: "April 1, " + (gy - 8), to: "April 1, " + (gy - 7), where: c.loc }
    ]);
    var n = c.exp >= 4 ? 2 : c.exp >= 1 ? 1 : 0, work = [], f1 = FIRM[r(18, FIRM.length)], f2 = FIRM[(r(18, FIRM.length) + 3) % FIRM.length];
    if (n === 2) { var d1 = Math.max(1, Math.round(c.exp * 0.45)), d2 = c.exp - d1; work.push({ title: roles[1], company: f1, from: "June 1, " + (2026 - d2), to: "Present", where: WHERE[r(19, WHERE.length)] }); work.push({ title: roles[0], company: f2, from: "July 1, " + (2026 - c.exp), to: "May 1, " + (2026 - d2), where: WHERE[r(20, WHERE.length)] }); }
    else if (n === 1) { work.push({ title: roles[0], company: f1, from: "June 1, " + (2026 - c.exp), to: "Present", where: WHERE[r(19, WHERE.length)] }); }
    work.sort(function (a, b) { return Date.parse(b.from) - Date.parse(a.from); });   /* newest job first */
    set("experience", work);
    c._p = true; return c;
  };
})();
