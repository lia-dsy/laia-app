import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastContainers.css"; // Importa tus estilos personalizados

const CustomCloseButton = ({ closeToast }) => (
    <button onClick={closeToast} className="close-button">
        X
    </button>
);

async function error(msg) {
    toast.error(msg, {
        autoClose: 3000,
        className: "toast-error", // Aplica la clase personalizada para errores
        progressClassName: "toast-progress-bar-error", // Aplica la clase personalizada para la barra de progreso de errores
        closeButton: <CustomCloseButton />, // Usa el botón de cierre personalizado
        icon: false, // Elimina el icono del toast
    });
}

async function success(msg) {
    toast.success(msg, {
        autoClose: 3000,
        className: "toast-success", // Aplica la clase personalizada
        progressClassName: "toast-progress-bar-success", // Aplica la clase personalizada para la barra de progreso
        closeButton: <CustomCloseButton />, // Usa el botón de cierre personalizado
        icon: false, // Elimina el icono del toast
    });
}

async function alert(msg) {
    toast.warn(msg, {
        autoClose: 3000,
        className: "toast-alert", // Aplica la clase personalizada
        progressClassName: "toast-progress-bar-alert", // Aplica la clase personalizada para la barra de progreso
        closeButton: <CustomCloseButton />, // Usa el botón de cierre personalizado
        icon: false, // Elimina el icono del toast
    });
}

export { error, success, alert, ToastContainer };
