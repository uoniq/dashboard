import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, query, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
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

let initials = '';

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userId = user.uid;
    console.log('User ID:', userId);

    try {
      // Fetch user's full name
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User Data:', userData);
        const fullName = userData.firstName;

        // Derive initials from full name
        initials = fullName.split(' ').map(part => part[0]).join('').toUpperCase();
        console.log('Initials:', initials);
        
        document.getElementById('user-info').textContent = `Ваши данные (${initials})`;
        
        // Fetch and display data for the user
        fetchDataForUser(initials);
      } else {
        console.error("Пользователь не найден.");
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя: ", error);
    }
  } else {
    alert("Вы не авторизованы.");
    window.location.href = 'login.html';
  }
});

function parseDate(dateString) {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year + 2000, month - 1, day); // Adjust year to 20xx
}

async function fetchDataForUser(initials, startDate = new Date(0)) {
  console.log('Fetching data for initials:', initials, 'from date:', startDate);
  try {
    const q = query(collection(db, "data"));
    const querySnapshot = await getDocs(q);
    const dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = ''; // Clear previous results

    let totalSum = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Doc Data:', data);
      const dateKey = doc.id.split('-')[0];
      const docDate = parseDate(dateKey);
      console.log('Doc Date:', docDate, 'Start Date:', startDate);

      if (docDate >= startDate) {
        data.data.forEach((entry) => {
          console.log('Entry:', entry);
          if (entry.text.includes(initials)) {
            console.log('Matching Entry:', entry);
            const formulaResult = (entry.number1 * entry.number2 / 3.4).toFixed(2);
            totalSum += parseFloat(formulaResult);

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
              <td>${dateKey}</td>
              <td>${entry.text}</td>
              <td>${entry.number1}</td>
              <td>${entry.number2}</td>
              <td>${formulaResult}</td>
            `;
            dataTable.appendChild(newRow);
            console.log('New Row:', newRow);
          }
        });
      }
    });

    document.getElementById('summary').textContent = `Итого за период: ${totalSum.toFixed(2)} л.`;

  } catch (error) {
    console.error("Ошибка при получении данных: ", error);
  }
}

window.filterData = (period) => {
  const now = new Date();
  let startDate;
  
  if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    startDate = new Date(0); // All time
  }

  fetchDataForUser(initials, startDate);
};
