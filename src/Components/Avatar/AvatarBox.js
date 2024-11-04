import Spline from "@splinetool/react-spline";
import { useRef, useEffect } from "react";

const AvatarBox = ({ isPlayingAudio }) => {
  const splineRef = useRef();

  useEffect(() => {
    if (isPlayingAudio && splineRef.current) {
      splineRef.current.emitEvent("play", "AnimationName"); // Replace with actual animation name
    }
  }, [isPlayingAudio]);
  return (
    <div style={styles.container}>
      <Spline ref={splineRef} scene="https://prod.spline.design/z0nZEnaMBqDvV6YT/scene.splinecode" onLoad={(spline) => (splineRef.current = spline)} />
    </div>
  );
};

const styles = {
  container: {
    width: "400px", // Adjust the width as needed
    height: "650px", // Adjust the height as needed
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default AvatarBox;
