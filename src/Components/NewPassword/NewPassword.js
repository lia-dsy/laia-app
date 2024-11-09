import React, { useState } from "react";
import "./NewPassword.css";
import { Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
    const [codeValue, setCodeValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        console.log("New Password");
        console.log("Código:", codeValue);
        console.log("Nueva contraseña:", passwordValue);
        console.log("Contraseña confirmada:", confirmPasswordValue);

        // Reset form values
        setCodeValue("");
        setPasswordValue("");
        setConfirmPasswordValue("");
    };

    const validateConfirm = () => {
        return (
            !codeValue ||
            !passwordValue ||
            !confirmPasswordValue ||
            passwordValue !== confirmPasswordValue
        );
    };

    return (
        <>
            <div className="wrapper">
                <form onSubmit={signIn} className="form-Wrapper">
                    <h1>Nueva Contraseña</h1>
                    <h3>
                        Escriba el código de confirmación que hemos enviado a su
                        correo electrónico
                    </h3>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Código de confirmación"
                            value={codeValue}
                            onChange={(e) => setCodeValue(e.target.value)}
                            required
                        />
                        <Icon name="user" className="icon" />
                    </div>

                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Nueva contraseña"
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            required
                        />
                        <Icon name="lock" className="icon" />
                    </div>

                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Confirmar contraseña"
                            value={confirmPasswordValue}
                            onChange={(e) =>
                                setConfirmPasswordValue(e.target.value)
                            }
                            required
                        />
                        <Icon name="lock" className="icon" />
                    </div>

                    <button
                        className="change-password"
                        type="submit"
                        disabled={validateConfirm()}
                    >
                        Cambiar contraseña
                    </button>
                </form>
            </div>
        </>
    );
};

export default NewPassword;
