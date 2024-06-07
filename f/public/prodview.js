import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, getDocs , getDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

async function getUserName(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData.firstName;
  } else {
    return "Unknown User";
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const querySnapshot = await getDocs(collection(db, 'savedData'));
      const dataTable = document.getElementById('dataTable');
      dataTable.innerHTML = ''; // Clear previous results

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const userName = await getUserName(data.userId);
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${userName}</td>
          <td>${data.option}</td>
          <td>${data.quantity}</td>
          <td>${data.timestamp.toDate().toLocaleString()}</td>
        `;
        dataTable.appendChild(newRow);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      alert('Error fetching data');
    }
  } else {
    alert("You need to sign in to view data.");
    window.location.href = 'login.html';
  }
});