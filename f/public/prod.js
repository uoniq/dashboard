
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const saveForm = document.getElementById('saveForm');
    saveForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const rows = document.getElementById('dataTable').querySelectorAll('tr');
      const dataToSave = [];

      rows.forEach(row => {
        const textSelect = row.querySelector('select').value;
        const quantityInput = parseInt(row.querySelector('input').value);

        dataToSave.push({
          userId: user.uid,
          option: textSelect,
          quantity: quantityInput,
          timestamp: new Date()
        });
      });

      try {
        const batch = writeBatch(db);
        dataToSave.forEach(data => {
          const docRef = doc(collection(db, 'savedData'));
          batch.set(docRef, data);
        });
        await batch.commit();
        
        alert('Data saved successfully');
        saveForm.reset();
        document.getElementById('dataTable').innerHTML = `
          <tr>
            <td>
              <select class="form-control" required>
                <option value="Масло">Масло</option>
                <option value="Сыр">Сыр</option>
                <option value="Йогурт">Йогурт</option>
              </select>
            </td>
            <td>
              <input type="number" class="form-control" required>
            </td>
            <td>
              <button type="button" class="btn btn-danger" onclick="removeRow(this)">Удалить</button>
            </td>
          </tr>
        `;
      } catch (error) {
        console.error('Error saving data: ', error);
        alert('Error saving data');
      }
    });
  } else {
    alert("You need to sign in to save data.");
    window.location.href = 'login.html';
  }
});

window.addRow = () => {
  const table = document.getElementById('dataTable');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>
      <select class="form-control" required>
        <option value="Масло">Масло</option>
        <option value="Сыр">Сыр</option>
        <option value="Йогурт">Йогурт</option>
        <!-- Add more options as needed -->
      </select>
    </td>
    <td>
      <input type="number" class="form-control" required>
    </td>
    <td>
      <button type="button" class="btn btn-danger" onclick="removeRow(this)">Удалить</button>
    </td>
  `;
  table.appendChild(newRow);
};

window.removeRow = (button) => {
  const row = button.closest('tr');
  row.remove();
};