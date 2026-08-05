import { createContext, useContext } from "react";

export const SeaBeansContext = createContext([]);

export function useSeaBeans() {
    return useContext(SeaBeansContext)
}