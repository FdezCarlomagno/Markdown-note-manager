import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export const useUserContext = () => {
    const userContext = useContext(UserContext)

    if (!userContext) {
        throw new Error("useUserContext must be used within an UserProvider");
    }
    return userContext 
}