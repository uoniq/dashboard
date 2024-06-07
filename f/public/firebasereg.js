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

// Handle Sign Up
const signUpButton = document.getElementById('submitSignUp');
signUpButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  console.log("Attempting to sign up with:", email);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userData = { email, firstName, lastName };
    await setDoc(doc(db, "users", user.uid), userData);
    showMessage('Account created successfully', 'signUpMessage');
    console.log("SignUp Success:", user);
    window.location.href = 'index.html';
  } catch (error) {
    console.error("SignUp Error:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);

    if (errorCode === 'auth/email-already-in-use') {
      showMessage('Email address already exists', 'signUpMessage');
    } else if (errorCode === 'auth/weak-password') {
      showMessage('Weak password', 'signUpMessage');
    } else {
      showMessage('Unable to create user', 'signUpMessage');
    }
  }
});
