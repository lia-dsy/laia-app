import axios from 'axios';

const backendPath = 'http://localhost:5000/api/text-to-speech';

async function sendBackend(msj){
  try {
    const response = await axios.post(backendPath, {
      input_text: msj});
      const data = await response.data;
      const audioB64 = data.audio_file;

      return {
        audio: audioB64,
        text: data.input_text
      };
      
  } catch (error) {
    console.error('Error al enviar la petición:', error);
  }
}

export { sendBackend };