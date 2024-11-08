/*Extern libraries import*/
import React from "react";
import "./App.css";
// import { auth } from "./Components/firebaseConfig";
// import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import ChatPage from "./pages/chat";
import ForgotedPage from "./pages/forgoted";
import SigninPage from "./pages/signin";
import DefaultPage from "./pages/default";

function App() {
    // const [user] = useAuthState(auth);

    return (
        <>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route
                        path="/login"
                        element={
                            <div>
                                <LoginPage />
                            </div>
                        }
                    />

                    <Route
                        path="/chat"
                        element={
                            <div className="App">
                                <ChatPage />
                            </div>
                        }
                    />

                    <Route path="/forgoted" element={<ForgotedPage />} />

                    <Route path="/signin" element={<SigninPage />} />

                    <Route path="/*" element={<DefaultPage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
