// ============================================================
//  dashboard.js  —  Full dashboard logic
//  CV Builder, Portfolio Manager, Job Application Database
//  All data persisted to Firestore under users/{uid}/
// ============================================================

const db = firebase.firestore();

let currentFilter = 'all';
let editingProjectId = null;

// ── Wait for auth ──
document.addEventListener('auth-ready', ({ detail: user }) => {
  initUser(user);
  loadAll();
});

// ── Init User UI ──
function initUser(user) {
  const name  = user.displayName || user.email.split('@')[0];
  const email = user.email;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  document.getElementById('greeting-name').textContent = name.split(' ')[0];
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-email').textContent = email;
  document.getElementById('user-avatar').textContent = initials;
}

// ── Sign out ──
document.getElementById('signout-btn').addEventListener('click', async () => {
  await firebase.auth().signOut();
  window.location.href = 'index.html';
});

// ── Panel switching ──
function switchPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  document.querySelector(`.nav-item[data-panel="${id}"]`).classList.add('active');
  closeSidebar();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
});

// ── Mobile sidebar ──
document.getElementById('hamburger').addEventListener('click', () =>
  document.getElementById('sidebar').classList.add('open'));
document.getElementById('sidebar-close').addEventListener('click', closeSidebar);

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

// ── Firestore helpers ──
function uid() { return firebase.auth().currentUser.uid; }
function col(path) { return db.collection(`users/${uid()}/${path}`); }

// ============================================================
//  LOAD ALL DATA
// ============================================================
async function loadAll() {
  await Promise.all([loadCV(), loadProjects(), loadJobs()]);
  updateStats();
}

// ============================================================
//  CV BUILDER
// ============================================================
let cvData = { name:'', title:'', email:'', phone:'', location:'', summary:'', skills:'', edu:[], exp:[] };

async function loadCV() {
  const doc = await db.doc(`users/${uid()}/cv/main`).get();
  if (doc.exists) {
    cvData = doc.data();
    populateCVForm();
    renderCVPreview();
  }
}

function populateCVForm() {
  ['name','title','email','phone','location','summary','skills'].forEach(f => {
    const el = document.getElementById('cv-' + f);
    if (el) el.value = cvData[f] || '';
  });
  cvData.edu.forEach(e => renderDynamicItem('edu', e));
  cvData.exp.forEach(e => renderDynamicItem('exp', e));
}

// Live preview on input
['cv-name','cv-title','cv-email','cv-phone','cv-location','cv-summary','cv-skills'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', renderCVPreview);
});

function renderCVPreview() {
  const g = id => document.getElementById(id)?.value || '';
  document.getElementById('prev-name').textContent      = g('cv-name') || 'Your Name';
  document.getElementById('prev-title').textContent     = g('cv-title');
  document.getElementById('prev-email').textContent     = g('cv-email');
  document.getElementById('prev-phone').textContent     = g('cv-phone') ? ' · ' + g('cv-phone') : '';
  document.getElementById('prev-location').textContent  = g('cv-location') ? ' · ' + g('cv-location') : '';
  document.getElementById('prev-summary').textContent   = g('cv-summary');

  const skillsEl = document.getElementById('prev-skills');
  skillsEl.innerHTML = g('cv-skills').split(',').filter(s => s.trim()).map(s =>
    `<span class="skill-pill">${s.trim()}</span>`
  ).join('');

  // edu/exp rendered dynamically — preview updated in addItem/removeItem
}

async function saveCV() {
  const g = id => document.getElementById(id)?.value || '';
  cvData = {
    name: g('cv-name'), title: g('cv-title'), email: g('cv-email'),
    phone: g('cv-phone'), location: g('cv-location'), summary: g('cv-summary'),
    skills: g('cv-skills'),
    edu: collectItems('edu'),
    exp: collectItems('exp'),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.doc(`users/${uid()}/cv/main`).set(cvData);
  showToast('CV saved!');
  updateStats();
}

function printCV() {
  window.print();
}

// Dynamic edu/exp items
let itemCounts = { edu: 0, exp: 0 };

function addItem(type, data = {}) {
  const id = type + '_' + (++itemCounts[type]);
  renderDynamicItem(type, data, id);
}

function renderDynamicItem(type, data = {}, id) {
  if (!id) id = type + '_' + (++itemCounts[type]);
  const list = document.getElementById(type + '-list');
  const isEdu = type === 'edu';
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.dataset.id = id;
  div.innerHTML = `
    <button class="btn-delete" onclick="removeItem('${type}','${id}')">✕</button>
    <div class="form-row">
      <div class="field-group">
        <label>${isEdu ? 'Degree / Qualification' : 'Job Title'}</label>
        <input type="text" name="title" value="${data.title||''}" placeholder="${isEdu ? 'Bachelor of Applied Accounting' : 'Software Developer'}" />
      </div>
      <div class="field-group">
        <label>${isEdu ? 'Institution' : 'Company'}</label>
        <input type="text" name="org" value="${data.org||''}" placeholder="${isEdu ? 'Malawi College of Accountancy' : 'Company Name'}" />
      </div>
    </div>
    <div class="form-row">
      <div class="field-group">
        <label>Start Year</label>
        <input type="text" name="start" value="${data.start||''}" placeholder="2022" />
      </div>
      <div class="field-group">
        <label>End Year</label>
        <input type="text" name="end" value="${data.end||''}" placeholder="2027 / Present" />
      </div>
    </div>
    <div class="field-group">
      <label>Description</label>
      <textarea name="desc" rows="2" placeholder="Brief description…">${data.desc||''}</textarea>
    </div>
  `;
  list.appendChild(div);
  div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updatePreviewItems));
  updatePreviewItems();
}

