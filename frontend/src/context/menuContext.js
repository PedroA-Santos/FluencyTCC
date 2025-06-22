import { createContext, useContext, useState, useRef } from "react";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuToggleRef = useRef(null);

  return (
    <MenuContext.Provider value={{ menuAberto, setMenuAberto, menuToggleRef }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
