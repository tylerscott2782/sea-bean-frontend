import { SeaBeansProvider } from "./SeaBeansProvider";

export default function AppContext({ children }) {
    return <>
        <SeaBeansProvider>
            {children}
        </SeaBeansProvider>
    </>
}