import { User_model } from "../models/user.model";

export function checkEmailFormat(email : string) : boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = email.match(emailRegex);

    return validEmail !== null;
}

export const emailExists = async (email: string): Promise<boolean> => {
    try {
        const user = await User_model.getUserByEmail(email);
        return user !== null;
    } catch (err) {
        console.error("Error checking email existence:", err);
        return false; 
    }
};

