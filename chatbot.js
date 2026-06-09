import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ---- REPLACE 1: Your Firebase config ----
const firebaseConfig = {
  apiKey: "AIzaSyAHxZSmuttWE1OuYw2JZTUfZKfxATeAStE",
  authDomain: "learn-it-bbd69.firebaseapp.com",
  projectId: "learn-it-bbd69",
  storageBucket: "learn-it-bbd69.firebasestorage.app",
  messagingSenderId: "393926010027",
  appId: "1:393926010027:web:34c4e2d6a41b9ee7e603ee"
};

// ---- REPLACE 2: Your Gemini API key ----
const GEMINI_API_KEY = "AQ.Ab8RN6KkY1zmETll9CKl2mOsmw--RSIje1MhQGPNA4-a3MG4Iw';

// ---- REPLACE 3: Your WhatsApp number (country code + number, no spaces) ----
const WHATSAPP_NUMBER = "265885665201";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let portfolioContext = "";
let messageCount = 0;
let sessionId = null;

// Load portfolio data from Firebase on page load
async function loadPortfolioContext() {
  try {
    const docRef = doc(db, "portfolio", "owner");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      portfolioContext = `
        You are an AI assistant representing ${data.name}.
        Your job is to answer questions about them professionally and warmly.
        Only answer based on the information below. If you do not know something, say so politely.

        Name: ${data.name}
        Title: ${data.title}
        Bio: ${data.bio}
        Skills: ${data.skills}
        Projects: ${data.projects}
        Contact: ${data.contact}

        Always be professional, friendly, and speak positively about ${data.name}.
        Keep responses concise and clear.
      `;
      // Set WhatsApp button link
      document.getElementById("whatsappBtn").href =
        `https://wa.me/${data.whatsapp}?text=Hi%20${encodeURIComponent(data.name)}%2C%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect.`;
    }
  } catch (error) {
    console.error("Error loading portfolio data:", error);
  }
}

// Create a new session in Firebase when chat starts
async function createSession() {
  try {
    const sessionRef = await addDoc(collection(db, "chatSessions"), {
      startedAt: serverTimestamp(),
      messages: []
    });
    sessionId = sessionRef.id;
  } catch (error) {
    console.error("Error creating session:", error);
  }
}

// Log each message to Firebase
async function logMessage(role, text) {
  if (!sessionId) return;
  try {
    const msgRef = collection(db, "chatSessions", sessionId, "messages");
    await addDoc(msgRef, {
      role,
      text,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging message:", error);
  }
}

// Send message to Gemini and get response
async function sendMessage() {
  const input = document.getElementById("chatInput");
  const question = input.value.trim();
  if (!question) return;

  // First message creates a session
  if (messageCount === 0) await createSession();
  messageCount++;

  // Show user message
  appendMessage(question, "user");
  input.value = "";

  // Log user message
  await logMessage("user", question);

  // Show typing indicator
  const typingId = appendMessage("...", "bot");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${portfolioContext}\n\nVisitor question: ${question}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am not sure about that. Please contact me directly.";

    // Replace typing indicator with real response
    updateMessage(typingId, reply);

    // Log bot response
    await logMessage("bot", reply);

    // Show WhatsApp button after 2 exchanges
    if (messageCount >= 2) {
      document.getElementById("whatsappPrompt").style.display = "block";
    }

  } catch (error) {
    updateMessage(typingId, "Something went wrong. Please try again.");
    console.error("Gemini error:", error);
  }
}

// Add a message bubble to the chat
function appendMessage(text, sender) {
  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  const id = "msg-" + Date.now();
  div.id = id;
  div.className = `message ${sender === "user" ? "user-message" : "bot-message"}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

// Update an existing message bubble
function updateMessage(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// Allow pressing Enter to send
document.getElementById("chatInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

// Load context when page opens
loadPortfolioContext();
