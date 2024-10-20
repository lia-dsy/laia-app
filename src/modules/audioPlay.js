const playAudio = (file) => {
  if (file) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = file;
    audioPlayer.play().catch(error => {
      console.error('Error al reproducir el audio:', error);
    });
  }
};

export { playAudio };