// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADuXWmL3EbSv1K1fVUbAr_uEbZWsylt5U",
  authDomain: "dashboard-face5.firebaseapp.com",
  projectId: "dashboard-face5",
  storageBucket: "dashboard-face5.appspot.com",
  messagingSenderId: "710225325551",
  appId: "1:710225325551:web:2623e62b406ac12067da1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message; 
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Handle Sign In
const signInButton = document.getElementById('submitSignIn');
signInButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Attempting to sign in with:", email);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    showMessage('Login is successful', 'signInMessage');
    localStorage.setItem('loggedInUserId', user.uid);
    console.log("SignIn Success:", user);
    window.location.href = 'profile.html';
  } catch (error) {
    console.error("SignIn Error:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);

    if (errorCode === 'auth/wrong-password') {
      showMessage('Incorrect password', 'signInMessage');
    } else if (errorCode === 'auth/user-not-found') {
      showMessage('User not found', 'signInMessage');
    } else if (errorCode === 'auth/invalid-email') {
      showMessage('Invalid email', 'signInMessage');
    } else {
      showMessage('Error logging in', 'signInMessage');
    }
  }
});

