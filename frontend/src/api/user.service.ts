import { User } from "../interfaces/models";
import { ApiResponse } from "../interfaces/models";
import type { Token, UserToken } from '../interfaces/models'
import { createResponse } from '../utils/createResponse'
import { axiosService } from "./axiosService"
import { validatePassword } from '../../../backend/src/utils/validatePassword'

export class User_Service {

    //no need for this because of axiosService class
    //public static readonly BASE_URL: string = 'http://localhost:3000/api'

    public static async isAuthenticated(): Promise<ApiResponse<{ authenticated: boolean }>> {
        try {
            const { data: response } = await axiosService.get(`/isAuthenticated`)

            if (response.error) {
                throw new Error(response.message)
            }

            return response as ApiResponse<{ authenticated: boolean }>
        } catch (err: any) {
            const errorMsg = err.response.data.message
            return createResponse(true, errorMsg, { authenticated: false })
        }
    }

    public static async login(email: User['email'], password: string): Promise<ApiResponse<Token>> {
        try {
            //This would set the cookie if the login is successful
            const { data: response } = await axiosService.post(`/login`, {}, {
                auth: {
                    username: email,
                    password: password
                }
            })

            if (response.error) {
                throw new Error(response.message)
            }

            return response
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            return createResponse(true, errorMsg, null)
        }
    }

    public static async getProfile(): Promise<ApiResponse<UserToken | null>> {
        try {
            const { data: response } = await axiosService.get(`/profile`, { withCredentials: true })

            if (response.error) {
                throw new Error(response.message)
            }

            return response as ApiResponse<UserToken>
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            return createResponse(true, errorMsg, null)
        }
    }

    public static async createAccount(username: User['username'], email: User['email'], password: string): Promise<ApiResponse<{} | null>> {
        try {

            const { data: response } = await axiosService.post(`/create-account`, {
                username: username,
                email: email,
                password: password
            })


            if (response.error) {
                throw new Error(response.message)
            }

            return response as ApiResponse<{}>
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            return createResponse(true, errorMsg, null)
        }
    }


    public static async deleteAccount(password: string): Promise<ApiResponse<{} | null>> {
        try {
            const { data: response } = await axiosService.delete(`/profile/delete-profile`, {
                data: { password }
            })

            if (response.error) {
                throw new Error(response.message)
            }
            
            return response as ApiResponse<{}>
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            return createResponse(true, errorMsg, null)
        }
    }

    public static async changeUsername(username: User['username']): Promise<ApiResponse<{} | null>> {
        try {
            const { data: response } = await axiosService.put(
                `profile/change-username`,
                {
                    newUsername: username
                },
            )

            if (response.error) {
                throw new Error(response.message)
            }

            return response as ApiResponse<{}>
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            return createResponse(true, errorMsg, null)
        }
    }

    public static async logout(): Promise<ApiResponse<{} | null>> {
        try {
            const { data: response } = await axiosService.post(`/logout`)

            if (response.error) {
                throw new Error(response.message)
            }

            return response as ApiResponse<{}>
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            return createResponse(true, errorMsg, null)
        }
    }

    public static async verifyEmail(email: string, code: string): Promise<ApiResponse<{} | null>> {
        try {
            const { data: response } = await axiosService.post(`/verify-code`, {
                email: email,
                code: code
            })

            if (response.error) {
                throw new Error(response.message)
            }

            return response as ApiResponse<{}>

        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            console.error(errorMsg)
            return createResponse(true, errorMsg, null)
        }
    }

    public static async changePassword(originalPassword: string, newPassword: string): Promise<ApiResponse<{} | null>> {
        if (!validatePassword(newPassword)) {
            return createResponse(true, 'The password must have 8+ chars, uppercase letters (A-Z), lowercase letters (a-z), digits (0-9)', [])
        }

        try {

            const { data: response } = await axiosService.put(`/profile/change-password`, {
                originalPassword: originalPassword,
                newPassword: newPassword
            })

            if (response.error) {
                throw new Error(response.message)
            }

            return response as ApiResponse<{}>
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            console.error(errorMsg)
            return createResponse(true, errorMsg, null)
        }
    }
    public static async resendVerificationEmail(email : User['email']) : Promise<ApiResponse<{} | null>>{
        try {
            const { data : response } = await axiosService.post('/resend-verification', {
                email: email
            })

            if(response.error){
                throw new Error(response.message)
            }

            return response as ApiResponse<{}>
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred'
            console.error(err)
            return createResponse(true, errorMsg, null)
        }
    }
}