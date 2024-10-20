import React, { useState, useRef } from "react";
import { auth, firestore } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import './ChatRoom.css';
/* Local modules import */

// Import audio play module
import * as audioPlay from "../../modules/audioPlay.js";
// Import voice recognition module
// import * as voiceRecognition from "./modules/voiceRecognition.js";
// Import backend requests module
import * as backendRequests from "../../modules/backendRequests.js";
// Import backend requests module
import * as mediaConverter from "../../modules/mediaConverter.js";

import './ChatRoom.css';

const laiaPhotoURL = 'https://i.pinimg.com/1200x/56/88/c1/5688c185a4a0493e2c1f3d5cab0e5a78.jpg';
const laiaID = 'laia';
const audioFormat = 'audio/mp3';

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
  
    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
  
    // Function to handle sending a message
    const sendMessage = async (e) => {
      e.preventDefault();
  
      // const { userID, userPhotoURL } = auth.currentUser;
      const { uid, photoURL } = auth.currentUser;
  
      // await addMessageToChat(formValue, userID, userPhotoURL); // Add user's message to the chat
      await addMessageToChat(formValue, uid, photoURL); // Add user's message to the chat
      
      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
      
      const response = await backendRequests.sendBackend(formValue);
      
      await addMessageToChat(response.text, laiaID, laiaPhotoURL); // Add Laia's response to the chat
  
      const audioBlob = mediaConverter.convertBase64ToBlob(response.audio, audioFormat);
      const audioUrl = mediaConverter.getObjectUrl(audioBlob);
      audioPlay.playAudio(audioUrl);
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
    <div className="wrappChat">
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form className="send-message-form" onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>
        <button type="button" onClick={startRecognition}>🎤</button>
      </form>
      <audio id="audioPlayer" controls></audio>
    </div>
  );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <img className='message-img' src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <p>{text}</p>
      </div>
    </>)
  }

async function addMessageToChat(messageText, uid, photoURL) {
    const messagesRef = firestore.collection('messages');
    await messagesRef.add({
      text: messageText,
      createdAt: firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
  }

  export default ChatRoom;