import { ApiResponse } from "../interfaces/models"

export function createResponse<T>(error: ApiResponse<T>['error'], message: ApiResponse<T>['message'], data: ApiResponse<T>['data']): ApiResponse<T> {
    return {
        error,
        message,
        data
    }
}