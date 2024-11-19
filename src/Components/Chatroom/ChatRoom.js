import React, { useState, useRef } from "react";
import { auth } from "../Auth/firebaseConfig.js";
import { marked } from "marked";

import "./ChatRoom.css";
import Loading from "../Loading/Loading.js";
import * as audioPlay from "../../modules/audioPlay.js";
import * as backendRequests from "../../modules/backendRequests.js";
import * as mediaConverter from "../../modules/mediaConverter.js";
import * as messagesDatabase from "../../modules/messagesDatabase.js";
import * as voiceRecognition from "../../modules/voiceRecognition.js";
import * as toastCotainers from "../toastContainers/toastContainers.js";
import * as config from "../../config.js";

import { useAuth } from "../Auth/localAuth.js";
import { Navigate } from "react-router-dom";

const laiaPhotoURL =
    "https://i.pinimg.com/1200x/56/88/c1/5688c185a4a0493e2c1f3d5cab0e5a78.jpg";
const laiaID = "laia";
const audioFormat = "audio/mp3";

function ChatRoom() {
    const localAuth = useAuth();
    const dummy = useRef();
    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const [sending, setSending] = useState(false);
    const [deletableMessages, setDeletableMessages] = useState(false);
    const [uid, setUID] = useState("");
    const [photoURL, setPhotoURL] = useState("");

    // Obtener mensajes al cargar el componente
    React.useEffect(() => {
        try {
            console.log("ChatRoom.js: useEffect", localAuth.isAuthenticated);
            if (localAuth.isAuthenticated) {
                setUID(localAuth.user.uid);
                setPhotoURL(
                    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${localAuth.user.user}`
                );
            } else {
                const { userID, photo } = auth.currentUser;
                setUID(userID);
                setPhotoURL(photo);
            }

            fetchMessages();
        } catch (error) {
            if (
                error.TypeError ===
                "Cannot destructure property 'userID' of 'auth.currentUser' as it is undefined."
            ) {
                console.error("No hay usuario de Google autenticado");
            }
            console.error(error);
        }
    }, []);

    if (!localAuth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Función para obtener los mensajes de la base de datos
    const fetchMessages = async () => {
        try {
            const fetchedMessages = await messagesDatabase.getMessages();
            setMessages(fetchedMessages);
            if (fetchedMessages.length > 0) {
                setDeletableMessages(true);
            }
        } catch (error) {
            toastCotainers.error(
                `Error al obtener los mensajes:\n${error}`,
                2500
            );
        }
    };

    // Function to handle sending a message
    const sendMessage = async (e) => {
        e.preventDefault();

        const text = formValue;
        setFormValue("");

        try {
            await addMessageToChat(text, uid, photoURL);
            dummy.current.scrollIntoView({ behavior: "smooth" });

            setSending(true);

            const response = await backendRequests.sendBackend(
                text,
                "narakeet",
                "openai"
            );
            await addMessageToChat(response.text, laiaID, laiaPhotoURL);

            const audioBlob = mediaConverter.convertBase64ToBlob(
                response.audio,
                audioFormat
            );
            const audioUrl = mediaConverter.getObjectUrl(audioBlob);
            audioPlay.playAudio(audioUrl);
        } catch (error) {
            toastCotainers.error(`Error al enviar el mensaje`, 2500);
        }
        setSending(false);
    };

    // Función para agregar un mensaje al chat
    const addMessageToChat = async (messageText, uid, photoURL) => {
        const message = {
            message: messageText,
            uid,
            photoURL,
        };
        await messagesDatabase.insertMessage(message);
        fetchMessages();
    };

    // Función para convertir Eliminar mensajes de la base de datos
    const deleteMessagesFromChat = async () => {
        setDeletableMessages(false);
        await messagesDatabase.deleteAllMessages();
        fetchMessages();
    };

    // Funcion para comenzar la grabacion de voz
    const handleStartRecording = () => {
        voiceRecognition.startRecording(setIsRecording, setFormValue);
    };

    // Funcion para detener la grabacion de voz
    const handleStopRecording = () => {
        voiceRecognition.stopRecording(setIsRecording);
    };

    return (
        <>
            <div>
                {sending ? <Loading /> : null}
                <main className="wrappChat">
                    {messages &&
                        messages.map((msg) => (
                            <ChatMessage key={msg._id} message={msg} />
                        ))}
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
                            formValue
                                ? "Enviar mensaje"
                                : "No puedes enviar un mensaje vacío"
                        }
                    >
                        🕊️
                    </button>
                    <button
                        disabled={sending}
                        type="button"
                        onClick={
                            isRecording
                                ? handleStopRecording
                                : handleStartRecording
                        }
                        title={
                            isRecording
                                ? "Detener grabación"
                                : "Iniciar grabación"
                        }
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
    const localAuth = useAuth();
    const { message, uid, photoURL } = props.message;
    let messageClass = "";
    if (localAuth.isAuthenticated) {
        messageClass = uid === localAuth.user.uid ? "sent" : "received";
    } else {
        messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    }

    const renderedMessage = convertMarkdownToHtml(message);
    // console.log(`Mensaje original ${typeof message}: ${message}`);
    // console.log(`Mensaje renderizado ${typeof renderedMessage}: ${renderedMessage}`);

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
    let renderedMessage = marked(markdown);

    // Eliminar etiquetas <p> <hr>
    renderedMessage = renderedMessage.replace(/<\/?(p|hr)>/g, "");

    // Agrega un salto de línea antes de todas las etiquetas <h>
    renderedMessage = renderedMessage.replace(/(<h[1-6]>)/g, "\n$1");

    // Eliminar todas las etiquetas <code> y sus atributos
    renderedMessage = renderedMessage
        .replace(/<code[^>]*>/g, "")
        .replace(/<\/code>/g, "");

    // Eliminar los saltos de línea duplicados
    renderedMessage = renderedMessage.replace("\n\n", "\n");

    return renderedMessage;
}

export default ChatRoom;
