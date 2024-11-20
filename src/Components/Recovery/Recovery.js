import React, { useState } from "react";
import "./Recovery.css";
import { Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import * as toastCotainers from "../toastContainers/toastContainers.js";
import * as userAdmin from "../../modules/userAdmin";

const Recovery = () => {
    const [userValue, setUserValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        const user = userValue;
        const email = emailValue;
        setUserValue("");
        setEmailValue("");

        try {
            localStorage.setItem("recoveryUser", user);
            userAdmin.requestRecovery(user, email).then((response) => {
                if (!response.error) {
                    toastCotainers
                        .success(
                            `Código de recuperación enviado a ${email}`,
                            2500
                        )
                        .then(() => {
                            navigate("/newpassword");
                        });
                } else {
                    console.error(
                        `Error al solicitar el código: ${response.error}`
                    );
                    toastCotainers.error(`Error al solicitar el código`, 3000);
                }
            });
        } catch (error) {
            console.error(`Error al solicitar el código: ${error}`);
            toastCotainers.error(`Error al solicitar el código`, 3000);
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
                    <h1>Recuperar Contraseña</h1>
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
                            type="text"
                            placeholder="Email de recuperación"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            required
                        />
                        <Icon name="lock" className="icon" />
                    </div>
                    <button
                        className="sign-in"
                        type="submit"
                        disabled={!userValue || !emailValue}
                    >
                        Recuperar
                    </button>
                </form>
            </div>
        </>
    );
};

export default Recovery;
