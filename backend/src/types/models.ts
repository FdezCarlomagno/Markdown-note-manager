import { JwtPayload } from "jsonwebtoken"

export interface User {
    id: number
    username: string
    password: string
    email: string
    isAdmin: boolean
    tokenVersion: number
    isVerified: boolean
    verification_code: string | null
    code_expires: Date | null
}

export interface UserToken extends JwtPayload {
    sub: string,
    email: User['email'],
    isAdmin: User['isAdmin'],
    tokenVersion: User['tokenVersion']
    email_verified: User['isVerified']
    verification_code: User['verification_code']
    code_expires: User['code_expires']
}

export interface Note {
    id: number
    title: string
    content: string
    createdAt: string
    user_id: User['id']
}

export interface ApiResponse<T> {
    error: boolean
    message: string
    data: T 
}

