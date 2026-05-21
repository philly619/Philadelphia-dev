const loginForm = document.getElementById("loginForm");
const authContainer = document.getElementById("authContainer");
const dashboard = document.getElementById("dashboard");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

const applicationForm = document.getElementById("applicationForm");
const applicationTableBody = document.getElementById(
  "applicationTableBody"
);

const cvForm = document.getElementById("cvForm");
const cvContent = document.getElementById("cvContent");

const totalApplications = document.getElementById("totalApplications");
const pendingApplications = document.getElementById("pendingApplications");
const interviewApplications = document.getElementById(
  "interviewApplications"
);

const securityLogs = document.getElementById("securityLogs");
const clearLogsBtn = document.getElementById("clearLogsBtn");
const adminCode = document.getElementById("adminCode");

/* ADMIN SETTINGS */
const ADMIN_CODE = "ADMIN123";
const MAX_ATTEMPTS = 5;

/* STORAGE */
let failedAttempts =
  Number(localStorage.getItem("failedAttempts")) || 0;

let applications =
  JSON.parse(localStorage.getItem("applications")) || [];

let logs =
  JSON.parse(localStorage.getItem("securityLogs")) || [];

/* SAVE LOGS */
function saveLogs() {
  localStorage.setItem(
    "securityLogs",
    JSON.stringify(logs)
  );
}

/* ADD SECURITY LOG */
function addLog(message) {

  const timestamp = new Date().toLocaleString();

  logs.push(`${timestamp} - ${message}`);

  saveLogs();

  renderLogs();
}

/* RENDER LOGS */
function renderLogs() {

  securityLogs.innerHTML = "";

  logs.forEach((log) => {

    const li = document.createElement("li");

    li.textContent = log;

    securityLogs.appendChild(li);

  });

}

/* PASSWORD VALIDATION */
function validatePassword(password) {

  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  return regex.test(password);

}

/* LOGIN SYSTEM */
loginForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value.trim();

  /* LOCK ACCOUNT */
  if (failedAttempts >= MAX_ATTEMPTS) {

    loginMessage.textContent =
      "Account locked after too many failed attempts.";

    loginMessage.style.color = "red";

    addLog(
      "Blocked login attempt after account lock."
    );

    return;
  }

  /* EMAIL VALIDATION */
  if (!email.includes("@")) {

    loginMessage.textContent =
      "Email must contain @";

    loginMessage.style.color = "red";

    failedAttempts++;

    localStorage.setItem(
      "failedAttempts",
      failedAttempts
    );

    addLog(
      "Failed login attempt: Invalid email format."
    );

    return;
  }

  /* PASSWORD VALIDATION */
  if (!validatePassword(password)) {

    loginMessage.textContent =
      "Password must contain letters, numbers and symbols.";

    loginMessage.style.color = "red";

    failedAttempts++;

    localStorage.setItem(
      "failedAttempts",
      failedAttempts
    );

    addLog(
      "Failed login attempt: Weak password format."
    );

    return;
  }

  /* SUCCESS LOGIN */
  authContainer.classList.add("hidden");

  dashboard.classList.remove("hidden");

  loginMessage.textContent =
    "Login successful.";

  loginMessage.style.color =
    "lightgreen";

  addLog(`Successful login by ${email}`);

});

/* LOGOUT */
logoutBtn.addEventListener("click", () => {

  dashboard.classList.add("hidden");

  authContainer.classList.remove("hidden");

  addLog("User logged out.");

});

/* SAVE APPLICATIONS */
function saveApplications() {

  localStorage.setItem(
    "applications",
    JSON.stringify(applications)
  );

}

/* UPDATE DASHBOARD STATS */
function updateStats() {

  totalApplications.textContent =
    applications.length;

  pendingApplications.textContent =
    applications.filter(
      (app) => app.status === "Pending"
    ).length;

  interviewApplications.textContent =
    applications.filter(
      (app) => app.status === "Interview"
    ).length;

}

/* RENDER APPLICATIONS */
function renderApplications() {

  applicationTableBody.innerHTML = "";

  applications.forEach((application, index) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${application.company}</td>

      <td>${application.role}</td>

      <td>${application.status}</td>

      <td>${application.date}</td>

      <td>
        <button
          class="delete-btn"
          onclick="deleteApplication(${index})"
        >
          Delete
        </button>
      </td>
    `;

    applicationTableBody.appendChild(row);

  });

  updateStats();

}

/* ADD APPLICATION */
applicationForm.addEventListener(
  "submit",
  (e) => {

    e.preventDefault();

    const company =
      document.getElementById("company").value;

    const role =
      document.getElementById("role").value;

    const status =
      document.getElementById("status").value;

    const newApplication = {

      company,

      role,

      status,

      date: new Date().toLocaleDateString(),

    };

    applications.push(newApplication);

    saveApplications();

    renderApplications();

    addLog(
      `Application added for ${company}`
    );

    applicationForm.reset();

  }
);

/* DELETE APPLICATION */
function deleteApplication(index) {

  const removed = applications[index];

  applications.splice(index, 1);

  saveApplications();

  renderApplications();

  addLog(
    `Application deleted for ${removed.company}`
  );

}

/* CV BUILDER */
cvForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const name =
    document.getElementById("fullName").value;

  const profession =
    document.getElementById("profession").value;

  const skills =
    document.getElementById("skills").value;

  const experience =
    document.getElementById("experience").value;

  cvContent.innerHTML = `

    <h2>${name}</h2>

    <h4>${profession}</h4>

    <hr>

    <h3>Skills</h3>

    <p>${skills}</p>

    <h3>Experience</h3>

    <p>${experience}</p>

  `;

  addLog(`CV generated for ${name}`);

});

/* ADMIN CLEAR LOGS */
clearLogsBtn.addEventListener(
  "click",
  () => {

    if (
      adminCode.value !== ADMIN_CODE
    ) {

      alert(
        "Only admin can clear logs."
      );

      addLog(
        "Unauthorized log deletion attempt."
      );

      return;
    }

    logs = [];

    saveLogs();

    renderLogs();

    alert(
      "Logs cleared successfully."
    );

  }
);

/* INITIAL RENDER */
renderApplications();

renderLogs();
renderLogs();
