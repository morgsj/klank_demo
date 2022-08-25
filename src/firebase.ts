import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore, collection } from "firebase/firestore";
import { getMessaging, onMessage } from "firebase/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCV3UVLlT6acZVvK5NJM6nEnckMGBgY24",
  authDomain: "klank-a0771.firebaseapp.com",
  projectId: "klank-a0771",
  messagingSenderId: "191396938317",
  appId: "1:191396938317:web:e0614aab007cf64d445204",
  measurementId: "G-8SFLK6CK4T",
  storageBucket: "gs://klank-a0771.appspot.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const messaging = getMessaging(app);

const usersRef = collection(db, "users");
const bookingsRef = collection(db, "bookings");
const venuesRef = collection(db, "venues");
const messagesRef = collection(db, "messages");

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // ...
});

export { auth, db, usersRef, bookingsRef, venuesRef, messagesRef, messaging };
