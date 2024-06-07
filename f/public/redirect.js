import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyADuXWmL3EbSv1K1fVUbAr_uEbZWsylt5U",
  authDomain: "dashboard-face5.firebaseapp.com",
  projectId: "dashboard-face5",
  storageBucket: "dashboard-face5.appspot.com",
  messagingSenderId: "710225325551",
  appId: "1:710225325551:web:2623e62b406ac12067da1a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const uidToPageMap = {
  'WNV8ey27AvVzHEO3m0upBxXDcuH3': 'table.html',
  'rxkmbVXnEgV2nfvDBDgQZsoZepl1': 'view.html',
  'sJIe9xk7DvMAoHSOHo4M7nfvRmU2' : 'table.html',
  'OEygomH6OXa5JelywgnI4mOWr7V2' : 'view.html'
};
const uidToSavePageMap = {
  'WNV8ey27AvVzHEO3m0upBxXDcuH3': 'profile.html',
  'rxkmbVXnEgV2nfvDBDgQZsoZepl1': 'prod.html',
  'sJIe9xk7DvMAoHSOHo4M7nfvRmU2' : 'profile.html',
  'OEygomH6OXa5JelywgnI4mOWr7V2' : 'prod.html'
};

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.uid;
      console.log('User ID:', userId);

      let targetViewPage = 'viewprof.html'; // Default page for view/input
      let targetSavePage = 'prodview.html'; // Default page for save/display

      if (uidToPageMap.hasOwnProperty(userId)) {
        targetViewPage = uidToPageMap[userId];
      }

      if (uidToSavePageMap.hasOwnProperty(userId)) {
        targetSavePage = uidToSavePageMap[userId];
      }

      const viewInputButton = document.getElementById('viewInputButton');
      const saveDisplayButton = document.getElementById('saveDisplayButton');

      if (viewInputButton) {
        viewInputButton.setAttribute('href', targetViewPage);
      }

      if (saveDisplayButton) {
        saveDisplayButton.setAttribute('href', targetSavePage);
      }
    } else {
      alert("You need to sign in.");
      window.location.href = 'index.html';
    }
  });
});