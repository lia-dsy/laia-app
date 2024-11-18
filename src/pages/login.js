import Login from "../Components/Login/Login.js";

import { useAuth } from "../Components/Auth/localAuth.js";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
    const auth = useAuth();

    if (auth.isAuthenticated) {
        return <Navigate to="/chat" />;
    }
    return (
        <>
            <Login />
        </>
    );
};

export default LoginPage;
