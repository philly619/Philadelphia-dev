const SUPABASE_URL = 'https://sbjrwtmisdqvwxomddjh.supabase.co';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';

let supabase = null;

function loadSupabase() {
  return new Promise((resolve) => {
    if (window.__supabaseLoaded) {
      resolve();
      return;
    }

    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

    s.onload = () => {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      window.__supabaseLoaded = true;
      resolve();
    };

    document.head.appendChild(s);
  });
}

const CSS = `
:root {
  --pc-bg:#0a0a0a;
  --pc-surface:#111111;
  --pc-border:rgba(255,255,255,0.08);
  --pc-border-hi:rgba(255,255,255,0.18);
  --pc-text:#f0ece4;
  --pc-muted:rgba(240,236,228,0.5);
  --pc-accent:#c8b89a;
  --pc-danger:#e24b4a;
  --pc-success:#1d9e75;
  --pc-radius:8px;
  --pc-radius-lg:14px;
  --pc-font:'Inter','Segoe UI',system-ui,sans-serif;
}

#pc-overlay *{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

#pc-dash-btn{
  position:fixed;
  top:18px;
  right:80px;
  z-index:9000;
  background:var(--pc-surface);
  border:1px solid var(--pc-border-hi);
  color:var(--pc-text);
  font:500 13px var(--pc-font);
  padding:8px 16px;
  border-radius:var(--pc-radius);
  cursor:pointer;
  display:none;
}

#pc-login-trigger{
  position:fixed;
  top:18px;
  right:20px;
  z-index:9000;
  background:transparent;
  border:1px solid var(--pc-border-hi);
  color:var(--pc-text);
  font:500 13px var(--pc-font);
  padding:8px 16px;
  border-radius:var(--pc-radius);
  cursor:pointer;
}

#pc-overlay{
  display:none;
  position:fixed;
  inset:0;
  z-index:9999;
  background:rgba(0,0,0,0.72);
  backdrop-filter:blur(4px);
  font-family:var(--pc-font);
}

#pc-overlay.active{
  display:flex;
  align-items:center;
  justify-content:center;
}

#pc-login-modal{
  background:var(--pc-surface);
  border:1px solid var(--pc-border-hi);
  border-radius:var(--pc-radius-lg);
  padding:2.5rem 2rem;
  width:100%;
  max-width:400px;
}

#pc-login-modal h2{
  font:500 1.25rem var(--pc-font);
  color:var(--pc-text);
  margin-bottom:6px;
}

#pc-login-modal p.subtitle{
  font-size:13px;
  color:var(--pc-muted);
  margin-bottom:1.75rem;
}

.pc-field{
  margin-bottom:1rem;
}

.pc-field label{
  display:block;
  font-size:12px;
  letter-spacing:0.06em;
  color:var(--pc-muted);
  margin-bottom:6px;
  text-transform:uppercase;
}

.pc-field input{
  width:100%;
  background:rgba(255,255,255,0.04);
  border:1px solid var(--pc-border-hi);
  border-radius:var(--pc-radius);
  padding:10px 14px;
  color:var(--pc-text);
  font:14px var(--pc-font);
  outline:none;
}

.pc-btn-primary{
  width:100%;
  padding:11px;
  background:var(--pc-accent);
  color:#0a0a0a;
  font:600 14px var(--pc-font);
  border:none;
  border-radius:var(--pc-radius);
  cursor:pointer;
}

.pc-btn-ghost{
  background:transparent;
  color:var(--pc-text);
  border:1px solid var(--pc-border-hi);
  border-radius:var(--pc-radius);
  font:13px var(--pc-font);
  padding:8px 16px;
  cursor:pointer;
}

.pc-err{
  font-size:13px;
  color:var(--pc-danger);
  margin-top:10px;
  text-align:center;
}

.pc-toggle-link{
  text-align:center;
  font-size:13px;
  color:var(--pc-muted);
  margin-top:14px;
}

.pc-toggle-link button{
  background:none;
  border:none;
  color:var(--pc-accent);
  cursor:pointer;
  font:13px var(--pc-font);
}

#pc-dashboard{
  display:none;
  flex-direction:column;
  position:fixed;
  inset:0;
  z-index:9998;
  background:var(--pc-bg);
  font-family:var(--pc-font);
  overflow:hidden;
}

#pc-dashboard.active{
  display:flex;
}

.pc-topbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 2rem;
  height:56px;
  border-bottom:1px solid var(--pc-border);
  background:var(--pc-surface);
}

.pc-logo{
  font:600 15px var(--pc-font);
  color:var(--pc-text);
}

.pc-user-pill{
  font-size:12px;
  color:var(--pc-muted);
}

.pc-layout{
  display:flex;
  flex:1;
}

.pc-sidebar{
  width:200px;
  border-right:1px solid var(--pc-border);
  padding:1.5rem 0;
  background:var(--pc-surface);
}

.pc-nav-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 1.25rem;
  font-size:13px;
  color:var(--pc-muted);
  cursor:pointer;
  border:none;
  background:none;
  width:100%;
  text-align:left;
}

.pc-nav-item.active{
  color:var(--pc-text);
  background:rgba(200,184,154,0.1);
  border-right:2px solid var(--pc-accent);
}

.pc-main{
  flex:1;
  overflow-y:auto;
  padding:2rem;
}

.pc-section-title{
  font:500 1.25rem var(--pc-font);
  color:var(--pc-text);
}

.pc-card{
  background:var(--pc-surface);
  border:1px solid var(--pc-border);
  border-radius:var(--pc-radius-lg);
  padding:1.25rem 1.5rem;
  margin-bottom:1rem;
}

.pc-stat{
  background:var(--pc-surface);
  border:1px solid var(--pc-border);
  border-radius:var(--pc-radius-lg);
  padding:1rem 1.25rem;
}

.pc-stat-label{
  font-size:11px;
  color:var(--pc-muted);
  text-transform:uppercase;
}

.pc-stat-value{
  font:500 1.75rem var(--pc-font);
  color:var(--pc-text);
}

.pc-grid-3{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1rem;
  margin-bottom:1.5rem;
}
`;

