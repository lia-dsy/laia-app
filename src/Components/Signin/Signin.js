import React, { useState } from "react";
import "./Signin.css";
import { Icon } from "semantic-ui-react";

const Signin = () => {
    const [userValue, setUserValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const signIn = (e) => {
        e.preventDefault();
        console.log("Log in");
        console.log("User:", userValue);
        console.log("Password:", passwordValue);

        // Reset form values
        setUserValue("");
        setPasswordValue("");
    };

    return (
        <>
            <div className="wrapper">
                <h2 className="back">
                    <a href="/login">
                        {/* <Icon name="arrow left" className="icon" /> */}
                        ↩
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
