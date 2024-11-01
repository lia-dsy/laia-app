import React, { useState, useRef } from "react";
import { auth } from "../firebaseConfig";
import { marked } from "marked";

import "./ChatRoom.css";
import Loading from "../Loading/Loading.js";
import * as audioPlay from "../../modules/audioPlay.js";
import * as backendRequests from "../../modules/backendRequests.js";
import * as mediaConverter from "../../modules/mediaConverter.js";
import * as database from "../../modules/database.js";

const laiaPhotoURL =
  "https://i.pinimg.com/1200x/56/88/c1/5688c185a4a0493e2c1f3d5cab0e5a78.jpg";
const laiaID = "laia";
const audioFormat = "audio/mp3";

function ChatRoom() {
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [deletableMessages, setDeletableMessages] = useState(false);

  // Función para obtener los mensajes de la base de datos
  const fetchMessages = async () => {
    const fetchedMessages = await database.getMessages();
    setMessages(fetchedMessages);
    if (fetchedMessages.length > 0) {
      setDeletableMessages(true);
    }
  };
  // Obtener mensajes al cargar el componente
  React.useEffect(() => {
    fetchMessages();
  }, []);

  // Function to handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();

    const text = formValue;
    setFormValue("");

    const { uid, photoURL } = auth.currentUser;
    await addMessageToChat(text, uid, photoURL);
    dummy.current.scrollIntoView({ behavior: "smooth" });

    setSending(true);

    const response = await backendRequests.sendBackend(text);
    await addMessageToChat(response.text, laiaID, laiaPhotoURL);

    const audioBlob = mediaConverter.convertBase64ToBlob(
      response.audio,
      audioFormat
    );
    const audioUrl = mediaConverter.getObjectUrl(audioBlob);
    audioPlay.playAudio(audioUrl);
    setSending(false);
  };

  // Función para agregar un mensaje al chat
  const addMessageToChat = async (messageText, uid, photoURL) => {
    const message = {
      message: messageText,
      uid,
      photoURL,
    };
    await database.insertMessage(message);
    fetchMessages();
  };

  // Función para convertir Eliminar mensajes de la base de datos
  const deleteMessagesFromChat = async () => {
    setDeletableMessages(false);
    await database.deleteAllMessages();
    fetchMessages();
  };

  // Start recording and auto-stop on silence
  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm; codecs=opus",
    });

    mediaRecorderRef.current.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const audioBlob = event.data;
        const channelCount = await getAudioChannelCount(audioBlob);
        const audioBase64 = await convertBlobToBase64(audioBlob);
        await transcribeAudio(audioBase64, channelCount);
      }
    };

    mediaRecorderRef.current.start();

    // Automatically stop recording after 5 seconds of inactivity
    setTimeout(() => {
      stopRecording();
    }, 5000); // Adjust the time as needed
  };

  //Get the count of channels in the audio
  const getAudioChannelCount = async (audioBlob) => {
    setIsRecording(true);

    // Crear un AudioContext
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Convertir el Blob a un ArrayBuffer
    const arrayBuffer = await audioBlob.arrayBuffer();

    // Decodificar el ArrayBuffer a un AudioBuffer
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Obtener el número de canales
    const channelCount = audioBuffer.numberOfChannels;
    console.log("Número de canales de audio soportados:", channelCount);

    return channelCount;
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
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Get base64 part
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Function to transcribe audio using Google STT API
  const transcribeAudio = async (audioBase64, channelCount) => {
    const API_KEY = "AIzaSyB7Oglp_JzYQ54tK8UhGnSb5WVeuvsPILU"; // Replace with your valid API key
    try {
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            config: {
              encoding: "WEBM_OPUS", // Ensure this matches your audio format
              sampleRateHertz: 48000, // Match the sample rate for WebM/Opus
              languageCode: "es-MX",
              audioChannelCount: channelCount, // Set the audio channel count to match the actual audio
              enableSeparateRecognitionPerChannel: false, // Disable separate recognition per channel
            },
            audio: {
              content: audioBase64,
            },
          }),
        }
      );

      const result = await response.json();
      if (result.error) {
        console.error("Error in transcription:", result.error.message);
        setFormValue("Error transcribing audio");
      } else if (result.results && result.results.length > 0) {
        const transcription = result.results
          .map((res) => res.alternatives[0].transcript)
          .join("\n");
        setFormValue((prev) => `${prev}\n${transcription}`); // Append new transcription to the previous text
      } else {
        console.error("No transcription results available.");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  return (
    <>
      <div>
        <main className="wrappChat">
          {sending ? <Loading /> : null}
          {messages &&
            messages.map((msg) => <ChatMessage key={msg._id} message={msg} />)}
          <span ref={dummy}></span>
        </main>
        <form className="send-message-form" onSubmit={sendMessage}>
          <input
            disabled={sending}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Escribe el mensaje"
          />
          <button
            type="submit"
            disabled={!formValue}
            title={
              formValue ? "Enviar mensaje" : "No puedes enviar un mensaje vacío"
            }
          >
            🕊️
          </button>
          <button
            disabled={sending}
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? "Detener grabación" : "Iniciar grabación"}
          >
            {isRecording ? "Stop Recording" : "🎤"}
          </button>
          <button
            onClick={deleteMessagesFromChat}
            disabled={!deletableMessages || sending}
            title={
              deletableMessages
                ? "Eliminar conversación"
                : "No puedes eliminar la conversación si no hay mensajes"
            }
          >
            ✖️
          </button>
        </form>
        <audio id="audioPlayer" controls />
      </div>
    </>
  );
}

function ChatMessage(props) {
  const { message, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  const renderedMessage = convertMarkdownToHtml(message);
  console.log(`Mensaje original ${typeof message}: ${message}`);
  console.log(
    `Mensaje renderizado ${typeof renderedMessage}: ${renderedMessage}`
  );

  return (
    <div className={`message ${messageClass}`}>
      <img className="message-img" src={photoURL} />
      <p
        className="message-content"
        dangerouslySetInnerHTML={{ __html: renderedMessage }}
      />
    </div>
  );
}

function convertMarkdownToHtml(markdown) {
  // markdown = markdown.replace('```markdown', '');
  let renderedMessage = marked(markdown);

  // Eliminar etiquetas <p> que puedan causar saltos de línea
  renderedMessage = renderedMessage.replace(/<\/?(p)>/g, "");

  // Eliminar etiquetas <pre> que puedan causar saltos de línea
  renderedMessage = renderedMessage.replace(/<\/?(pre)>/g, "");

  // Reemplazar todas las etiquetas <code> y sus atributos
  renderedMessage = renderedMessage
    .replace(/<code[^>]*>/g, "")
    .replace(/<\/code>/g, "");

  return renderedMessage;
}

export default ChatRoom;
