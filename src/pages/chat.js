import ChatRoom from "../Components/Chatroom/ChatRoom.js";
import AvatarBox from "../Components/Avatar/AvatarBox.js";
import React, { useRef, useState } from "react";

import { auth } from "../Components/Auth/firebaseConfig.js";
import { useAuth } from "../Components/Auth/localAuth.js";
import { useNavigate, Navigate } from "react-router-dom";

const ChatPage = () => {
    const avatarRef = useRef();
    const [isTalking, setIsTalking] = useState(false); // State to control animation
    const auth = useAuth();

    // if (!auth.isAuthenticated) {
    //     return <Navigate to="/login" />;
    // }
    return (
        <>
            <header>
                <SignOut />
            </header>
            <ChatRoom avatarRef={avatarRef} setIsTalking={setIsTalking} />
            <AvatarBox isTalking={isTalking} />
        </>
    );
};

function SignOut() {
    const navigate = useNavigate();
    const handleSignOut = () => {
        const x = auth.signOut();
        console.log("Sign out:");
        console.log(x);
        navigate("/");
    };

    return (
        auth.currentUser && (
            <button className="sign-out" onClick={handleSignOut}>
                Cerrar Sesión
            </button>
        )
    );
}

export default ChatPage;
