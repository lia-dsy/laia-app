import * as config from "../config.js";

let mediaRecorderRef = null;
let isRecording = false;

// Start recording and auto-stop on silence
const startRecording = async (setIsRecording, setFormValue) => {
  setIsRecording(true);
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorderRef = new MediaRecorder(stream, {
    mimeType: "audio/webm; codecs=opus",
  });

  mediaRecorderRef.ondataavailable = async (event) => {
    if (event.data.size > 0) {
      const audioBlob = event.data;
      const channelCount = await getAudioChannelCount(audioBlob);
      const audioBase64 = await convertBlobToBase64(audioBlob);
      await transcribeAudio(audioBase64, channelCount, setFormValue);
    }
  };

  mediaRecorderRef.start();

  // Automatically stop recording after 5 seconds of inactivity
  setTimeout(() => {
    stopRecording(setIsRecording);
  }, 5000); // Adjust the time as needed
};

// Get the count of channels in the audio
const getAudioChannelCount = async (audioBlob) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.numberOfChannels;
};

// Function to stop recording audio
const stopRecording = (setIsRecording) => {
  setIsRecording(false);
  if (mediaRecorderRef) {
    mediaRecorderRef.stop();
    mediaRecorderRef.stream.getTracks().forEach((track) => track.stop());
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
const transcribeAudio = async (audioBase64, channelCount, setFormValue) => {
  const API_KEY = config.TRANSCRIPTION_KEY(); // Replace with your valid API key
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

export { startRecording, stopRecording };