let currentUser = null;
let activeTab = 'overview';
let loginMode = 'login';

function injectCSS() {
  if (document.getElementById('pc-styles')) return;

  const style = document.createElement('style');
  style.id = 'pc-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

function getCV() {
  return JSON.parse(localStorage.getItem('pc_cv') || '{}');
}

function saveCV(data) {
  localStorage.setItem('pc_cv', JSON.stringify(data));
}

function getJobs() {
  return JSON.parse(localStorage.getItem('pc_jobs') || '[]');
}

function saveJobs(data) {
  localStorage.setItem('pc_jobs', JSON.stringify(data));
}

function buildDOM() {
  const loginBtn = document.createElement('button');
  loginBtn.id = 'pc-login-trigger';
  loginBtn.textContent = 'Login';
  loginBtn.onclick = showLoginModal;
  document.body.appendChild(loginBtn);

  const dashBtn = document.createElement('button');
  dashBtn.id = 'pc-dash-btn';
  dashBtn.textContent = 'Dashboard';
  dashBtn.onclick = openDashboard;
  document.body.appendChild(dashBtn);

  const overlay = document.createElement('div');
  overlay.id = 'pc-overlay';
  overlay.innerHTML = buildLoginHTML();
  document.body.appendChild(overlay);

  const dash = document.createElement('div');
  dash.id = 'pc-dashboard';
  dash.innerHTML = buildDashboardHTML();
  document.body.appendChild(dash);

  document.getElementById('pc-login-form').addEventListener('submit', handleAuth);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideLoginModal();
  });
}

