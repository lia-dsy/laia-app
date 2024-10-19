function convertBase64ToBlob(base64, mime) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
};

function convertBlobToUrl(audioBlob) {
  return URL.createObjectURL(audioBlob);
}

const playAudio = (file) => {
  if (file) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = file;
    audioPlayer.play().catch(error => {
      console.error('Error al reproducir el audio:', error);
    });
  }
};

export { convertBase64ToBlob, convertBlobToUrl, playAudio };