import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { headers } from "next/headers";
const userPath = "http://127.0.0.1:5000/api/response_users";

const AuthContext = createContext({
    isAuthenticated: false,
    user: { uid: "", user: "" },
    getAccessToken: () => {},
    saveUser: () => {},
    getRefreshToken: () => {},
});

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(false);
    const [user, setUser] = useState({ uid: "", user: "" });

    async function requestNewAccessToken(refreshToken) {
        try {
            const response = await axios.post(
                `${userPath}/refresh-token`,
                {},
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
                    },
                }
            );

            if (response.error) {
                throw new Error(response.error);
            } else {
                return response.access_token;
            }
        } catch (error) {
            console.error("Error al solicitar un nuevo token:", error);
            return null;
        }
    }

    async function getUserInfo(accessToken) {
        try {
            const response = await axios.get(
                `${userPath}/user`,
                // { access_token: accessToken },
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.error) {
                throw new Error(response.error);
            } else {
                return response.access_token;
            }
        } catch (error) {
            console.error(
                "Error al obtener la información del usuario:",
                error
            );
            return null;
        }
    }

    async function checkAuth() {
        if (accessToken) {
            //El usuario está autenticado
        } else {
            //El usuario no está autenticado
            const token = getRefreshToken();
            if (token) {
                const newAccessToken = await requestNewAccessToken(token);
                if (newAccessToken) {
                    const userInfo = await getUserInfo(newAccessToken);
                    if (userInfo) {
                        saveSessionInfo(userInfo, newAccessToken, token);
                    }
                }
            }
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    function saveSessionInfo(userInfo, accessToken, refreshToken) {
        setAccessToken(accessToken);
        localStorage.setItem("token", JSON.stringify(refreshToken));
        setUser(userInfo);
        setIsAuthenticated(true);
    }

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken() {
        const tokenData = localStorage.getItem("token");
        if (tokenData) {
            const token = JSON.parse(tokenData);
            return token;
        }
        return null;
    }

    function saveUser(userData) {
        saveSessionInfo(
            userData.user,
            userData.access_token,
            userData.refresh_token
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                getAccessToken,
                saveUser,
                getRefreshToken,
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
