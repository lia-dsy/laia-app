// firebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC4tLPFncq5lZSOtYrCS0AvgpoCp79wKww",
  authDomain: "laia-71c3c.firebaseapp.com",
  projectId: "laia-71c3c",
  storageBucket: "laia-71c3c.appspot.com",
  messagingSenderId: "372171171545",
  appId: "1:372171171545:web:856b208a2627b2c73cc0c8",
  measurementId: "G-V632GRTLCB",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;


export { auth, firestore, serverTimestamp};
