import React, { useState } from "react";
import "./NewPassword.css";
import { Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import * as toastCotainers from "../toastContainers/toastContainers.js";
import * as userAdmin from "../../modules/userAdmin";

const NewPassword = () => {
    const [codeValue, setCodeValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        const code = codeValue;
        const newPassword = passwordValue;
        setCodeValue("");
        setPasswordValue("");
        setConfirmPasswordValue("");

        try {
            const user = localStorage.getItem("recoveryUser");
            localStorage.removeItem("recoveryUser");
            userAdmin
                .updateUser(user, "", "", newPassword, code)
                .then((response) => {
                    console.log(response);
                    toastCotainers
                        .success(`Contraseña cambiada correctamente`, 2500)
                        .then(() => {
                            navigate("/login");
                        });
                });
        } catch (error) {
            console.error(`Error al cambiar la contraseña: ${error}`);
            toastCotainers.error(`Error al cambiar la contraseña`, 2500);
        }
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
                            type="password"
                            placeholder="Nueva contraseña"
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            required
                        />
                        <Icon name="lock" className="icon" />
                    </div>

                    <div className="input-box">
                        <input
                            type="password"
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
