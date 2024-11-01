import Spline from "@splinetool/react-spline";

const AvatarBox = () => {
  return (
    <div style={styles.container}>
      <Spline scene="https://prod.spline.design/z0nZEnaMBqDvV6YT/scene.splinecode" />
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
