import React, { useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";


const AvatarBox = ({ isPlaying }) => {
  const splineRef = useRef();

  useEffect(() => {
    if (isPlaying && splineRef.current) {
      console.log("Playing animation");
      splineRef.current.emitEvent("start", "newest");
    }
  }, [isPlaying]);
  
  return (
    <div style={styles.container}>
      <Spline
        scene="https://prod.spline.design/m6vEvYU7NBO4P7Bt/scene.splinecode"
        onLoad={(spline) => {
          splineRef.current = spline;
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    height: "650px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default AvatarBox;
