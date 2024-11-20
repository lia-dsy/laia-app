import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import * as toastCotainers from "../toastContainers/toastContainers.js";
import * as userAdmin from "../../modules/userAdmin";

const Signin = () => {
    const navigate = useNavigate();
    const [userValue, setUserValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const signIn = (e) => {
        e.preventDefault();
        const user = userValue;
        const password = passwordValue;

        // Reset form values
        setUserValue("");
        setPasswordValue("");

        try {
            userAdmin.insertUser(user, password).then((response) => {
                if (!response.error) {
                    toastCotainers
                        .success("Usuario registrado correctamente", 2500)
                        .then(() => {
                            delay(3500).then(() => {
                                navigate("/login");
                            });
                        });
                } else {
                    console.error(
                        `Error al registrar el usuario: ${response.error}`
                    );
                    toastCotainers.error(`Error al registrar el usuario`, 3000);
                }
            });
        } catch (error) {
            console.error(`Error al registrar el usuario: ${error}`);
            toastCotainers.error(`Error al registrar el usuario`, 3000);
        }
    };

    return (
        <>
            <div className="wrapper">
                <h2 className="back">
                    <a href="/login">
                        {/* <Icon name="arrow left" className="icon" /> */}↩
                    </a>
                </h2>
                <form onSubmit={signIn} className="form-Wrapper">
                    <h1>Registrarse</h1>
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
                    <button
                        className="sign-in"
                        type="submit"
                        disabled={!userValue || !passwordValue}
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </>
    );
};

export default Signin;
