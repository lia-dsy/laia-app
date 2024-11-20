import axios from "axios";

const backendPath = "https://127.0.0.1:5000/api/text-to-speech";
// const backendPath = "http://127.0.0.1:5000/api/text-to-speech";

async function sendBackend(msj, voice_model, ia_model) {
    try {
        const response = await axios.post(backendPath, {
            input_text: msj,
            voice_model: voice_model,
            ia_model: ia_model,
        });
        const data = await response.data;
        const audioB64 = data.audio_file;

        return {
            audio: audioB64,
            text: data.input_text,
        };
    } catch (error) {
        console.error("Error al enviar la petición:", error);
    }
}

export { sendBackend };
