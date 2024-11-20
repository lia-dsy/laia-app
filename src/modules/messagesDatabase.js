import axios from "axios";

// const databasePath = "https://127.0.0.1:5000/api/messages_database";
const databasePath = "http://127.0.0.1:5000/api/messages_database";

async function insertMessage(message) {
    try {
        const response = await axios.post(databasePath, message);
        const data = await response.data;
        return data;
    } catch (error) {
        console.error("Error al enviar la petición:", error);
    }
}

async function getMessages() {
    try {
        const response = await axios.get(databasePath);
        return response.data;
    } catch (error) {
        console.error("Error al enviar la petición:", error);
        return [];
    }
}

async function deleteAllMessages() {
    try {
        await axios.delete(databasePath);
    } catch (error) {
        console.error("Error al enviar la petición:", error);
    }
}

export { insertMessage, getMessages, deleteAllMessages };
