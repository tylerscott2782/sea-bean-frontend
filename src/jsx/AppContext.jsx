import { SeaBeansProvider } from "./SeaBeansProvider";
import { CurrentUserProvider} from "./CurrentUserProvider";

export default function AppContext({ children }) {
    return <>
        <CurrentUserProvider>
            <SeaBeansProvider>
                {children}
            </SeaBeansProvider>
        </CurrentUserProvider>
    </>
}