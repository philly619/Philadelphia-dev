// ============================================================
//  firebase-config.js
//  ⚠️  REPLACE the placeholder values below with your own
//  Firebase project credentials from:
//  console.firebase.google.com → Project Settings → Your Apps
// ============================================================

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// Initialize Firebase (compat SDK — already loaded in HTML)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ── Google Auth Provider ──
const googleProvider = new firebase.auth.GoogleAuthProvider();
