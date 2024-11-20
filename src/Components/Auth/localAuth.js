import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { headers } from "next/headers";
import Loading from "../Loading/Loading.js";
// const userPath = "https://127.0.0.1:5000/api/response_users";
const userPath = "http://127.0.0.1:5000/api/response_users";

const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    user: { uid: "", user: "" },
    getAccessToken: () => {},
    saveUser: () => {},
    getRefreshToken: () => {},
    signOut: () => {},
});

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(false);
    const [user, setUser] = useState({ uid: "", user: "" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

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
                return response.data.new_access_token;
            }
        } catch (error) {
            console.error("Error al solicitar un nuevo token:", error);
            return null;
        }
    }

    async function getUserInfo(accessToken) {
        try {
            const response = await axios.get(`${userPath}/user`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.error) {
                throw new Error(response.error);
            } else {
                return response.data;
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
            const userInfo = await getUserInfo(accessToken);
            if (userInfo) {
                saveSessionInfo(userInfo, accessToken, getRefreshToken());
            }
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
        setIsLoading(false);
        return;
    }

    function saveSessionInfo(userInfo, accessToken, refreshToken) {
        setIsAuthenticated(true);
        setAccessToken(accessToken);
        localStorage.setItem("token", JSON.stringify(refreshToken));
        setUser(userInfo);
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

    async function signOut() {
        try {
            const response = await axios.delete(`${userPath}/signout`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${getRefreshToken()}`,
                },
            });

            if (response.error) {
                throw new Error(response.error);
            } else {
                setIsAuthenticated(false);
                setAccessToken(null);
                setUser({ uid: "", user: "" });
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            return null;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                getAccessToken,
                saveUser,
                getRefreshToken,
                user,
                setIsAuthenticated,
                signOut,
            }}
        >
            {isLoading ? (
                <div>
                    <Loading />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
