
export type NoteId = `${string}-${string}-${string}-${string}-${string}` | null

export interface Note {
    id: number | null
    title: string
    content: string
    createdAt: string
}

export type Email = `${string}@${string}.${string}`

export interface User {
    id: number
    email: Email
    username: string
    isAdmin: boolean | number
    isVerified: boolean | number
}

export interface UserToken {
    id: number
    email: Email
    username: string
    isAdmin: number
    email_verified: number
}

export interface ApiResponse<T> {
    error: boolean
    message: string
    data: T
}

export interface LoginResponse {
    error: boolean
    message: string
}

export type Token = string | null

export enum LoadingStates {
    NOT_LOADING,
    LOADING,
    SUCCESS
}

type SlotId = `slot-${string}`
type ItemId = `item-${string}`

export interface OrderedContent {
    slotId: SlotId;
    itemId: ItemId;
    content: string;
}