function buildLoginHTML() {
  return `
    <div id="pc-login-modal">
      <h2>Welcome back</h2>

      <p class="subtitle">
        Sign in to access your dashboard
      </p>

      <form id="pc-login-form">
        <div class="pc-field">
          <label>Email</label>
          <input type="email" id="pc-email" required />
        </div>

        <div class="pc-field">
          <label>Password</label>
          <input type="password" id="pc-password" required />
        </div>

        <div class="pc-field" id="pc-confirm-field" style="display:none">
          <label>Confirm Password</label>
          <input type="password" id="pc-confirm" />
        </div>

        <button type="submit" class="pc-btn-primary" id="pc-auth-btn">
          Sign In
        </button>

        <p class="pc-err" id="pc-auth-err"></p>
      </form>

      <p class="pc-toggle-link">
        <span id="pc-toggle-text">
          Don't have an account?
        </span>

        <button id="pc-toggle-mode">
          Sign up
        </button>
      </p>
    </div>
  `;
}

function buildDashboardHTML() {
  return `
    <div class="pc-topbar">
      <div>
        <span class="pc-logo">PC.</span>
        <span class="pc-user-pill" id="pc-topbar-user"></span>
      </div>

      <div>
        <button class="pc-btn-ghost" id="pc-close-dash">
          Close
        </button>

        <button class="pc-btn-ghost" id="pc-signout-btn">
          Sign Out
        </button>
      </div>
    </div>

    <div class="pc-layout">
      <nav class="pc-sidebar">
        <button class="pc-nav-item active" data-tab="overview">
          Overview
        </button>

        <button class="pc-nav-item" data-tab="cv">
          CV Builder
        </button>

        <button class="pc-nav-item" data-tab="jobs">
          Job Tracker
        </button>
      </nav>

      <main class="pc-main" id="pc-main-content"></main>
    </div>
  `;
}

async function handleAuth(e) {
  e.preventDefault();

  const btn = document.getElementById('pc-auth-btn');
  const errEl = document.getElementById('pc-auth-err');

  const email = document.getElementById('pc-email').value.trim();
  const password = document.getElementById('pc-password').value;
  const confirm = document.getElementById('pc-confirm').value;

  errEl.textContent = '';

  btn.disabled = true;

  try {
    let result;

    if (loginMode === 'signup') {
      if (password !== confirm) {
        throw new Error('Passwords do not match');
      }

      result = await supabase.auth.signUp({
        email,
        password
      });

      if (result.error) throw result.error;

      errEl.style.color = 'var(--pc-success)';
      errEl.textContent = 'Account created successfully';

      btn.disabled = false;
      return;
    }

    result = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (result.error) throw result.error;

    currentUser = result.data.user;

    afterLogin();
  } catch (err) {
    errEl.textContent = err.message || 'Authentication failed';
    btn.disabled = false;
  }
}

function afterLogin() {
  hideLoginModal();

  document.getElementById('pc-login-trigger').style.display = 'none';
  document.getElementById('pc-dash-btn').style.display = 'block';

  openDashboard();
}

async function signOut() {
  await supabase.auth.signOut();

  currentUser = null;

  closeDashboard();

  document.getElementById('pc-login-trigger').style.display = 'block';
  document.getElementById('pc-dash-btn').style.display = 'none';
}

function wireToggleMode() {
  document.getElementById('pc-toggle-mode').addEventListener('click', () => {
    loginMode = loginMode === 'login' ? 'signup' : 'login';

    const signup = loginMode === 'signup';

    document.getElementById('pc-auth-btn').textContent = signup ? 'Sign Up' : 'Sign In';

    document.getElementById('pc-toggle-text').textContent =
      signup ? 'Already have an account?' : "Don't have an account?";

    document.getElementById('pc-toggle-mode').textContent =
      signup ? 'Sign in' : 'Sign up';

    document.getElementById('pc-confirm-field').style.display =
      signup ? 'block' : 'none';
  });
}

function showLoginModal() {
  document.getElementById('pc-overlay').classList.add('active');
}

function hideLoginModal() {
  document.getElementById('pc-overlay').classList.remove('active');
}

function openDashboard() {
  document.getElementById('pc-dashboard').classList.add('active');

  document.getElementById('pc-topbar-user').textContent =
    currentUser?.email || '';

  renderTab('overview');

  document.querySelectorAll('.pc-nav-item').forEach(btn => {
    btn.onclick = () => renderTab(btn.dataset.tab);
  });

  document.getElementById('pc-close-dash').onclick = closeDashboard;
  document.getElementById('pc-signout-btn').onclick = signOut;
}

