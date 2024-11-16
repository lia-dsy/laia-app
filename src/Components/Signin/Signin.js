import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import "./Signin.css";
import * as toastCotainers from "../toastContainers/toastContainers.js";
import * as userAdmin from "../../modules/userAdmin";

const Signin = () => {
    const [userValue, setUserValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const signIn = (e) => {
        const user = userValue;
        const password = passwordValue;
        setUserValue("");
        setPasswordValue("");
        e.preventDefault();
        console.log("Log in");
        // console.log("User:", userValue);
        // console.log("Password:", passwordValue);

        userAdmin.insertUser(user, password).then((response) => {
            // Reset form values
            console.log("Response:", response);
            if (!response.error) {
                toastCotainers.success("Usuario registrado correctamente");
            } else {
                toastCotainers.error(
                    `Error al registrar el usuario:\n${response.error}`
                );
            }
        });
    };

    return (
        <>
            <ToastContainer />
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
