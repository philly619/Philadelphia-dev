/* ============================================================
   auth.js — Philadelphia Chikalimba Portfolio Authentication
   Shared by login.html and dashboard.html
   ============================================================ */

/* ── Credentials ─────────────────────────────────────────── */
const PC_CREDENTIALS = {
  username: 'philadelphia',
  password: 'PC@commerce2026'   /* Change this to your preferred password */
};

const SESSION_KEY = 'pc_auth_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; /* 8 hours */

/* ── Session helpers ──────────────────────────────────────── */
function createSession() {
  const session = {
    user: PC_CREDENTIALS.username,
    expires: Date.now() + SESSION_DURATION,
    token: btoa(Date.now() + ':' + Math.random())
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expires) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch (_) {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function isAuthenticated() {
  return getSession() !== null;
}

/* ── Route guards ─────────────────────────────────────────── */

/* Call on login.html — redirects away if already logged in */
function guardLoginPage() {
  if (isAuthenticated()) {
    window.location.href = 'dashboard.html';
  }
}

/* Call on dashboard.html — redirects to login if not authenticated */
function guardDashboard() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

/* ── Login handler (login.html) ───────────────────────────── */
function handleLogin() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMsg      = document.getElementById('error-msg');
  const btn           = document.getElementById('login-btn');

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  /* Clear previous error */
  errorMsg.classList.remove('show');

  if (!username || !password) {
    errorMsg.textContent = '◈ Please enter both username and password.';
    errorMsg.classList.add('show');
    return;
  }

  /* Simulate brief loading */
  btn.classList.add('loading');
  btn.textContent = 'Verifying...';

  setTimeout(() => {
    if (username === PC_CREDENTIALS.username && password === PC_CREDENTIALS.password) {
      createSession();
      window.location.href = 'dashboard.html';
    } else {
      btn.classList.remove('loading');
      btn.textContent = 'Enter ◎';
      errorMsg.textContent = '◈ Invalid credentials. Please try again.';
      errorMsg.classList.add('show');
      passwordInput.value = '';
      passwordInput.focus();
    }
  }, 600);
}

/* Allow Enter key to submit on login.html */
function setupLoginKeyboard() {
  const fields = ['username', 'password'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleLogin();
      });
    }
  });
}

/* ── Logout handler (dashboard.html) ─────────────────────── */
function handleLogout() {
  clearSession();
  window.location.href = 'login.html';
}

/* ── Auto-init on page load ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'login') {
    guardLoginPage();
    setupLoginKeyboard();
  }

  if (page === 'dashboard') {
    guardDashboard();
    /* Refresh session expiry on activity */
    document.addEventListener('click', () => {
      const s = getSession();
      if (s) {
        s.expires = Date.now() + SESSION_DURATION;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      }
    });
  }
});

/* ── CV Builder helpers ───────────────────────────────────── */
const CV_KEY = 'pc_cv_data';

function saveCVData(data) {
  localStorage.setItem(CV_KEY, JSON.stringify(data));
}

function loadCVData() {
  try {
    const raw = localStorage.getItem(CV_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

/* Default CV pre-filled from portfolio */
function getDefaultCV() {
  return {
    name: 'Philadelphia Chikalimba',
    title: 'Commerce & Technology Professional',
    email: 'phil.chikalimba@gmail.com',
    github: 'github.com/philly619',
    linkedin: 'linkedin.com/in/philadelphia-chikalimba',
    instagram: '@philadelphiachikalimba',
    summary: 'Commerce student bridging business strategy and digital innovation. Combining accounting rigour, strategic thinking, and hands-on coding into a unique profile at the intersection of finance and technology.',
    education: [
      {
        degree: 'Bachelor of Applied Accounting, Auditing and Information Systems',
        institution: 'Malawi College of Accountancy',
        period: '2022 – 2027'
      },
      {
        degree: 'Malawi School Certificate of Education (MSCE)',
        institution: 'Chichiri Secondary School',
        period: '2017 – 2021'
      }
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'Accounting Standards', 'Financial Reporting', 'Public Speaking', 'Communication', 'Leadership'],
    experience: [
      {
        role: 'Acting Manager & Intern',
        company: 'Chitenje Threads',
        period: 'April 2025',
        notes: 'Applied communication and management skills in a live business environment.'
      }
    ],
    projects: [
      {
        name: 'Realtime Inventory & Sales Tracker',
        stack: 'HTML, CSS, JavaScript, Python, Java',
        description: 'Full-stack application for small business inventory management with live revenue trends.'
      },
      {
        name: 'Personal Portfolio Website',
        stack: 'HTML, CSS, JavaScript',
        description: 'Designed and developed from scratch — no templates or builders.'
      }
    ],
    certifications: [
      'Web Development — Women In Tech (WIT)',
      'Public Speaking & Leadership — Academic & Professional Experience'
    ]
  };
}

/* ── Job Applications helpers ─────────────────────────────── */
const JOBS_KEY = 'pc_job_applications';

function saveJobs(jobs) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

function loadJobs() {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function addJob(job) {
  const jobs = loadJobs();
  job.id = Date.now();
  job.date = job.date || new Date().toISOString().split('T')[0];
  jobs.unshift(job);
  saveJobs(jobs);
  return job;
}

function updateJob(id, updates) {
  const jobs = loadJobs();
  const idx = jobs.findIndex(j => j.id === id);
  if (idx !== -1) {
    jobs[idx] = { ...jobs[idx], ...updates };
    saveJobs(jobs);
  }
}

function deleteJob(id) {
  const jobs = loadJobs().filter(j => j.id !== id);
  saveJobs(jobs);
}
