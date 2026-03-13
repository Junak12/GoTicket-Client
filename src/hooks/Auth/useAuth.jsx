import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext/AuthContext"

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}