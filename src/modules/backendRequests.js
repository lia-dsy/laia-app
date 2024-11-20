import axios from "axios";

const backendPath = "https://127.0.0.1:5000/api/text-to-speech";
// const backendPath = "http://127.0.0.1:5000/api/text-to-speech";

async function sendBackend(msj, voice_model, ia_model) {
    try {
        const payload = {
            input_text: msj,
            voice_model: voice_model.toLowerCase(),
            ia_model: ia_model.toLowerCase(),
        };
        console.log("Payload enviado al backend:", payload); // Log para depurar

        const response = await axios.post(backendPath, payload);
        const data = await response.data;
        const audioB64 = data.audio_file;

        return {
            audio: audioB64,
            text: data.input_text,
        };
    } catch (error) {
        console.error("Error al enviar la petición:", error.response?.data || error.message);
    }
}

export { sendBackend };
