import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Configure Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Get the login form element
const loginForm = document.getElementById('log_in');

// Listen for form submission
loginForm.addEventListener('log_in', (event) => {
  event.preventDefault();

  // Get email and password values
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Create user in Firebase Authentication
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User created successfully
      const user = userCredential.user;
      console.log('User created:', user);

      // Store user data in the Firebase Realtime Database
      const userData = {
        email: user.email,
        displayName: user.displayName,
        password: password,
        // Add additional user data here
      };

      // Generate a unique key for the user entry
      const userKey = push(ref(database, 'users')).key;

      // Update the user data in the Realtime Database
      const userRef = ref(database, `users/${userKey}`);
      update(userRef, userData)
        .then(() => {
          console.log('User data stored in the database.');
        })
        .catch((error) => {
          console.error('Error storing user data:', error);
        });
    })
    .catch((error) => {
      // Error occurred while creating the user
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error creating user:', errorCode, errorMessage);
    });

  // Reset the form fields
  loginForm.reset();
});
