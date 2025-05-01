import { ApiResponse } from "../types/models"

function createResponse<T>(error: boolean, message: string, data: T) : ApiResponse<T> {
        return { 
            error,
            message,
            data
    }
}

export default createResponse