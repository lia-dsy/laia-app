/*Extern libraries import*/
import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

/* Local modules import */

// Import audio play module
import * as audioPlay from "./modules/audioPlay.js";

// Import voice recognition module
// import * as voiceRecognition from "./modules/voiceRecognition.js";

// Import backend requests module
import * as backendRequests from "./modules/backendRequests.js";


firebase.initializeApp({
  // your config
  apiKey: "AIzaSyC4tLPFncq5lZSOtYrCS0AvgpoCp79wKww",
  authDomain: "laia-71c3c.firebaseapp.com",
  projectId: "laia-71c3c",
  storageBucket: "laia-71c3c.appspot.com",
  messagingSenderId: "372171171545",
  appId: "1:372171171545:web:856b208a2627b2c73cc0c8",
  measurementId: "G-V632GRTLCB"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();
const laiaPhotoURL = 'https://i.pinimg.com/1200x/56/88/c1/5688c185a4a0493e2c1f3d5cab0e5a78.jpg';
const laiaID = 'laia';
const audioFormat = 'audio/mp3';


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>LAIA</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        <img 
          src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png" 
          className="google-icon"
        />
        <span>Sign in with Google</span>
      </button>

      <br/>

      <button className="sign-in">
        Log in
      </button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  // Function to handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();

    const { userID, userPhotoURL } = auth.currentUser;

    await addMessageToChat(formValue, userID, userPhotoURL); // Add user's message to the chat
    
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
    
    const response = await backendRequests.sendBackend(formValue);
    
    await addMessageToChat(response.text, laiaID, laiaPhotoURL); // Add Laia's response to the chat

    const audioBlob = audioPlay.convertBase64ToBlob(response.audio, audioFormat);
    const audio = audioPlay.convertBlobToUrl(audioBlob);
    audioPlay.playAudio(audio);
  };

  // Speech recognition function
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-MX';  // Set the language for recognition
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // console.log("Recognized speech: ", transcript);
        setFormValue(transcript);  // Set the recognized text into the input field
      };

      recognition.onend = () => {
        // console.log('Speech recognition has ended');
      };

      recognition.onerror = (event) => {
        console.error('Error occurred during recognition: ', event.error);
      };

      recognition.start();  // Start speech recognition

    } else {
      console.error('Speech Recognition is not supported in your browser.');
    }
  };

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>

        {/* Button to trigger speech recognition */}
        <button type="button" onClick={startRecognition}>🎤</button>
      </form>

      <audio id="audioPlayer" controls></audio>
    </>
  );
}

async function addMessageToChat(messageText, uid, photoURL) {
  const messagesRef = firestore.collection('messages');
  
  await messagesRef.add({
    text: messageText,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  });
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;