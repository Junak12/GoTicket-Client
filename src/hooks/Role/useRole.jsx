import { useContext } from "react"
import { RoleContext } from "../../contexts/RoleContext/RoleContext"

export const useRole = () => {
    const context = useContext(RoleContext);
    return context;
}