function removeItem(type, id) {
  const el = document.querySelector(`.dynamic-item[data-id="${id}"]`);
  if (el) el.remove();
  updatePreviewItems();
}

function collectItems(type) {
  const items = [];
  document.querySelectorAll(`#${type}-list .dynamic-item`).forEach(div => {
    items.push({
      title: div.querySelector('[name=title]')?.value || '',
      org:   div.querySelector('[name=org]')?.value || '',
      start: div.querySelector('[name=start]')?.value || '',
      end:   div.querySelector('[name=end]')?.value || '',
      desc:  div.querySelector('[name=desc]')?.value || '',
    });
  });
  return items;
}

function updatePreviewItems() {
  ['edu','exp'].forEach(type => {
    const el = document.getElementById('prev-' + type);
    if (!el) return;
    el.innerHTML = collectItems(type).map(i => `
      <div class="cv-item">
        <div class="cv-item-title">${i.title}</div>
        <div class="cv-item-sub">${i.org}${i.start ? ' · ' + i.start : ''}${i.end ? ' — ' + i.end : ''}</div>
        <div class="cv-item-desc">${i.desc}</div>
      </div>
    `).join('');
  });
}

// ============================================================
//  PORTFOLIO
// ============================================================
async function loadProjects() {
  const snap = await col('projects').orderBy('createdAt', 'desc').get();
  const grid = document.getElementById('projects-grid');
  if (snap.empty) {
    grid.innerHTML = '<div class="empty-state">No projects yet. Add your first one!</div>';
    return;
  }
  grid.innerHTML = '';
  snap.forEach(doc => renderProjectCard(doc.id, doc.data()));
  updateStats();
}

function renderProjectCard(id, data) {
  const grid = document.getElementById('projects-grid');
  // Remove empty state
  const empty = grid.querySelector('.empty-state');
  if (empty) empty.remove();

  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.id = id;
  card.innerHTML = `
    <div>
      <div class="project-card-title">${escapeHtml(data.title)}</div>
      <p class="project-card-desc">${escapeHtml(data.desc)}</p>
    </div>
    <div class="project-card-stack">
      ${(data.stack||'').split(',').filter(s=>s.trim()).map(s=>`<span class="stack-pill">${escapeHtml(s.trim())}</span>`).join('')}
    </div>
    <div class="project-card-links">
      ${data.url  ? `<a href="${data.url}" target="_blank">↗ Live</a>` : ''}
      ${data.gh   ? `<a href="${data.gh}"  target="_blank">◈ GitHub</a>` : ''}
    </div>
    <div class="card-actions">
      <button class="btn-ghost" style="font-size:12px;padding:6px 12px;" onclick="editProject('${id}')">Edit</button>
      <button class="btn-delete" onclick="deleteProject('${id}')">✕ Delete</button>
    </div>
  `;
  grid.prepend(card);
}

function openProjectModal(id = null) {
  editingProjectId = id;
  document.getElementById('project-modal-title').textContent = id ? 'Edit Project' : 'Add Project';
  if (!id) document.getElementById('project-form').reset();
  document.getElementById('project-modal').classList.remove('hidden');
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.add('hidden');
  editingProjectId = null;
}

async function editProject(id) {
  const doc = await col('projects').doc(id).get();
  if (!doc.exists) return;
  const d = doc.data();
  document.getElementById('proj-title-input').value = d.title || '';
  document.getElementById('proj-desc-input').value  = d.desc  || '';
  document.getElementById('proj-stack-input').value = d.stack || '';
  document.getElementById('proj-url-input').value   = d.url   || '';
  document.getElementById('proj-gh-input').value    = d.gh    || '';
  openProjectModal(id);
}

