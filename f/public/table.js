import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
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
 
// List of UIDs allowed to edit
const editorUIDs = ['WNV8ey27AvVzHEO3m0upBxXDcuH3','sJIe9xk7DvMAoHSOHo4M7nfvRmU2']; // Add other UIDs to this array as needed

let selectedMonth = null;
let selectedDay = null;
let selectedTime = null;

auth.onAuthStateChanged((user) => {
  if (user) {
    if (editorUIDs.includes(user.uid)) {
      // User is an editor
      document.getElementById('input-screen').style.display = 'block';
    } else {
      // User is not an editor
      alert("You do not have permission to input data.");
      window.location.href = 'view.html';
    }
  } else {
    // User is not signed in
    alert("You need to sign in to input data.");
    window.location.href = 'view.html';
  }
});

window.selectMonth = (month) => {
  selectedMonth = month;
  document.getElementById('days-container').style.display = 'block';
  document.getElementById('days').innerHTML = generateDaysButtons(month);
  document.getElementById('time-form').style.display = 'none';
  document.getElementById('data-form').style.display = 'none';
};

window.selectDay = (day) => {
  selectedDay = day;
  document.getElementById('time-form').style.display = 'block';
  document.getElementById('data-form').style.display = 'none';
};

window.selectTime = (time) => {
  selectedTime = time;
  document.getElementById('data-form').style.display = 'block';
  document.getElementById('dataTable').innerHTML = ''; // Clear previous rows
  addRow(); // Add initial row
};

window.addRow = () => {
  const table = document.getElementById('dataTable');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="form-control" required></td>
    <td><input type="number" step="0.01" class="form-control" required></td>
    <td><input type="number" step="0.01" class="form-control" required></td>
  `;
  table.appendChild(newRow);
};

window.submitData = async () => {
  const table = document.getElementById('dataTable');
  const rows = table.querySelectorAll('tr');
  const data = [];
  for (let i = 0; i < rows.length; i++) {
    const inputs = rows[i].querySelectorAll('input');
    data.push({
      text: inputs[0].value,
      number1: parseFloat(inputs[1].value),
      number2: parseFloat(inputs[2].value)
    });
  }
  const dateKey = `${selectedDay.toString().padStart(2, '0')}.${selectedMonth.toString().padStart(2, '0')}.24-${selectedTime}`;
  try {
    await setDoc(doc(db, "data", dateKey), { data });
    alert('Данные успешно добавлены');
  } catch (error) {
    console.error('Ошибка добавления данных: ', error);
    alert('Ошибка добавления данных');
  }
};

window.generateDaysButtons = (month) => {
  const daysInMonth = new Date(2024, month, 0).getDate(); // Leap year for Feb 29th
  let buttonsHTML = '';
  for (let i = 1; i <= daysInMonth; i++) {
    buttonsHTML += `<button type="button" class="btn btn-outline-primary" onclick="selectDay(${i})">${i.toString().padStart(2, '0')}.05.24</button>`;
  }
  return buttonsHTML;
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
