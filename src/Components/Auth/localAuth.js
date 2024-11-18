import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
});

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Cambiado a true

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
