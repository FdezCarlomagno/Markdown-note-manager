import { User_model } from "../models/user.model";
import { User } from "../types/models";

export const getUserById = async (id: User['id']) : Promise<User | null> => {
    try {
        const user = await User_model.getUserById(id) 
        
        if(!user){
            throw new Error
        }

        return user
    } catch (err : any){
        return null
    }
}