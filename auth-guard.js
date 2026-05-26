// ============================================================
//  auth.js  —  Login page logic
// ============================================================

const errorBox   = document.getElementById('auth-error');
const loginForm  = document.getElementById('login-form');
const regForm    = document.getElementById('register-form');

// ── Tab switching ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab === 'login' ? 'login-form' : 'register-form').classList.add('active');
    hideError();
  });
});

// ── Password toggles ──
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// ── Helpers ──
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}
function hideError() { errorBox.classList.add('hidden'); }

function setLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Working…';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.label;
  }
}

// Save original labels
document.getElementById('login-btn').dataset.label =
  '<span>Sign In</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
document.getElementById('reg-btn').dataset.label =
  '<span>Create Account</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

// ── Auth state — redirect if already signed in ──
auth.onAuthStateChanged(user => {
  if (user) window.location.href = 'dashboard.html';
});

// ── Login ──
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  hideError();
  const btn = document.getElementById('login-btn');
  setLoading(btn, true);
  try {
    await auth.signInWithEmailAndPassword(
      document.getElementById('login-email').value.trim(),
      document.getElementById('login-password').value
    );
    // redirect handled by onAuthStateChanged
  } catch (err) {
    showError(friendlyError(err.code));
    setLoading(btn, false);
  }
});

// ── Register ──
regForm.addEventListener('submit', async e => {
  e.preventDefault();
  hideError();
  const btn = document.getElementById('reg-btn');
  setLoading(btn, true);
  try {
    const cred = await auth.createUserWithEmailAndPassword(
      document.getElementById('reg-email').value.trim(),
      document.getElementById('reg-password').value
    );
    await cred.user.updateProfile({ displayName: document.getElementById('reg-name').value.trim() });
  } catch (err) {
    showError(friendlyError(err.code));
    setLoading(btn, false);
  }
});

// ── Google Sign-In ──
document.getElementById('google-btn').addEventListener('click', async () => {
  hideError();
  try {
    await auth.signInWithPopup(googleProvider);
  } catch (err) {
    showError(friendlyError(err.code));
  }
});

// ── Human-readable errors ──
function friendlyError(code) {
  const map = {
    'auth/user-not-found':      'No account found with that email.',
    'auth/wrong-password':      'Incorrect password. Try again.',
    'auth/email-already-in-use':'An account already exists with that email.',
    'auth/weak-password':       'Password must be at least 6 characters.',
    'auth/invalid-email':       'Please enter a valid email address.',
    'auth/popup-closed-by-user':'Sign-in popup was closed.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
