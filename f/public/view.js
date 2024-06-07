import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
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
 
let selectedMonth = null;

window.selectMonth = (month) => {
  selectedMonth = month;
  document.getElementById('data-view').style.display = 'block';
  document.getElementById('selected-month').textContent = `${selectedMonth.toString().padStart(2, '0')}.24`;
  fetchMonthlyData(selectedMonth);
};

const fetchMonthlyData = async (month) => {
  const daysInMonth = new Date(2024, month, 0).getDate();
  const monthlyDataTable = document.getElementById('monthlyData');
  monthlyDataTable.innerHTML = ''; // Clear previous data
  let totalSum = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKeyMorning = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.24-morning`;
    const dateKeyEvening = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.24-evening`;
    const morningData = await fetchData(dateKeyMorning);
    const eveningData = await fetchData(dateKeyEvening);

    const morningSum = calculateSum(morningData);
    const eveningSum = calculateSum(eveningData);
    const dailySum = morningSum + eveningSum;

    totalSum += dailySum;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.24</td>
      <td>${dailySum.toFixed(2)}</td>
    `;
    monthlyDataTable.appendChild(newRow);
  }

  document.getElementById('totalSum').textContent = totalSum.toFixed(2) + ' л.';
};

const fetchData = async (dateKey) => {
  try {
    const docRef = doc(db, "data", dateKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    return null;
  }
};

const calculateSum = (data) => {
  if (!data) return 0;
  return (parseFloat(data.number1) * parseFloat(data.number2)) / 3.4;
};

// Generate month buttons on page load
document.addEventListener('DOMContentLoaded', () => {
  const monthsContainer = document.getElementById('months');
  for (let month = 1; month <= 12; month++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-primary';
    button.textContent = `${month.toString().padStart(2, '0')}.24`;
    button.onclick = () => selectMonth(month);
    monthsContainer.appendChild(button);
  }
});
