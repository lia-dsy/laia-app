import React, { useState } from "react";
import "./Login.css";
import { Icon } from "semantic-ui-react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [userValue, setUserValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const navigate = useNavigate();

    const signInWithGoogle = () => {
        // Make sure firebase is properly initialized and available in your project
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                console.log("Google log-In successful:", result.user);
                navigate("/chat");
            })
            .catch((error) => {
                console.error("Error during Google log-In:", error);
            });
    };

    const logIn = (e) => {
        e.preventDefault();
        console.log("Log in");
        console.log("Usuario:", userValue);
        console.log("Password:", passwordValue);

        // Reset form values
        setUserValue("");
        setPasswordValue("");
    };

    return (
        <div className="wrapper">
            <form onSubmit={logIn}>
                <h1>Ingresar</h1>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={userValue}
                        onChange={(e) => setUserValue(e.target.value)}
                        required
                    />
                    <Icon name="user" className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        required
                    />
                    <Icon name="lock" className="icon" />
                </div>
                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" />
                        Recordar
                    </label>
                    <a href="/forgoted">Contraseña Olvidada</a>
                </div>
                <button
                    className="log-in"
                    type="submit"
                    disabled={!userValue || !passwordValue}
                >
                    Ingresar
                </button>
                <button className="log-in" onClick={signInWithGoogle}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                        alt="Google icons created by Freepik - Flaticon"
                        className="google-icon"
                    />
                    <span>Ingresa con Google</span>
                </button>
                <div className="register-link">
                    <p>No tienes cuenta?</p>
                    <a href="/signin">Registrarse</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
