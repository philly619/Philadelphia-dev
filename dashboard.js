/* ----------------------------------------------------------
   CONFIGURATION — replace with your actual Supabase values
   ---------------------------------------------------------- */
const SUPABASE_URL  = 'https://sbjrwtmisdqvwxomddjh.supabase.co/rest/v1/';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNianJ3dG1pc2Rxdnd4b21kZGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MTM0NDAsImV4cCI6MjA5NDk4OTQ0MH0.I3m8rAflSoZyiuPgR4YP3NJFYWaylXbtH94obwUboos';

/* ----------------------------------------------------------
   Bootstrap Supabase client (loaded from CDN below via
   a dynamic script injection so no build step is needed)
   ---------------------------------------------------------- */
let supabase = null;

function loadSupabase() {
  return new Promise((resolve) => {
    if (window.__supabaseLoaded) { resolve(); return; }
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

/* ----------------------------------------------------------
   CSS — injected once, mirrors the portfolio's dark aesthetic
   ---------------------------------------------------------- */
const CSS = `
/* ---- Tokens matching the portfolio palette ---- */
:root {
  --pc-bg:        #0a0a0a;
  --pc-surface:   #111111;
  --pc-border:    rgba(255,255,255,0.08);
  --pc-border-hi: rgba(255,255,255,0.18);
  --pc-text:      #f0ece4;
  --pc-muted:     rgba(240,236,228,0.5);
  --pc-accent:    #c8b89a;
  --pc-danger:    #e24b4a;
  --pc-success:   #1d9e75;
  --pc-radius:    8px;
  --pc-radius-lg: 14px;
  --pc-font:      'Inter', 'Segoe UI', system-ui, sans-serif;
}

/* ---- Reset overlay ---- */
#pc-overlay * { box-sizing: border-box; margin: 0; padding: 0; }

/* ---- Dashboard nav button (always visible when logged in) ---- */
#pc-dash-btn {
  position: fixed; top: 18px; right: 80px; z-index: 9000;
  background: var(--pc-surface);
  border: 1px solid var(--pc-border-hi);
  color: var(--pc-text);
  font: 500 13px var(--pc-font);
  padding: 8px 16px;
  border-radius: var(--pc-radius);
  cursor: pointer;
  display: none;
  letter-spacing: 0.04em;
  transition: background 0.2s, border-color 0.2s;
}
#pc-dash-btn:hover { background: rgba(255,255,255,0.06); border-color: var(--pc-accent); }

/* ---- Login button in nav ---- */
#pc-login-trigger {
  position: fixed; top: 18px; right: 20px; z-index: 9000;
  background: transparent;
  border: 1px solid var(--pc-border-hi);
  color: var(--pc-text);
  font: 500 13px var(--pc-font);
  padding: 8px 16px;
  border-radius: var(--pc-radius);
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.2s;
}
#pc-login-trigger:hover { border-color: var(--pc-accent); color: var(--pc-accent); }

/* ---- Backdrop ---- */
#pc-overlay {
  display: none;
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(4px);
  font-family: var(--pc-font);
}
#pc-overlay.active { display: flex; align-items: center; justify-content: center; }

/* ---- Login modal ---- */
#pc-login-modal {
  background: var(--pc-surface);
  border: 1px solid var(--pc-border-hi);
  border-radius: var(--pc-radius-lg);
  padding: 2.5rem 2rem;
  width: 100%; max-width: 400px;
  animation: pcSlideUp 0.25s ease;
}
@keyframes pcSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
#pc-login-modal h2 {
  font: 500 1.25rem var(--pc-font);
  color: var(--pc-text);
  margin-bottom: 6px;
}
#pc-login-modal p.subtitle {
  font-size: 13px; color: var(--pc-muted); margin-bottom: 1.75rem;
}
.pc-field { margin-bottom: 1rem; }
.pc-field label {
  display: block; font-size: 12px; letter-spacing: 0.06em;
  color: var(--pc-muted); margin-bottom: 6px; text-transform: uppercase;
}
.pc-field input {
  width: 100%; background: rgba(255,255,255,0.04);
  border: 1px solid var(--pc-border-hi); border-radius: var(--pc-radius);
  padding: 10px 14px; color: var(--pc-text); font: 14px var(--pc-font);
  outline: none; transition: border-color 0.2s;
}
.pc-field input:focus { border-color: var(--pc-accent); }
.pc-btn-primary {
  width: 100%; padding: 11px;
  background: var(--pc-accent); color: #0a0a0a;
  font: 600 14px var(--pc-font);
  border: none; border-radius: var(--pc-radius);
  cursor: pointer; letter-spacing: 0.04em;
  transition: opacity 0.2s;
}
.pc-btn-primary:hover { opacity: 0.88; }
.pc-btn-primary:disabled { opacity: 0.45; cursor: default; }
.pc-btn-ghost {
  background: transparent; color: var(--pc-text);
  border: 1px solid var(--pc-border-hi);
  border-radius: var(--pc-radius);
  font: 13px var(--pc-font);
  padding: 8px 16px; cursor: pointer;
  transition: border-color 0.2s;
}
.pc-btn-ghost:hover { border-color: var(--pc-accent); color: var(--pc-accent); }
.pc-err {
  font-size: 13px; color: var(--pc-danger);
  margin-top: 10px; text-align: center;
}
.pc-toggle-link {
  text-align: center; font-size: 13px;
  color: var(--pc-muted); margin-top: 14px;
}
.pc-toggle-link button {
  background: none; border: none; color: var(--pc-accent);
  cursor: pointer; font: 13px var(--pc-font); padding: 0;
}

/* ---- Dashboard shell ---- */
#pc-dashboard {
  display: none; flex-direction: column;
  position: fixed; inset: 0; z-index: 9998;
  background: var(--pc-bg);
  font-family: var(--pc-font);
  overflow: hidden;
}
#pc-dashboard.active { display: flex; }

/* ---- Dashboard topbar ---- */
.pc-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 56px;
  border-bottom: 1px solid var(--pc-border);
  background: var(--pc-surface);
  flex-shrink: 0;
}
.pc-topbar-left { display: flex; align-items: center; gap: 1rem; }
.pc-logo {
  font: 600 15px var(--pc-font); color: var(--pc-text);
  letter-spacing: 0.08em;
}
.pc-logo span { color: var(--pc-accent); }
.pc-user-pill {
  font-size: 12px; color: var(--pc-muted);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--pc-border);
  border-radius: 20px; padding: 3px 10px;
}
.pc-topbar-right { display: flex; align-items: center; gap: 10px; }

/* ---- Layout ---- */
.pc-layout {
  display: flex; flex: 1; overflow: hidden;
}
.pc-sidebar {
  width: 200px; flex-shrink: 0;
  border-right: 1px solid var(--pc-border);
  padding: 1.5rem 0;
  display: flex; flex-direction: column; gap: 2px;
  background: var(--pc-surface);
}
.pc-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 1.25rem;
  font-size: 13px; color: var(--pc-muted);
  cursor: pointer; border-radius: 0;
  transition: all 0.15s; border: none; background: none;
  width: 100%; text-align: left; letter-spacing: 0.02em;
}
.pc-nav-item:hover { color: var(--pc-text); background: rgba(255,255,255,0.04); }
.pc-nav-item.active { color: var(--pc-text); background: rgba(200,184,154,0.1); border-right: 2px solid var(--pc-accent); }
.pc-nav-icon { font-size: 16px; width: 18px; text-align: center; }

/* ---- Main content ---- */
.pc-main {
  flex: 1; overflow-y: auto; padding: 2rem;
  scrollbar-width: thin;
  scrollbar-color: var(--pc-border) transparent;
}

/* ---- Section header ---- */
.pc-section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.75rem;
}
.pc-section-title {
  font: 500 1.25rem var(--pc-font); color: var(--pc-text);
}
.pc-section-sub {
  font-size: 13px; color: var(--pc-muted); margin-top: 3px;
}

/* ---- Cards ---- */
.pc-card {
  background: var(--pc-surface);
  border: 1px solid var(--pc-border);
  border-radius: var(--pc-radius-lg);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}
.pc-card-title {
  font: 500 14px var(--pc-font); color: var(--pc-text); margin-bottom: 6px;
}
.pc-card-meta {
  font-size: 12px; color: var(--pc-muted); margin-bottom: 1rem;
}
.pc-grid-2 {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  margin-bottom: 1rem;
}
.pc-grid-3 {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
  margin-bottom: 1.5rem;
}
.pc-stat {
  background: var(--pc-surface); border: 1px solid var(--pc-border);
  border-radius: var(--pc-radius-lg); padding: 1rem 1.25rem;
}
.pc-stat-label { font-size: 11px; color: var(--pc-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
.pc-stat-value { font: 500 1.75rem var(--pc-font); color: var(--pc-text); }

/* ---- Form elements inside dashboard ---- */
.pc-form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
.pc-form-row .pc-field { flex: 1; margin-bottom: 0; }
.pc-form-group { margin-bottom: 1rem; }
.pc-form-group label {
  display: block; font-size: 12px; letter-spacing: 0.06em;
  color: var(--pc-muted); margin-bottom: 6px; text-transform: uppercase;
}
.pc-form-group input,
.pc-form-group textarea,
.pc-form-group select {
  width: 100%; background: rgba(255,255,255,0.04);
  border: 1px solid var(--pc-border-hi); border-radius: var(--pc-radius);
  padding: 10px 14px; color: var(--pc-text); font: 14px var(--pc-font);
  outline: none; transition: border-color 0.2s; resize: vertical;
}
.pc-form-group input:focus,
.pc-form-group textarea:focus,
.pc-form-group select:focus { border-color: var(--pc-accent); }
.pc-form-group select option { background: #1a1a1a; }
.pc-form-group textarea { min-height: 80px; }
.pc-form-actions { display: flex; gap: 10px; margin-top: 1.25rem; }
.pc-btn-sm {
  padding: 8px 16px; font: 500 13px var(--pc-font);
  border-radius: var(--pc-radius); cursor: pointer;
  transition: all 0.18s; border: none; letter-spacing: 0.03em;
}
.pc-btn-accent { background: var(--pc-accent); color: #0a0a0a; }
.pc-btn-accent:hover { opacity: 0.85; }
.pc-btn-outline {
  background: transparent; color: var(--pc-text);
  border: 1px solid var(--pc-border-hi) !important;
}
.pc-btn-outline:hover { border-color: var(--pc-accent) !important; color: var(--pc-accent); }
.pc-btn-danger { background: rgba(226,75,74,0.15); color: var(--pc-danger); border: 1px solid rgba(226,75,74,0.3) !important; }
.pc-btn-danger:hover { background: rgba(226,75,74,0.25); }

/* ---- Table ---- */
.pc-table-wrap { overflow-x: auto; }
.pc-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
}
.pc-table th {
  text-align: left; padding: 10px 14px;
  font: 500 11px var(--pc-font); letter-spacing: 0.06em;
  color: var(--pc-muted); text-transform: uppercase;
  border-bottom: 1px solid var(--pc-border);
}
.pc-table td {
  padding: 12px 14px; color: var(--pc-text);
  border-bottom: 1px solid var(--pc-border);
  vertical-align: middle;
}
.pc-table tr:last-child td { border-bottom: none; }
.pc-table tr:hover td { background: rgba(255,255,255,0.02); }

/* ---- Badges ---- */
.pc-badge {
  display: inline-block; padding: 3px 10px;
  border-radius: 20px; font-size: 11px; font-weight: 500;
  letter-spacing: 0.04em;
}
.pc-badge-applied   { background: rgba(55,138,221,0.15); color: #85b7eb; }
.pc-badge-interview { background: rgba(239,159,39,0.15); color: #fac775; }
.pc-badge-offer     { background: rgba(29,158,117,0.15); color: #5dcaa5; }
.pc-badge-rejected  { background: rgba(226,75,74,0.15);  color: #f09595; }
.pc-badge-saved     { background: rgba(200,184,154,0.15); color: var(--pc-accent); }

/* ---- CV preview ---- */
.pc-cv-preview {
  background: #fff; color: #111; border-radius: var(--pc-radius);
  padding: 2.5rem 2rem; font-family: 'Georgia', serif;
  font-size: 13px; line-height: 1.6; max-width: 640px;
}
.pc-cv-preview h1 { font-size: 22px; margin-bottom: 2px; }
.pc-cv-preview .cv-subtitle { font-size: 13px; color: #555; margin-bottom: 6px; }
.pc-cv-preview .cv-contact { font-size: 12px; color: #666; margin-bottom: 16px; }
.pc-cv-preview h2 {
  font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
  border-bottom: 1.5px solid #111; margin: 16px 0 8px; padding-bottom: 3px;
}
.pc-cv-preview ul { padding-left: 16px; margin: 4px 0; }
.pc-cv-preview .cv-entry { margin-bottom: 10px; }
.pc-cv-preview .cv-entry-title { font-weight: bold; }
.pc-cv-preview .cv-entry-meta { font-size: 12px; color: #666; }

/* ---- Portfolio cards ---- */
.pc-proj-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
}
.pc-proj-card {
  background: var(--pc-surface); border: 1px solid var(--pc-border);
  border-radius: var(--pc-radius-lg); padding: 1.25rem 1.5rem;
  transition: border-color 0.2s;
}
.pc-proj-card:hover { border-color: var(--pc-border-hi); }
.pc-proj-num { font: 600 11px var(--pc-font); color: var(--pc-accent); margin-bottom: 8px; letter-spacing: 0.06em; }
.pc-proj-title { font: 500 15px var(--pc-font); color: var(--pc-text); margin-bottom: 8px; }
.pc-proj-desc { font-size: 13px; color: var(--pc-muted); line-height: 1.6; margin-bottom: 12px; }
.pc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.pc-tag {
  font-size: 11px; padding: 3px 9px;
  border: 1px solid var(--pc-border-hi);
  border-radius: 4px; color: var(--pc-muted);
}

/* ---- Empty state ---- */
.pc-empty {
  text-align: center; padding: 3rem 1rem;
  color: var(--pc-muted); font-size: 14px;
}
.pc-empty-icon { font-size: 2rem; margin-bottom: 10px; color: var(--pc-border-hi); }

/* ---- Collapsible CV sections ---- */
.pc-section-toggle {
  width: 100%; background: none; border: none;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; cursor: pointer;
  color: var(--pc-text); font: 500 14px var(--pc-font);
  border-bottom: 1px solid var(--pc-border);
  margin-bottom: 8px;
}
.pc-section-toggle .arrow { transition: transform 0.2s; font-size: 16px; color: var(--pc-muted); }
.pc-section-toggle.open .arrow { transform: rotate(180deg); }

/* ---- Responsive ---- */
@media (max-width: 700px) {
  .pc-sidebar { width: 56px; }
  .pc-nav-item span.pc-nav-label { display: none; }
  .pc-grid-2, .pc-grid-3, .pc-proj-grid { grid-template-columns: 1fr; }
  .pc-main { padding: 1rem; }
  .pc-form-row { flex-direction: column; }
}
`;

/* ----------------------------------------------------------
   STATE
   ---------------------------------------------------------- */
let currentUser  = null;
let activeTab    = 'overview';
let cvData       = {};
let jobApps      = [];
let loginMode    = 'login'; // 'login' | 'signup'

/* ----------------------------------------------------------
   INJECT CSS
   ---------------------------------------------------------- */
function injectCSS() {
  if (document.getElementById('pc-styles')) return;
  const style = document.createElement('style');
  style.id = 'pc-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

/* ----------------------------------------------------------
   LOCAL STORAGE HELPERS (sync across sessions)
   ---------------------------------------------------------- */
function getCV()     { return JSON.parse(localStorage.getItem('pc_cv')  || '{}'); }
function saveCV(d)   { localStorage.setItem('pc_cv',   JSON.stringify(d)); }
function getJobs()   { return JSON.parse(localStorage.getItem('pc_jobs') || '[]'); }
function saveJobs(d) { localStorage.setItem('pc_jobs', JSON.stringify(d)); }

/* ----------------------------------------------------------
   BUILD DOM
   ---------------------------------------------------------- */
function buildDOM() {
  /* Login trigger button in top-right */
  const loginBtn = document.createElement('button');
  loginBtn.id = 'pc-login-trigger';
  loginBtn.textContent = 'Login';
  loginBtn.addEventListener('click', showLoginModal);
  document.body.appendChild(loginBtn);

  /* Dashboard button (shown when logged in) */
  const dashBtn = document.createElement('button');
  dashBtn.id = 'pc-dash-btn';
  dashBtn.textContent = '⬛ Dashboard';
  dashBtn.addEventListener('click', openDashboard);
  document.body.appendChild(dashBtn);

  /* Overlay (login modal backdrop) */
  const overlay = document.createElement('div');
  overlay.id = 'pc-overlay';
  overlay.innerHTML = buildLoginHTML();
  document.body.appendChild(overlay);

  /* Dashboard full-screen panel */
  const dash = document.createElement('div');
  dash.id = 'pc-dashboard';
  dash.innerHTML = buildDashboardHTML();
  document.body.appendChild(dash);

  /* Wire login form events */
  document.getElementById('pc-login-form').addEventListener('submit', handleAuth);
  document.getElementById('pc-overlay').addEventListener('click', function(e) {
    if (e.target === this) hideLoginModal();
  });
}

/* ----------------------------------------------------------
   HTML BUILDERS
   ---------------------------------------------------------- */
function buildLoginHTML() {
  return `
    <div id="pc-login-modal">
      <h2>Welcome back</h2>
      <p class="subtitle">Sign in to access your dashboard</p>
      <form id="pc-login-form">
        <div class="pc-field">
          <label>Email</label>
          <input type="email" id="pc-email" placeholder="you@example.com" required autocomplete="email"/>
        </div>
        <div class="pc-field">
          <label>Password</label>
          <input type="password" id="pc-password" placeholder="••••••••" required autocomplete="current-password"/>
        </div>
        <div class="pc-field" id="pc-confirm-field" style="display:none">
          <label>Confirm Password</label>
          <input type="password" id="pc-confirm" placeholder="••••••••" autocomplete="new-password"/>
        </div>
        <button type="submit" class="pc-btn-primary" id="pc-auth-btn">Sign In</button>
        <p class="pc-err" id="pc-auth-err"></p>
      </form>
      <p class="pc-toggle-link">
        <span id="pc-toggle-text">Don't have an account?</span>
        <button id="pc-toggle-mode"> Sign up</button>
      </p>
    </div>`;
}

function buildDashboardHTML() {
  return `
    <div class="pc-topbar">
      <div class="pc-topbar-left">
        <span class="pc-logo">PC<span>.</span></span>
        <span class="pc-user-pill" id="pc-topbar-user">—</span>
      </div>
      <div class="pc-topbar-right">
        <button class="pc-btn-ghost pc-btn-sm" id="pc-close-dash">✕ Close</button>
        <button class="pc-btn-sm pc-btn-outline" id="pc-signout-btn" style="border:1px solid var(--pc-border-hi)">Sign Out</button>
      </div>
    </div>
    <div class="pc-layout">
      <nav class="pc-sidebar" id="pc-sidebar">
        ${[
          ['overview',  '◈', 'Overview'],
          ['cv',        '◎', 'CV Builder'],
          ['portfolio', '◉', 'Portfolio'],
          ['jobs',      '◆', 'Job Tracker'],
        ].map(([id, icon, label]) => `
          <button class="pc-nav-item${id === 'overview' ? ' active' : ''}" data-tab="${id}">
            <span class="pc-nav-icon">${icon}</span>
            <span class="pc-nav-label">${label}</span>
          </button>`).join('')}
      </nav>
      <main class="pc-main" id="pc-main-content">
        <!-- filled by renderTab() -->
      </main>
    </div>`;
}

/* ----------------------------------------------------------
   AUTH
   ---------------------------------------------------------- */
async function handleAuth(e) {
  e.preventDefault();
  const btn     = document.getElementById('pc-auth-btn');
  const errEl   = document.getElementById('pc-auth-err');
  const email   = document.getElementById('pc-email').value.trim();
  const pass    = document.getElementById('pc-password').value;
  const confirm = document.getElementById('pc-confirm').value;

  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = loginMode === 'login' ? 'Signing in…' : 'Creating account…';

  try {
    let result;
    if (loginMode === 'signup') {
      if (pass !== confirm) { throw new Error('Passwords do not match.'); }
      result = await supabase.auth.signUp({ email, password: pass });
      if (result.error) throw result.error;
      errEl.style.color = 'var(--pc-success)';
      errEl.textContent = 'Account created! Check your email to confirm.';
      btn.disabled = false; btn.textContent = 'Sign Up'; return;
    } else {
      result = await supabase.auth.signInWithPassword({ email, password: pass });
      if (result.error) throw result.error;
      currentUser = result.data.user;
      afterLogin();
    }
  } catch (err) {
    errEl.style.color = 'var(--pc-danger)';
    errEl.textContent = err.message || 'Something went wrong. Try again.';
    btn.disabled = false;
    btn.textContent = loginMode === 'login' ? 'Sign In' : 'Sign Up';
  }
}

function afterLogin() {
  hideLoginModal();
  document.getElementById('pc-login-trigger').style.display  = 'none';
  document.getElementById('pc-dash-btn').style.display        = 'flex';
  openDashboard();
}

async function signOut() {
  await supabase.auth.signOut();
  currentUser = null;
  closeDashboard();
  document.getElementById('pc-login-trigger').style.display = 'block';
  document.getElementById('pc-dash-btn').style.display       = 'none';
}

/* ----------------------------------------------------------
   TOGGLE LOGIN / SIGNUP MODE
   ---------------------------------------------------------- */
function wireToggleMode() {
  document.getElementById('pc-toggle-mode').addEventListener('click', () => {
    loginMode = loginMode === 'login' ? 'signup' : 'login';
    const isSignup = loginMode === 'signup';
    document.getElementById('pc-auth-btn').textContent         = isSignup ? 'Sign Up' : 'Sign In';
    document.getElementById('pc-toggle-text').textContent      = isSignup ? 'Already have an account?' : "Don't have an account?";
    document.getElementById('pc-toggle-mode').textContent      = isSignup ? ' Sign in' : ' Sign up';
    document.getElementById('pc-confirm-field').style.display  = isSignup ? 'block' : 'none';
    document.querySelector('#pc-login-modal h2').textContent   = isSignup ? 'Create account' : 'Welcome back';
    document.getElementById('pc-auth-err').textContent         = '';
  });
}

/* ----------------------------------------------------------
   MODAL VISIBILITY
   ---------------------------------------------------------- */
function showLoginModal() {
  document.getElementById('pc-overlay').classList.add('active');
}
function hideLoginModal() {
  document.getElementById('pc-overlay').classList.remove('active');
}
function openDashboard() {
  cvData  = getCV();
  jobApps = getJobs();
  const email = currentUser?.email || '';
  document.getElementById('pc-topbar-user').textContent = email;
  document.getElementById('pc-dashboard').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderTab('overview');

  /* Nav wiring */
  document.querySelectorAll('.pc-nav-item').forEach(btn => {
    btn.addEventListener('click', () => renderTab(btn.dataset.tab));
  });
  document.getElementById('pc-close-dash').addEventListener('click', closeDashboard);
  document.getElementById('pc-signout-btn').addEventListener('click', signOut);
}
function closeDashboard() {
  document.getElementById('pc-dashboard').classList.remove('active');
  document.body.style.overflow = '';
}

/* ----------------------------------------------------------
   RENDER TABS
   ---------------------------------------------------------- */
function renderTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.pc-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  const main = document.getElementById('pc-main-content');
  const map = { overview: renderOverview, cv: renderCV, portfolio: renderPortfolio, jobs: renderJobs };
  main.innerHTML = '';
  (map[tab] || renderOverview)();
}

/* ---------- OVERVIEW ---------- */
function renderOverview() {
  const jobs  = getJobs();
  const total = jobs.length;
  const inter = jobs.filter(j => j.status === 'interview').length;
  const offers= jobs.filter(j => j.status === 'offer').length;
  const main  = document.getElementById('pc-main-content');
  main.innerHTML = `
    <div class="pc-section-header">
      <div>
        <div class="pc-section-title">Dashboard</div>
        <div class="pc-section-sub">Welcome back, ${currentUser?.email?.split('@')[0] || 'Philadelphia'}</div>
      </div>
    </div>
    <div class="pc-grid-3">
      <div class="pc-stat"><div class="pc-stat-label">Applications</div><div class="pc-stat-value">${total}</div></div>
      <div class="pc-stat"><div class="pc-stat-label">Interviews</div><div class="pc-stat-value">${inter}</div></div>
      <div class="pc-stat"><div class="pc-stat-label">Offers</div><div class="pc-stat-value">${offers}</div></div>
    </div>
    <div class="pc-grid-2">
      <div class="pc-card" style="cursor:pointer" onclick="window._pcNav('cv')">
        <div class="pc-card-title">◎ CV Builder</div>
        <div class="pc-card-meta">Build and export your professional CV</div>
        <span class="pc-badge pc-badge-saved">Open Builder →</span>
      </div>
      <div class="pc-card" style="cursor:pointer" onclick="window._pcNav('portfolio')">
        <div class="pc-card-title">◉ My Portfolio</div>
        <div class="pc-card-meta">View your projects and achievements</div>
        <span class="pc-badge pc-badge-applied">View Portfolio →</span>
      </div>
      <div class="pc-card" style="cursor:pointer" onclick="window._pcNav('jobs')">
        <div class="pc-card-title">◆ Job Tracker</div>
        <div class="pc-card-meta">Track applications and interviews</div>
        <span class="pc-badge pc-badge-interview">Track Jobs →</span>
      </div>
    </div>`;
  window._pcNav = renderTab;
}

/* ---------- CV BUILDER ---------- */
function renderCV() {
  const cv = getCV();
  const main = document.getElementById('pc-main-content');
  main.innerHTML = `
    <div class="pc-section-header">
      <div>
        <div class="pc-section-title">CV Builder</div>
        <div class="pc-section-sub">Fill in your details — preview updates live</div>
      </div>
      <button class="pc-btn-sm pc-btn-accent" id="pc-export-cv">⬇ Export PDF</button>
    </div>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start;">
      <!-- Editor -->
      <div>
        <div class="pc-card" style="margin-bottom:1rem">
          <div class="pc-card-title" style="margin-bottom:14px">Personal Info</div>
          <div class="pc-form-group"><label>Full Name</label>
            <input type="text" id="cv-name" value="${esc(cv.name||'Philadelphia Chikalimba')}" placeholder="Full Name"/></div>
          <div class="pc-form-group"><label>Title / Role</label>
            <input type="text" id="cv-title" value="${esc(cv.title||'Commerce & Technology Student')}" placeholder="e.g. Software Developer"/></div>
          <div class="pc-form-row">
            <div class="pc-form-group" style="flex:1"><label>Email</label>
              <input type="email" id="cv-email" value="${esc(cv.email||'phil.chikalimba@gmail.com')}" placeholder="email@example.com"/></div>
            <div class="pc-form-group" style="flex:1"><label>Phone</label>
              <input type="text" id="cv-phone" value="${esc(cv.phone||'')}" placeholder="+265 ..."/></div>
          </div>
          <div class="pc-form-group"><label>Location</label>
            <input type="text" id="cv-location" value="${esc(cv.location||'Lilongwe, Malawi')}" placeholder="City, Country"/></div>
          <div class="pc-form-group"><label>LinkedIn URL</label>
            <input type="text" id="cv-linkedin" value="${esc(cv.linkedin||'')}" placeholder="linkedin.com/in/..."/></div>
          <div class="pc-form-group"><label>GitHub URL</label>
            <input type="text" id="cv-github" value="${esc(cv.github||'')}" placeholder="github.com/..."/></div>
        </div>

        <div class="pc-card" style="margin-bottom:1rem">
          <div class="pc-card-title" style="margin-bottom:14px">Summary</div>
          <div class="pc-form-group">
            <textarea id="cv-summary" rows="3" placeholder="A short professional summary...">${esc(cv.summary||'Commerce student building a brand that bridges business and technology.')}</textarea>
          </div>
        </div>

        <div class="pc-card" style="margin-bottom:1rem">
          <div class="pc-card-title" style="margin-bottom:14px">Experience</div>
          <div id="cv-exp-list">${renderExpItems(cv.experience||[])}</div>
          <button class="pc-btn-sm pc-btn-outline" id="cv-add-exp" style="margin-top:8px;border:1px solid var(--pc-border-hi)">+ Add Experience</button>
        </div>

        <div class="pc-card" style="margin-bottom:1rem">
          <div class="pc-card-title" style="margin-bottom:14px">Education</div>
          <div id="cv-edu-list">${renderEduItems(cv.education||[])}</div>
          <button class="pc-btn-sm pc-btn-outline" id="cv-add-edu" style="margin-top:8px;border:1px solid var(--pc-border-hi)">+ Add Education</button>
        </div>

        <div class="pc-card" style="margin-bottom:1rem">
          <div class="pc-card-title" style="margin-bottom:14px">Skills</div>
          <div class="pc-form-group">
            <textarea id="cv-skills" rows="2" placeholder="HTML, CSS, JavaScript, Python, Accounting, ...">${esc(cv.skills||'HTML, CSS, JavaScript, Python, Accounting, Business Law, Public Speaking')}</textarea>
          </div>
        </div>

        <div class="pc-form-actions">
          <button class="pc-btn-sm pc-btn-accent" id="cv-save-btn">Save CV</button>
          <span id="cv-save-msg" style="font-size:13px;color:var(--pc-success);align-self:center"></span>
        </div>
      </div>

      <!-- Preview -->
      <div>
        <div style="font-size:12px;color:var(--pc-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.06em">Live Preview</div>
        <div class="pc-cv-preview" id="cv-preview-pane">
          <!-- filled by updateCVPreview() -->
        </div>
      </div>
    </div>`;

  /* events */
  document.querySelectorAll('#cv-name,#cv-title,#cv-email,#cv-phone,#cv-location,#cv-linkedin,#cv-github,#cv-summary,#cv-skills')
    .forEach(el => el.addEventListener('input', updateCVPreview));
  document.getElementById('cv-add-exp').addEventListener('click', () => addExpRow());
  document.getElementById('cv-add-edu').addEventListener('click', () => addEduRow());
  document.getElementById('cv-save-btn').addEventListener('click', saveCVData);
  document.getElementById('pc-export-cv').addEventListener('click', exportCVPDF);

  updateCVPreview();
  wireExpEduDelegation();
}

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function renderExpItems(list) {
  if (!list.length) return '';
  return list.map((e, i) => `
    <div class="pc-card" style="margin-bottom:8px;padding:1rem" data-exp="${i}">
      <div class="pc-form-row">
        <div class="pc-form-group" style="flex:1"><label>Job Title</label>
          <input class="exp-title" type="text" value="${esc(e.title||'')}" placeholder="e.g. Intern"/></div>
        <div class="pc-form-group" style="flex:1"><label>Company</label>
          <input class="exp-company" type="text" value="${esc(e.company||'')}" placeholder="Company name"/></div>
      </div>
      <div class="pc-form-row">
        <div class="pc-form-group" style="flex:1"><label>Period</label>
          <input class="exp-period" type="text" value="${esc(e.period||'')}" placeholder="Apr 2025 – Present"/></div>
      </div>
      <div class="pc-form-group"><label>Description</label>
        <textarea class="exp-desc" rows="2">${esc(e.desc||'')}</textarea></div>
      <button class="pc-btn-sm pc-btn-danger remove-exp" style="border:1px solid rgba(226,75,74,0.3)">Remove</button>
    </div>`).join('');
}

function renderEduItems(list) {
  if (!list.length) return '';
  return list.map((e, i) => `
    <div class="pc-card" style="margin-bottom:8px;padding:1rem" data-edu="${i}">
      <div class="pc-form-row">
        <div class="pc-form-group" style="flex:1"><label>Degree / Qualification</label>
          <input class="edu-degree" type="text" value="${esc(e.degree||'')}" placeholder="BSc Accounting"/></div>
        <div class="pc-form-group" style="flex:1"><label>Institution</label>
          <input class="edu-school" type="text" value="${esc(e.school||'')}" placeholder="University name"/></div>
      </div>
      <div class="pc-form-group"><label>Period</label>
        <input class="edu-period" type="text" value="${esc(e.period||'')}" placeholder="2022 – 2027"/></div>
      <button class="pc-btn-sm pc-btn-danger remove-edu" style="border:1px solid rgba(226,75,74,0.3)">Remove</button>
    </div>`).join('');
}

function addExpRow() {
  const cv = collectCVForm();
  cv.experience.push({ title:'', company:'', period:'', desc:'' });
  saveCV(cv);
  document.getElementById('cv-exp-list').innerHTML = renderExpItems(cv.experience);
  wireExpEduDelegation();
}

function addEduRow() {
  const cv = collectCVForm();
  cv.education.push({ degree:'', school:'', period:'' });
  saveCV(cv);
  document.getElementById('cv-edu-list').innerHTML = renderEduItems(cv.education);
  wireExpEduDelegation();
}

function wireExpEduDelegation() {
  document.getElementById('cv-exp-list').addEventListener('input', updateCVPreview);
  document.getElementById('cv-edu-list').addEventListener('input', updateCVPreview);
  document.querySelectorAll('.remove-exp').forEach(btn => {
    btn.addEventListener('click', function() {
      const cv = collectCVForm();
      const idx = parseInt(this.closest('[data-exp]').dataset.exp);
      cv.experience.splice(idx, 1);
      saveCV(cv);
      document.getElementById('cv-exp-list').innerHTML = renderExpItems(cv.experience);
      wireExpEduDelegation(); updateCVPreview();
    });
  });
  document.querySelectorAll('.remove-edu').forEach(btn => {
    btn.addEventListener('click', function() {
      const cv = collectCVForm();
      const idx = parseInt(this.closest('[data-edu]').dataset.edu);
      cv.education.splice(idx, 1);
      saveCV(cv);
      document.getElementById('cv-edu-list').innerHTML = renderEduItems(cv.education);
      wireExpEduDelegation(); updateCVPreview();
    });
  });
}

function collectCVForm() {
  const g = id => (document.getElementById(id)||{}).value || '';
  const experience = [];
  document.querySelectorAll('#cv-exp-list [data-exp]').forEach(el => {
    experience.push({
      title:   el.querySelector('.exp-title')?.value   || '',
      company: el.querySelector('.exp-company')?.value || '',
      period:  el.querySelector('.exp-period')?.value  || '',
      desc:    el.querySelector('.exp-desc')?.value    || '',
    });
  });
  const education = [];
  document.querySelectorAll('#cv-edu-list [data-edu]').forEach(el => {
    education.push({
      degree: el.querySelector('.edu-degree')?.value || '',
      school: el.querySelector('.edu-school')?.value || '',
      period: el.querySelector('.edu-period')?.value || '',
    });
  });
  return {
    name: g('cv-name'), title: g('cv-title'), email: g('cv-email'),
    phone: g('cv-phone'), location: g('cv-location'),
    linkedin: g('cv-linkedin'), github: g('cv-github'),
    summary: g('cv-summary'), skills: g('cv-skills'),
    experience, education,
  };
}

function saveCVData() {
  const cv = collectCVForm();
  saveCV(cv);
  const msg = document.getElementById('cv-save-msg');
  msg.textContent = '✓ Saved';
  setTimeout(() => { msg.textContent = ''; }, 2000);
  updateCVPreview();
}

function updateCVPreview() {
  const cv = collectCVForm();
  const pane = document.getElementById('cv-preview-pane');
  if (!pane) return;
  const expHTML = cv.experience.filter(e => e.title||e.company).map(e => `
    <div class="cv-entry">
      <span class="cv-entry-title">${esc(e.title)}</span>${e.company ? ` — ${esc(e.company)}` : ''}
      <div class="cv-entry-meta">${esc(e.period)}</div>
      <p>${esc(e.desc)}</p>
    </div>`).join('');
  const eduHTML = cv.education.filter(e => e.degree||e.school).map(e => `
    <div class="cv-entry">
      <span class="cv-entry-title">${esc(e.degree)}</span>${e.school ? ` — ${esc(e.school)}` : ''}
      <div class="cv-entry-meta">${esc(e.period)}</div>
    </div>`).join('');
  const contactParts = [cv.email, cv.phone, cv.location, cv.linkedin, cv.github].filter(Boolean);
  pane.innerHTML = `
    <h1>${esc(cv.name||'Your Name')}</h1>
    <div class="cv-subtitle">${esc(cv.title||'')}</div>
    <div class="cv-contact">${contactParts.map(esc).join(' &nbsp;·&nbsp; ')}</div>
    ${cv.summary ? `<h2>Profile</h2><p>${esc(cv.summary)}</p>` : ''}
    ${expHTML ? `<h2>Experience</h2>${expHTML}` : ''}
    ${eduHTML ? `<h2>Education</h2>${eduHTML}` : ''}
    ${cv.skills  ? `<h2>Skills</h2><p>${esc(cv.skills)}</p>` : ''}`;
}

function exportCVPDF() {
  const pane = document.getElementById('cv-preview-pane');
  if (!pane) return;
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; line-height: 1.6;
             color: #111; padding: 2.5rem 2rem; max-width: 720px; margin: auto; }
      h1 { font-size: 22px; margin: 0 0 2px; }
      .cv-subtitle { font-size: 13px; color: #555; }
      .cv-contact  { font-size: 12px; color: #666; margin-bottom: 16px; }
      h2 { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
           border-bottom: 1.5px solid #111; margin: 16px 0 8px; padding-bottom: 3px; }
      .cv-entry-title { font-weight: bold; }
      .cv-entry-meta  { font-size: 12px; color: #666; }
      ul { padding-left: 16px; margin: 4px 0; }
      @media print { body { padding: 0; } }
    </style></head><body>${pane.innerHTML}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
}

/* ---------- PORTFOLIO ---------- */
function renderPortfolio() {
  const main = document.getElementById('pc-main-content');
  const projects = [
    {
      num: '01',
      title: 'Realtime Inventory & Sales Tracker',
      desc: 'A full-stack web application for small business owners with a live product catalog, sales dashboard, Python backend, and Java revenue service with low-stock alerts.',
      tags: ['HTML','CSS','JavaScript','Python','Java'],
    },
    {
      num: '02',
      title: 'Personal Portfolio Website',
      desc: 'Designed and built from scratch — no templates. Semantic HTML, handcrafted CSS animations, and vanilla JavaScript showcasing commerce knowledge and coding ability.',
      tags: ['HTML','CSS','JavaScript','UI/UX Design'],
    },
  ];

  const skills = [
    ['◎','Attention to Detail','Precision in every task — from financial reports to lines of code.'],
    ['◈','Communication','Translating complex ideas into clear, compelling language.'],
    ['◉','Public Speaking','Confident presenter who delivers ideas that resonate.'],
    ['◍','Accounting Standards','Solid foundation in financial reporting and data-driven decisions.'],
    ['◇','Coding','HTML, CSS, JS, Python — building functional, beautiful digital products.'],
    ['◆','Fast Learning','Picking up new tools, frameworks, and concepts with speed and depth.'],
  ];

  main.innerHTML = `
    <div class="pc-section-header">
      <div>
        <div class="pc-section-title">My Portfolio</div>
        <div class="pc-section-sub">Philadelphia Chikalimba — Commerce & Technology</div>
      </div>
      <a href="https://philly619.github.io/Philadelphia-dev/" target="_blank" class="pc-btn-sm pc-btn-outline" style="border:1px solid var(--pc-border-hi);text-decoration:none;color:var(--pc-text);padding:8px 14px;border-radius:var(--pc-radius);font-size:13px">↗ Live Site</a>
    </div>

    <div class="pc-card" style="margin-bottom:1.5rem">
      <div class="pc-card-title">About</div>
      <div class="pc-card-meta" style="line-height:1.7;font-size:14px;color:var(--pc-text)">
        Commerce student at Malawi College of Accountancy building a brand that bridges business strategy and digital innovation.
        Studying accounting, auditing and information systems while developing technical skills in software development.
      </div>
    </div>

    <div style="font-size:12px;color:var(--pc-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">Projects</div>
    <div class="pc-proj-grid" style="margin-bottom:2rem">
      ${projects.map(p => `
        <div class="pc-proj-card">
          <div class="pc-proj-num">${p.num}</div>
          <div class="pc-proj-title">${p.title}</div>
          <div class="pc-proj-desc">${p.desc}</div>
          <div class="pc-tags">${p.tags.map(t => `<span class="pc-tag">${t}</span>`).join('')}</div>
        </div>`).join('')}
    </div>

    <div style="font-size:12px;color:var(--pc-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">Skills & Strengths</div>
    <div class="pc-grid-2" style="margin-bottom:2rem">
      ${skills.map(([icon, title, desc]) => `
        <div class="pc-card" style="display:flex;gap:12px;align-items:flex-start">
          <span style="font-size:18px;color:var(--pc-accent);flex-shrink:0;margin-top:2px">${icon}</span>
          <div>
            <div style="font:500 14px var(--pc-font);color:var(--pc-text);margin-bottom:4px">${title}</div>
            <div style="font-size:13px;color:var(--pc-muted);line-height:1.5">${desc}</div>
          </div>
        </div>`).join('')}
    </div>

    <div style="font-size:12px;color:var(--pc-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">Education</div>
    <div class="pc-card">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div>
          <div style="font:500 14px var(--pc-font);color:var(--pc-text)">Bachelor of Applied Accounting, Auditing and Information Systems</div>
          <div style="font-size:13px;color:var(--pc-accent);margin:2px 0">Malawi College of Accountancy</div>
          <div style="font-size:12px;color:var(--pc-muted)">2022 – 2027</div>
        </div>
        <div style="border-top:1px solid var(--pc-border);padding-top:14px">
          <div style="font:500 14px var(--pc-font);color:var(--pc-text)">Malawi School Certificate of Education (MSCE)</div>
          <div style="font-size:13px;color:var(--pc-accent);margin:2px 0">Chichiri Secondary School</div>
          <div style="font-size:12px;color:var(--pc-muted)">2017 – 2021</div>
        </div>
      </div>
    </div>`;
}

/* ---------- JOB TRACKER ---------- */
function renderJobs() {
  const jobs = getJobs();
  const main = document.getElementById('pc-main-content');

  const statusBadge = s => {
    const map = { applied:'applied', interview:'interview', offer:'offer', rejected:'rejected', saved:'saved' };
    return `<span class="pc-badge pc-badge-${map[s]||'saved'}">${s}</span>`;
  };

  main.innerHTML = `
    <div class="pc-section-header">
      <div>
        <div class="pc-section-title">Job Application Tracker</div>
        <div class="pc-section-sub">Track every application from saved to offer</div>
      </div>
      <button class="pc-btn-sm pc-btn-accent" id="pc-add-job-btn">+ Add Application</button>
    </div>

    <!-- Add form (hidden by default) -->
    <div class="pc-card" id="pc-job-form-card" style="display:none;margin-bottom:1.5rem">
      <div class="pc-card-title" style="margin-bottom:14px" id="pc-job-form-title">New Application</div>
      <input type="hidden" id="job-edit-idx" value="-1"/>
      <div class="pc-form-row">
        <div class="pc-form-group" style="flex:1"><label>Company</label>
          <input type="text" id="job-company" placeholder="e.g. Accenture"/></div>
        <div class="pc-form-group" style="flex:1"><label>Role</label>
          <input type="text" id="job-role" placeholder="e.g. Junior Accountant"/></div>
      </div>
      <div class="pc-form-row">
        <div class="pc-form-group" style="flex:1"><label>Date Applied</label>
          <input type="date" id="job-date" value="${new Date().toISOString().slice(0,10)}"/></div>
        <div class="pc-form-group" style="flex:1"><label>Status</label>
          <select id="job-status">
            <option value="saved">Saved</option>
            <option value="applied" selected>Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select></div>
      </div>
      <div class="pc-form-group"><label>Job URL</label>
        <input type="url" id="job-url" placeholder="https://..."/></div>
      <div class="pc-form-group"><label>Notes</label>
        <textarea id="job-notes" rows="2" placeholder="Key contact, next steps, salary range..."></textarea></div>
      <div class="pc-form-actions">
        <button class="pc-btn-sm pc-btn-accent" id="pc-save-job">Save</button>
        <button class="pc-btn-sm pc-btn-outline" id="pc-cancel-job" style="border:1px solid var(--pc-border-hi)">Cancel</button>
      </div>
    </div>

    <!-- Table -->
    <div class="pc-card" style="padding:0;overflow:hidden">
      <div class="pc-table-wrap">
        <table class="pc-table">
          <thead>
            <tr>
              <th>Company</th><th>Role</th><th>Date</th><th>Status</th><th>Notes</th><th></th>
            </tr>
          </thead>
          <tbody id="pc-jobs-tbody">
            ${jobs.length === 0 ? `<tr><td colspan="6"><div class="pc-empty">
              <div class="pc-empty-icon">◆</div>
              No applications yet. Click "Add Application" to start tracking.
            </div></td></tr>` :
            jobs.map((j, i) => `
              <tr>
                <td><strong style="color:var(--pc-text)">${esc(j.company)}</strong></td>
                <td>${esc(j.role)}</td>
                <td style="white-space:nowrap">${esc(j.date||'')}</td>
                <td>${statusBadge(j.status)}</td>
                <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pc-muted)">${esc(j.notes||'—')}</td>
                <td style="white-space:nowrap">
                  ${j.url ? `<a href="${esc(j.url)}" target="_blank" class="pc-btn-sm pc-btn-outline" style="text-decoration:none;color:var(--pc-text);font-size:12px;padding:4px 10px;border:1px solid var(--pc-border-hi);border-radius:6px;margin-right:4px">↗</a>` : ''}
                  <button class="pc-btn-sm pc-btn-outline" data-edit="${i}" style="font-size:12px;padding:4px 10px;border:1px solid var(--pc-border-hi);border-radius:6px;margin-right:4px">Edit</button>
                  <button class="pc-btn-sm pc-btn-danger" data-del="${i}" style="font-size:12px;padding:4px 10px;border:1px solid rgba(226,75,74,0.3);border-radius:6px">Del</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  /* Events */
  document.getElementById('pc-add-job-btn').addEventListener('click', () => {
    document.getElementById('pc-job-form-card').style.display = 'block';
    document.getElementById('job-edit-idx').value = '-1';
    document.getElementById('pc-job-form-title').textContent = 'New Application';
    ['job-company','job-role','job-notes','job-url'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('job-status').value = 'applied';
    document.getElementById('job-date').value = new Date().toISOString().slice(0,10);
  });

  document.getElementById('pc-cancel-job').addEventListener('click', () => {
    document.getElementById('pc-job-form-card').style.display = 'none';
  });

  document.getElementById('pc-save-job').addEventListener('click', () => {
    const jobs = getJobs();
    const entry = {
      company: document.getElementById('job-company').value.trim(),
      role:    document.getElementById('job-role').value.trim(),
      date:    document.getElementById('job-date').value,
      status:  document.getElementById('job-status').value,
      url:     document.getElementById('job-url').value.trim(),
      notes:   document.getElementById('job-notes').value.trim(),
    };
    if (!entry.company || !entry.role) { alert('Company and Role are required.'); return; }
    const idx = parseInt(document.getElementById('job-edit-idx').value);
    if (idx >= 0) { jobs[idx] = entry; } else { jobs.push(entry); }
    saveJobs(jobs);
    renderJobs();
  });

  /* Edit / Delete delegation */
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', function() {
      const jobs = getJobs();
      const i = parseInt(this.dataset.edit);
      const j = jobs[i];
      document.getElementById('pc-job-form-card').style.display = 'block';
      document.getElementById('pc-job-form-title').textContent = 'Edit Application';
      document.getElementById('job-edit-idx').value = i;
      document.getElementById('job-company').value = j.company||'';
      document.getElementById('job-role').value    = j.role||'';
      document.getElementById('job-date').value    = j.date||'';
      document.getElementById('job-status').value  = j.status||'applied';
      document.getElementById('job-url').value     = j.url||'';
      document.getElementById('job-notes').value   = j.notes||'';
    });
  });
  document.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', function() {
      if (!confirm('Delete this application?')) return;
      const jobs = getJobs();
      jobs.splice(parseInt(this.dataset.del), 1);
      saveJobs(jobs);
      renderJobs();
    });
  });
}

/* ----------------------------------------------------------
   SESSION RESTORE
   ---------------------------------------------------------- */
async function restoreSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    document.getElementById('pc-login-trigger').style.display = 'none';
    document.getElementById('pc-dash-btn').style.display      = 'flex';
  }
}

/* ----------------------------------------------------------
   INIT
   ---------------------------------------------------------- */
async function init() {
  injectCSS();
  await loadSupabase();
  buildDOM();
  wireToggleMode();
  await restoreSession();

  /* Listen for auth state changes */
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
    }
  });
}

/* ----------------------------------------------------------
   ENTRY POINT
   ---------------------------------------------------------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
