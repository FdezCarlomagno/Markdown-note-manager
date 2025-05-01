
import { ApiResponse, Note } from "../interfaces/models"
import { createResponse } from '../utils/createResponse'
import { axiosService } from "./axiosService"

export class Note_Service {

    
    public static async getUserNotes() : Promise<ApiResponse<Note[] | null>> {
        try {
            const { data : response } = await axiosService.get(`/notes`)

            if(response.error){
                throw new Error(response.message)
            }

            return response as ApiResponse<Note[]>
        } catch (err : any){
            const errorMsg = err.response.data.message
            return createResponse(true, errorMsg, null)
        }
    }
    public static async addNote(title: Note['title'], content : Note['content']) : Promise<ApiResponse<Note | null>> {
        try {
            const { data : response } = await axiosService.post(`/notes`, {
                title: title,
                content: content
            })

            if(response.error){
                throw new Error(response.message)
            }
            return response as ApiResponse<Note>
        } catch (err : any){
            const errorMsg = err.response.data.message
            return createResponse(true, errorMsg, null)
        }
    }
    public static async deleteNote(id : Note['id']) : Promise<ApiResponse<{} | null>> {
        try {
            const { data : response } = await axiosService.delete(`/notes/${id}`)

            if(response.error){
                throw new Error(response.message)
            }

            return response as ApiResponse<{}>
        } catch (err : any){
            const errorMsg = err.response.data.message
            return createResponse(true, errorMsg, null)
        }
    }
    public static async editNote(title : Note['title'], content: Note['content'], id: Note['id']) : Promise<ApiResponse<Note | null>> {
        try {
            const { data : response } = await axiosService.put(`/notes/${id}`, {
                title: title,
                content: content
            })

            if(response.error){
                throw new Error(response.message)
            }

            return response as ApiResponse<Note>
        } catch (err : any){
            const errorMsg = err.response.data.message
            return createResponse(true, errorMsg, null)
        }
    }
}