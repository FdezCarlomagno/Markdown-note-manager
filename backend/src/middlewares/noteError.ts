import { ApiResponse } from "../types/models";

class Note_Error<T> extends Error {
    
    public statusCode: number;
    public error: boolean;
    public data: T;

    constructor(response: ApiResponse<T> , statusCode: number = 500) {
        super(response.message);
        this.statusCode = statusCode;
        this.error = response.error;
        this.data = response.data;
        Error.captureStackTrace(this, this.constructor);
    }
    public getStatusCode(){
        return this.statusCode
    }
}

export default Note_Error;
