import { createContext, useContext, useState, useRef } from "react";

const DetailsContext = createContext();

export function DetailsProvider({ children }) {
    const [detalhesAtivos, setDetalhesAtivos] = useState(null);
    const detalhesRef = useRef(null);

    return (
        <DetailsContext.Provider value={{ detalhesAtivos, setDetalhesAtivos, detalhesRef }}>
            {children}
        </DetailsContext.Provider>
    );
}

export function useDetails() {
    return useContext(DetailsContext);
}
