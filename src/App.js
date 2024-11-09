/*Extern libraries import*/
import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import ChatPage from "./pages/chat";
import RecoveryPage from "./pages/recovery";
import SigninPage from "./pages/signin";
import NewPasswordPage from "./pages/newPassword";
import DefaultPage from "./pages/default";

function App() {
    return (
        <>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/chat"
                        element={
                            <div className="App">
                                <ChatPage />
                            </div>
                        }
                    />

                    <Route path="/recovery" element={<RecoveryPage />} />

                    <Route path="/signin" element={<SigninPage />} />

                    <Route path="/newpassword" element={<NewPasswordPage />} />

                    <Route path="/*" element={<DefaultPage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
