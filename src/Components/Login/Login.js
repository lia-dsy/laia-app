import React, { useState } from "react";
import "./Login.css";
import { Icon } from "semantic-ui-react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import { useNavigate } from "react-router-dom";
import * as toastCotainers from "../toastContainers/toastContainers.js";
import * as userAdmin from "../../modules/userAdmin";
import { useAuth } from "../Auth/localAuth.js";
import { Navigate } from "react-router-dom";

const Login = () => {
    const localAuth = useAuth();
    const [userValue, setUserValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [rememberCheck, setRememberCheck] = useState(true);
    const navigate = useNavigate();

    if (localAuth.isAuthenticated) {
        return <Navigate to="/chat" />;
    }

    const signInWithGoogle = () => {
        // Make sure firebase is properly initialized and available in your project
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                toastCotainers
                    .success(
                        `Sesión iniciada correctamente\n\nBienvenido\n${result.additionalUserInfo.profile.name}`,
                        2500
                    )
                    .then(() => {
                        localAuth.setIsAuthenticated(true);
                        navigate("/chat");
                    });
            })
            .catch((error) => {
                // console.error("Error during Google log-In:", error);
                toastCotainers.error(
                    `Error al iniciar sesión con Google:\n${error}`,
                    2500
                );
            });
    };

    const logIn = (e) => {
        e.preventDefault();
        const user = userValue;
        const password = passwordValue;

        // Reset form values
        setUserValue("");
        setPasswordValue("");

        try {
            userAdmin.validateUser(user, password).then((response) => {
                if (!response.error) {
                    if (response.access_token && response.refresh_token) {
                        localAuth.saveUser(response);
                    }
                    toastCotainers
                        .success(
                            `Sesión iniciada correctamente\n\nBienvenido\n${response.user.user}`,
                            2500
                        )
                        .then(() => {
                            navigate("/chat");
                        });
                } else {
                    console.error(
                        `Error al iniciar sesión:\n${response.error.response.data.error}`
                    );
                    toastCotainers.error(
                        `Error al iniciar sesión:\n${response.error.response.data.error}`,
                        3000
                    );
                }
            });
        } catch (error) {
            console.error(`Error al iniciar sesión: ${error}`);
            toastCotainers.error(`Error al iniciar sesión`, 3000);
        }
    };

    return (
        <>
            <div className="wrapper">
                <form onSubmit={logIn}>
                    <h1>Ingresar</h1>
                    {/* <h1>{auth.isAuthenticated.toString()}</h1> */}
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
                            <input
                                className={`remember-${
                                    rememberCheck ? "check" : "uncheck"
                                }`}
                                type="checkbox"
                                checked={rememberCheck}
                                onChange={() =>
                                    setRememberCheck((prev) => !prev)
                                }
                            />
                            Recordar
                        </label>
                        <a href="/recovery">Contraseña Olvidada</a>
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
        </>
    );
};

export default Login;
