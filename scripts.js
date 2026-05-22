/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';

const SUPABASE_ANON_KEY =
  'YOUR_SUPABASE_ANON_KEY';

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


/* =========================================================
   ELEMENTS
========================================================= */

const authScreen =
  document.getElementById('authScreen');

const dashboard =
  document.getElementById('dashboard');

const authForm =
  document.getElementById('authForm');

const signupBtn =
  document.getElementById('signupBtn');

const authMessage =
  document.getElementById('authMessage');

const emailInput =
  document.getElementById('email');

const passwordInput =
  document.getElementById('password');

const logoutBtn =
  document.getElementById('logoutBtn');

const navButtons =
  document.querySelectorAll('.nav-btn');

const sections =
  document.querySelectorAll('.content-section');

const generateCVBtn =
  document.getElementById('generateCVBtn');

const cvPreview =
  document.getElementById('cvPreview');

const saveJobBtn =
  document.getElementById('saveJobBtn');

const jobsList =
  document.getElementById('jobsList');


/* =========================================================
   CHECK USER SESSION
========================================================= */

async function checkUser() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {

    showDashboard();

    loadJobs();

  } else {

    showAuth();

  }

}

checkUser();


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard() {

  authScreen.classList.add('hidden');

  dashboard.classList.remove('hidden');

}


/* =========================================================
   SHOW AUTH
========================================================= */

function showAuth() {

  authScreen.classList.remove('hidden');

  dashboard.classList.add('hidden');

}


/* =========================================================
   LOGIN
========================================================= */

authForm.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value.trim();

    if (!email.includes('@')) {

      authMessage.textContent =
        'Email must contain @';

      return;

    }

    const { error } =
      await supabaseClient.auth
      .signInWithPassword({

        email,
        password

      });

    if (error) {

      authMessage.textContent =
        error.message;

    } else {

      authMessage.textContent =
        'Login successful';

      showDashboard();

      loadJobs();

    }

  }
);


/* =========================================================
   SIGN UP
========================================================= */

signupBtn.addEventListener(
  'click',
  async () => {

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value.trim();

    if (!email.includes('@')) {

      authMessage.textContent =
        'Email must contain @';

      return;

    }

    if (password.length < 6) {

      authMessage.textContent =
        'Password must be at least 6 characters';

      return;

    }

    const { error } =
      await supabaseClient.auth.signUp({

        email,
        password

      });

    if (error) {

      authMessage.textContent =
        error.message;

    } else {

      authMessage.textContent =
        'Account created successfully';

    }

  }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
  'click',
  async () => {

    await supabaseClient.auth.signOut();

    showAuth();

  }
);


/* =========================================================
   NAVIGATION
========================================================= */

navButtons.forEach((button) => {

  button.addEventListener('click', () => {

    navButtons.forEach((btn) => {

      btn.classList.remove('active');

    });

    sections.forEach((section) => {

      section.classList.remove(
        'active-section'
      );

    });

    button.classList.add('active');

    const target =
      button.dataset.section;

    document
      .getElementById(target)
      .classList.add('active-section');

  });

});


/* =========================================================
   CV BUILDER
========================================================= */

generateCVBtn.addEventListener(
  'click',
  () => {

    const name =
      document.getElementById('cvName').value;

    const role =
      document.getElementById('cvRole').value;

    const summary =
      document.getElementById('cvSummary').value;

    const skills =
      document.getElementById('cvSkills').value;

    const experience =
      document.getElementById('cvExperience').value;

    cvPreview.innerHTML = `

      <h1>${name}</h1>

      <h2>${role}</h2>

      <hr>

      <h3>Professional Summary</h3>

      <p>${summary}</p>

      <h3>Skills</h3>

      <p>${skills}</p>

      <h3>Experience</h3>

      <p>${experience}</p>

    `;

  }
);


/* =========================================================
   SAVE JOB APPLICATION
========================================================= */

saveJobBtn.addEventListener(
  'click',
  async () => {

    const company =
      document.getElementById(
        'companyName'
      ).value;

    const role =
      document.getElementById(
        'jobRole'
      ).value;

    const date =
      document.getElementById(
        'applicationDate'
      ).value;

    const status =
      document.getElementById(
        'applicationStatus'
      ).value;

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const { error } =
      await supabaseClient
      .from('job_applications')
      .insert([
        {
          user_id: user.id,
          company,
          role,
          application_date: date,
          status
        }
      ]);

    if (error) {

      alert(error.message);

    } else {

      document.getElementById(
        'companyName'
      ).value = '';

      document.getElementById(
        'jobRole'
      ).value = '';

      document.getElementById(
        'applicationDate'
      ).value = '';

      loadJobs();

    }

  }
);


/* =========================================================
   LOAD JOB APPLICATIONS
========================================================= */

async function loadJobs() {

  jobsList.innerHTML = '';

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) return;

  const {
    data,
    error
  } = await supabaseClient
    .from('job_applications')
    .select('*')
    .eq('user_id', user.id)
    .order(
      'created_at',
      { ascending: false }
    );

  if (error) {

    console.log(error.message);

    return;

  }

  data.forEach((job) => {

    const card =
      document.createElement('div');

    card.classList.add('job-card');

    card.innerHTML = `

      <h3>${job.company}</h3>

      <p>
        <strong>Role:</strong>
        ${job.role}
      </p>

      <p>
        <strong>Date:</strong>
        ${job.application_date}
      </p>

      <p>
        <strong>Status:</strong>
        ${job.status}
      </p>

    `;

    jobsList.appendChild(card);

  });

}
