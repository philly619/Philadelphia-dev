// ============================================================
//  firebase-config.js
//  ⚠️  REPLACE the placeholder values below with your own
//  Firebase project credentials from:
//  console.firebase.google.com → Project Settings → Your Apps
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyByjBAAQm20RP9_Zv5ebTJkLvdjHTaIHL4",
  authDomain:        "philadelphia-portfolio.firebaseapp.com",
  projectId:         "philadelphia-portfolio",
  storageBucket:     "philadelphia-portfolio.firebasestorage.app",
  messagingSenderId: "876541007477",
  appId:             "1:876541007477:web:7fa22d0388f0fd484cca3c"
   measurementId:    "G-H56QD53XY1"
};

// Initialize Firebase (compat SDK — already loaded in HTML)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ── Google Auth Provider ──
const googleProvider = new firebase.auth.GoogleAuthProvider();
