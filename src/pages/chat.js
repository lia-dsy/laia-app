import ChatRoom from "../Components/Chatroom/ChatRoom.js";
// import AvatarBox from "../Components/Avatar/AvatarBox.js";
import React, { useRef, useState } from "react";

// import { auth } from "../Components/Auth/firebaseConfig.js";
// import { useNavigate } from "react-router-dom";

// import { useAuth } from "../Components/Auth/localAuth.js";

const ChatPage = () => {
    const avatarRef = useRef();
    const [isTalking, setIsTalking] = useState(false); // State to control animation
    return (
        <>
             <header>
                <SignOut />
            </header>
            <ChatRoom />
            <AvatarBox />
        </>
    );
};

function SignOut() {
    const localAuth = useAuth();
    const navigate = useNavigate();
    const handleSignOut = (e) => {
        e.preventDefault();
        if (localAuth.isAuthenticated) {
            try {
                
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        } else {
            auth.signOut();
        }
        navigate("/login");
    };

    return (
        (auth.currentUser || localAuth.isAuthenticated) && (
            <button className="sign-out" onClick={handleSignOut}>
                Cerrar Sesión
            </button>
        )
    );
}

export default ChatPage;
