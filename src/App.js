/*Extern libraries import*/
import React from "react";
import "./App.css";
import { auth } from "./Components/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

/* Visual Components Import */
import Login from "./Components/Login/Login.js";
import ChatRoom from "./Components/Chatroom/ChatRoom.js";
import AvatarBox from "./Components/Avatar/AvatarBox.js";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <div>
        {!user ? (
          <Login />
        ) : (
          <div className="App">
            <header>
              <SignOut />
            </header>
            <ChatRoom />
            <AvatarBox />
          </div>
        )}
      </div>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Cerrar Sesión
      </button>
    )
  );
}

export default App;
