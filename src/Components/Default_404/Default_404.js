import React, { useState } from "react";
import "./Default_404.css";
import { Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const Default_404 = () => {
    const navigate = useNavigate();

    const redirect = () => {
        navigate("/login");
    };

    return (
        <>
            <div className="wrapper-default">
                <h1>Lo sentimos, no pudimos encontrar la página</h1>
                <img src="https://content.imageresizer.com/images/memes/Pop-Cat-meme-5.jpg"></img>
                <button className="return" onClick={redirect}>
                    Ir a la página principal
                </button>
            </div>
        </>
    );
};

export default Default_404;
