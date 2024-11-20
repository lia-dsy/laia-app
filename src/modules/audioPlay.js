import AvatarBox from "../Components/Avatar/AvatarBox.js";
import React, { useState, useEffect } from 'react';

const playAudio = (file, onPlayCallback) => {
  if (file) {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = file;
    audioPlayer.play().then(() => {
      if (onPlayCallback) {
        onPlayCallback(); // Trigger the animation
      }
    }).catch((error) => {
      console.error("Error al reproducir el audio:", error);
    });
  }
};

const AudioPlayComponent = ({ file }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayCallback = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    playAudio(file, handlePlayCallback);
  }, [file]);

  return <AvatarBox isPlaying={isPlaying} />;
};

export { playAudio, AudioPlayComponent };