import React, { useState, useRef } from "react";
import { auth, firestore, serverTimestamp } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import './ChatRoom.css';
import * as audioPlay from "../../modules/audioPlay.js";
import * as backendRequests from "../../modules/backendRequests.js";
import * as mediaConverter from "../../modules/mediaConverter.js";

const laiaPhotoURL = 'https://i.pinimg.com/1200x/56/88/c1/5688c185a4a0493e2c1f3d5cab0e5a78.jpg';
const laiaID = 'laia';
const audioFormat = 'audio/mp3';

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
  
    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
  
    // Function to handle sending a message
    const sendMessage = async (e) => {
      e.preventDefault();

      const { uid, photoURL } = auth.currentUser;
      await addMessageToChat(formValue, uid, photoURL);
      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
      
      const response = await backendRequests.sendBackend(formValue);
      await addMessageToChat(response.text, laiaID, laiaPhotoURL);

      const audioBlob = mediaConverter.convertBase64ToBlob(response.audio, audioFormat);
      const audioUrl = mediaConverter.getObjectUrl(audioBlob);
      audioPlay.playAudio(audioUrl);
    };

    // Start recording and auto-stop on silence
const startRecording = async () => {
  setIsRecording(true);
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });

  mediaRecorderRef.current.ondataavailable = async (event) => {
      if (event.data.size > 0) {
          const audioBlob = event.data;
          const audioBase64 = await convertBlobToBase64(audioBlob);
          await transcribeAudio(audioBase64);
      }
  };

  mediaRecorderRef.current.start();

  // Automatically stop recording after 5 seconds of inactivity
  setTimeout(() => {
      stopRecording();
  }, 5000); // Adjust the time as needed
};



// Function to stop recording audio (optional, if you want a way to stop manually)
const stopRecording = () => {
  setIsRecording(false);
  if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
  }
};

// Function to convert blob to base64
const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get base64 part
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
};

// Function to transcribe audio using Google STT API
const transcribeAudio = async (audioBase64) => {
  const API_KEY = 'AIzaSyB7Oglp_JzYQ54tK8UhGnSb5WVeuvsPILU'; // Replace with your valid API key
  try {
      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              config: {
                  encoding: 'WEBM_OPUS', // Ensure this matches your audio format
                  sampleRateHertz: 48000, // Match the sample rate for WebM/Opus
                  languageCode: 'es-MX',
                  audioChannelCount: 2, // Set the audio channel count to match the actual audio
                  enableSeparateRecognitionPerChannel: false // Disable separate recognition per channel
              },
              audio: {
                  content: audioBase64,
              },
          }),
      });

      const result = await response.json();
      if (result.error) {
          console.error('Error in transcription:', result.error.message);
          setFormValue('Error transcribing audio');
      } else if (result.results && result.results.length > 0) {
          const transcription = result.results
              .map(res => res.alternatives[0].transcript)
              .join('\n');
          setFormValue(prev => `${prev}\n${transcription}`); // Append new transcription to the previous text
      } else {
          console.error('No transcription results available.');
      }
  } catch (error) {
      console.error('Error transcribing audio:', error);
  }
};




    return (
        <div className="wrappChat">
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>
            </main>
            <form className="send-message-form" onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Escribe el mensaje" />
                <button type="submit" disabled={!formValue}>🕊️</button>
                <button type="button" onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'Stop Recording' : '🎤'}
                </button>
            </form>
            <audio id="audioPlayer" controls></audio>
        </div>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img className='message-img' src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
            <p>{text}</p>
        </div>
    );
}

async function addMessageToChat(messageText, uid, photoURL) {
    const messagesRef = firestore.collection('messages');
    await messagesRef.add({
        text: messageText,
        createdAt: serverTimestamp(),
        uid,
        photoURL
    });
}

export default ChatRoom;
