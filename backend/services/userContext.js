import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserDataState] = useState({ email: "", senha: "" });

    const setUserData = (data) => {
        setUserDataState((prev) => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser deve ser usado dentro de um UserProvider");
    return context;
};
