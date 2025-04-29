import { createContext, useContext, useState } from 'react';

// 1. Criar o contexto
const MatchContext = createContext();

// 2. Criar o Provider (envolve a aplicação)
export const MatchProvider = ({ children }) => {
  const [matchAtualizado, setMatchAtualizado] = useState(0);

  const notificarMatch = () => {
    setMatchAtualizado(prev => prev + 1);
  };

  return (
    <MatchContext.Provider value={{ matchAtualizado, notificarMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

// 3. Hook para usar o contexto de forma fácil
export const useMatch = () => {
  return useContext(MatchContext);
};
