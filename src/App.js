import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import axios from 'axios';

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
const analytics = firebase.analytics();
const backendPath = 'http://localhost:5000/api/text-to-speech';

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
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
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

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

    await sendBackend(formValue);
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
        console.log("Recognized speech: ", transcript);
        setFormValue(transcript);  // Set the recognized text into the input field
      };

      recognition.onend = () => {
        console.log('Speech recognition has ended');
      };

      recognition.onerror = (event) => {
        console.error('Error occurred during recognition: ', event.error);
      };

      recognition.start();  // Start speech recognition
    } else {
      console.log('Speech Recognition is not supported in your browser.');
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

async function sendBackend(msj){
  try {
    const response = await axios.post(backendPath, {
      input_text: msj});
      const data = await response.data;
      const audioB64 = data.audio_file;

    const audioBlob = base64ToBlob(audioB64, 'audio/mp3');
    const audio = URL.createObjectURL(audioBlob); // Crea una URL para el blob de audio

    console.log('Audio URL:', data.audio_path);
    console.log('Audio File:', audio);
    console.log('Texto:', data.input_text);

    playAudio(audio);

  } catch (error) {
    console.error('Error al enviar la petición:', error);
  }
}

function base64ToBlob(base64, mime) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
};

const playAudio = (file) => {
  if (file) {
    console.log('Reproduciendo\n' + file);
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = file;
    audioPlayer.play().catch(error => {
      console.error('Error al reproducir el audio:', error);
    });
  }
};
export default App;