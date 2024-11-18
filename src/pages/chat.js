import ChatRoom from "../Components/Chatroom/ChatRoom.js";
import AvatarBox from "../Components/Avatar/AvatarBox.js";

import { auth } from "../Components/Auth/firebaseConfig.js";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../Components/Auth/localAuth.js";

const ChatPage = () => {
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
    const handleSignOut = () => {
        const x = auth.signOut();
        console.log("Sign out:");
        console.log(x);
        navigate("/");
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