function closeDashboard() {
  document.getElementById('pc-dashboard').classList.remove('active');
}

function renderTab(tab) {
  activeTab = tab;

  document.querySelectorAll('.pc-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  const main = document.getElementById('pc-main-content');

  if (tab === 'overview') {
    renderOverview(main);
  }

  if (tab === 'cv') {
    renderCV(main);
  }

  if (tab === 'jobs') {
    renderJobs(main);
  }
}

function renderOverview(main) {
  const jobs = getJobs();

  const interviews = jobs.filter(j => j.status === 'interview').length;

  const offers = jobs.filter(j => j.status === 'offer').length;

  main.innerHTML = `
    <div class="pc-section-title">
      Dashboard
    </div>

    <br>

    <div class="pc-grid-3">
      <div class="pc-stat">
        <div class="pc-stat-label">Applications</div>
        <div class="pc-stat-value">${jobs.length}</div>
      </div>

      <div class="pc-stat">
        <div class="pc-stat-label">Interviews</div>
        <div class="pc-stat-value">${interviews}</div>
      </div>

      <div class="pc-stat">
        <div class="pc-stat-label">Offers</div>
        <div class="pc-stat-value">${offers}</div>
      </div>
    </div>
  `;
}

function renderCV(main) {
  const cv = getCV();

  main.innerHTML = `
    <div class="pc-section-title">
      CV Builder
    </div>

    <br>

    <div class="pc-card">
      <div class="pc-field">
        <label>Full Name</label>
        <input type="text" id="cv-name" value="${cv.name || ''}" />
      </div>

      <div class="pc-field">
        <label>Title</label>
        <input type="text" id="cv-title" value="${cv.title || ''}" />
      </div>

      <div class="pc-field">
        <label>Email</label>
        <input type="email" id="cv-email" value="${cv.email || ''}" />
      </div>

      <button class="pc-btn-primary" id="save-cv">
        Save CV
      </button>
    </div>
  `;

  document.getElementById('save-cv').onclick = () => {
    saveCV({
      name: document.getElementById('cv-name').value,
      title: document.getElementById('cv-title').value,
      email: document.getElementById('cv-email').value
    });

    alert('CV saved');
  };
}

function renderJobs(main) {
  const jobs = getJobs();

  main.innerHTML = `
    <div class="pc-section-title">
      Job Tracker
    </div>

    <br>

    <div class="pc-card">
      <div class="pc-field">
        <label>Company</label>
        <input type="text" id="job-company" />
      </div>

      <div class="pc-field">
        <label>Role</label>
        <input type="text" id="job-role" />
      </div>

      <button class="pc-btn-primary" id="save-job">
        Add Job
      </button>
    </div>

    <div id="jobs-list"></div>
  `;

  function refreshJobs() {
    document.getElementById('jobs-list').innerHTML = jobs.map((job, i) => `
      <div class="pc-card">
        <strong>${job.company}</strong>
        <br>
        ${job.role}
        <br><br>

        <button onclick="deleteJob(${i})">
          Delete
        </button>
      </div>
    `).join('');
  }

  window.deleteJob = (i) => {
    jobs.splice(i, 1);
    saveJobs(jobs);
    renderJobs(main);
  };

  document.getElementById('save-job').onclick = () => {
    jobs.push({
      company: document.getElementById('job-company').value,
      role: document.getElementById('job-role').value
    });

    saveJobs(jobs);

    refreshJobs();
  };

  refreshJobs();
}

async function restoreSession() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) return;

  currentUser = session.user;

  document.getElementById('pc-login-trigger').style.display = 'none';
  document.getElementById('pc-dash-btn').style.display = 'block';
}

async function init() {
  injectCSS();

  await loadSupabase();

  buildDOM();

  wireToggleMode();

  await restoreSession();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
    }

    if (event === 'SIGNED_OUT') {
      currentUser = null;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