document.getElementById('project-form').addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    title: document.getElementById('proj-title-input').value,
    desc:  document.getElementById('proj-desc-input').value,
    stack: document.getElementById('proj-stack-input').value,
    url:   document.getElementById('proj-url-input').value,
    gh:    document.getElementById('proj-gh-input').value,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (editingProjectId) {
    await col('projects').doc(editingProjectId).update(data);
    document.querySelector(`.project-card[data-id="${editingProjectId}"]`)?.remove();
    renderProjectCard(editingProjectId, data);
  } else {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const ref = await col('projects').add(data);
    renderProjectCard(ref.id, data);
  }
  closeProjectModal();
  updateStats();
  showToast('Project saved!');
});

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  await col('projects').doc(id).delete();
  document.querySelector(`.project-card[data-id="${id}"]`)?.remove();
  if (!document.querySelectorAll('.project-card').length) {
    document.getElementById('projects-grid').innerHTML = '<div class="empty-state">No projects yet. Add your first one!</div>';
  }
  updateStats();
  showToast('Project deleted.');
}

// ============================================================
//  JOB APPLICATIONS
// ============================================================
let allJobs = [];

async function loadJobs() {
  const snap = await col('jobs').orderBy('date', 'desc').get();
  allJobs = [];
  snap.forEach(doc => allJobs.push({ id: doc.id, ...doc.data() }));
  renderJobs();
  updateStats();
}

function renderJobs(filter = currentFilter) {
  const tbody = document.getElementById('jobs-tbody');
  const jobs = filter === 'all' ? allJobs : allJobs.filter(j => j.status === filter);
  if (!jobs.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No ${filter === 'all' ? '' : filter + ' '}applications.</td></tr>`;
    return;
  }
  tbody.innerHTML = jobs.map(j => `
    <tr>
      <td>${escapeHtml(j.company)}</td>
      <td>${escapeHtml(j.role)}</td>
      <td>${j.date || ''}</td>
      <td><span class="status-badge status-${j.status}">${j.status}</span></td>
      <td class="notes-cell" title="${escapeHtml(j.notes||'')}">${escapeHtml(j.notes||'—')}</td>
      <td>
        ${j.url ? `<a href="${j.url}" target="_blank" style="color:var(--accent);font-size:12px;">↗</a>` : ''}
        <button class="btn-delete" onclick="deleteJob('${j.id}')">✕</button>
      </td>
    </tr>
  `).join('');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderJobs(currentFilter);
  });
});

function openJobModal() {
  document.getElementById('job-form').reset();
  document.getElementById('job-date').value = new Date().toISOString().slice(0,10);
  document.getElementById('job-modal').classList.remove('hidden');
}
function closeJobModal() { document.getElementById('job-modal').classList.add('hidden'); }

document.getElementById('job-form').addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    company: document.getElementById('job-company').value,
    role:    document.getElementById('job-role').value,
    date:    document.getElementById('job-date').value,
    status:  document.getElementById('job-status').value,
    url:     document.getElementById('job-url').value,
    notes:   document.getElementById('job-notes').value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const ref = await col('jobs').add(data);
  allJobs.unshift({ id: ref.id, ...data });
  renderJobs(currentFilter);
  closeJobModal();
  updateStats();
  showToast('Application logged!');
});

async function deleteJob(id) {
  if (!confirm('Remove this application?')) return;
  await col('jobs').doc(id).delete();
  allJobs = allJobs.filter(j => j.id !== id);
  renderJobs(currentFilter);
  updateStats();
  showToast('Application removed.');
}

// ============================================================
//  STATS
// ============================================================
async function updateStats() {
  const projSnap = await col('projects').get();
  document.getElementById('proj-stat').textContent = projSnap.size;

  document.getElementById('job-stat').textContent = allJobs.length;
  document.getElementById('interview-stat').textContent = allJobs.filter(j => j.status === 'interview' || j.status === 'offer').length;

  const cvDoc = await db.doc(`users/${uid()}/cv/main`).get();
  const cv = cvDoc.exists ? cvDoc.data() : {};
  const filled = ['name','title','email','summary'].filter(f => cv[f]).length;
  document.getElementById('cv-stat').textContent = filled + ' / 4 complete';
}

// ============================================================
//  UTILS
// ============================================================
function escapeHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', bottom:'24px', right:'24px', zIndex:9999,
    background:'#c8a96e', color:'#0a0a0a',
    padding:'10px 18px', borderRadius:'8px',
    fontFamily:'DM Mono, monospace', fontSize:'13px',
    animation:'fadeUp 0.3s ease',
    boxShadow:'none'
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
