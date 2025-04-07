import { createContext, useContext } from "react";


export interface HeaderContextType {
    title: string;
    setTitle: (title: string) => void;
}

export const HeaderContext = createContext<HeaderContextType>({
  title: "",
  setTitle: (title: string) => {},
});



