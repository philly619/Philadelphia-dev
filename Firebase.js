// FIREBASE

import { initializeApp }
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {

    getAuth,

    GithubAuthProvider,

    signInWithPopup,

    signOut

}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {

    getFirestore,

    collection,

    addDoc,

    getDocs

}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// FIREBASE CONFIG

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_AUTH_DOMAIN",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_STORAGE_BUCKET",

    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

    appId: "YOUR_APP_ID"

};

// INITIALIZE

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GithubAuthProvider();

const db = getFirestore(app);

// LOGIN

document
.getElementById("github-login")
.addEventListener("click", () => {

    signInWithPopup(auth, provider)

    .then((result) => {

        const user = result.user;

        localStorage.setItem(
            "developerUser",
            JSON.stringify(user)
        );

        // PROFILE

        document
        .getElementById("profile-image")
        .src = user.photoURL;

        document
        .getElementById("profile-name")
        .innerText = user.displayName;

        showDashboard();

    })

    .catch((error) => {

        console.log(error);

    });

});

// LOGOUT

document
.getElementById("logout-btn")
.addEventListener("click", () => {

    signOut(auth)

    .then(() => {

        localStorage.removeItem(
            "developerUser"
        );

        location.reload();

    });

});

// SHOW DASHBOARD

function showDashboard(){

    document
    .getElementById("login-section")
    .classList.add("hidden");

    document
    .getElementById("dashboard-section")
    .classList.remove("hidden");

}

// AUTO LOGIN

const savedUser =
localStorage.getItem("developerUser");

if(savedUser){

    const user =
    JSON.parse(savedUser);

    document
    .getElementById("profile-image")
    .src = user.photoURL;

    document
    .getElementById("profile-name")
    .innerText = user.displayName;

    showDashboard();

}

// CV BUILDER

document
.getElementById("generate-cv")
.addEventListener("click", async () => {

    const name =
    document.getElementById("full-name").value;

    const title =
    document.getElementById("job-title").value;

    const summary =
    document.getElementById("summary").value;

    const skills =
    document.getElementById("skills").value;

    // PREVIEW

    document
    .getElementById("cv-preview")
    .innerHTML = `

        <div class="cv-card">

            <h1>${name}</h1>

            <h3>${title}</h3>

            <p>${summary}</p>

            <h4>Skills</h4>

            <p>${skills}</p>

        </div>

    `;

    // SAVE TO FIREBASE

    try{

        await addDoc(
            collection(db, "cvs"),
            {

                fullName: name,

                title: title,

                summary: summary,

                skills: skills,

                createdAt: new Date()

            }
        );

    }
    catch(error){

        console.log(error);

    }

});

// DOWNLOAD PDF

document
.getElementById("download-cv")
.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const content =
    document.getElementById("cv-preview").innerText;

    doc.text(content, 10, 10);

    doc.save("Philadelphia_CV.pdf");

});

// SAVE JOB

document
.getElementById("save-job")
.addEventListener("click", async () => {

    const company =
    document.getElementById("company").value;

    const role =
    document.getElementById("role").value;

    const status =
    document.getElementById("status").value;

    try{

        await addDoc(
            collection(db, "jobs"),
            {

                company: company,

                role: role,

                status: status,

                createdAt: new Date()

            }
        );

        loadJobs();

    }
    catch(error){

        console.log(error);

    }

});

// LOAD JOBS

async function loadJobs(){

    const querySnapshot =
    await getDocs(collection(db, "jobs"));

    let html = "";

    querySnapshot.forEach((doc) => {

        const job = doc.data();

        html += `

            <div class="job-item">

                <h3>${job.company}</h3>

                <p>${job.role}</p>

                <span>${job.status}</span>

            </div>

        `;

    });

    document
    .getElementById("job-list")
    .innerHTML = html;

}

loadJobs();

// THEME TOGGLE

document
.getElementById("theme-toggle")
.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-mode"
    );

});

console.log(
    "Philadelphia Developer Dashboard Loaded"
);
