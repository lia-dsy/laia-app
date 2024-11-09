import React, { useState } from "react";
import "./NewPassword.css";
import { Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
    const [userValue, setUserValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        console.log("New Password");
        console.log("User:", userValue);
        console.log("Recovery Email:", emailValue);

        // Reset form values
        setUserValue("");
        setEmailValue("");
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

export default NewPassword;
