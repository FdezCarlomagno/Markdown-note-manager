import type { Request, Response, NextFunction } from 'express';
import Note_model from '../models/note.model'; 
import { ApiResponse, Note } from '../types/models';
import Note_Error from '../middlewares/noteError';
import { User } from '../types/models';
import createResponse from '../utils/createResponse';

class Note_Controller {

    public static async apiCheck(req: Request, res: Response): Promise<Response> {
        return res.status(200).json({ msg: 'API running' });
    }
    public static async getNotes(req: Request, res: Response, next : NextFunction): Promise<Response | void> {
        try {
            const notes : Note[] = await Note_model.getNotes((req as any).user?.sub)

            if(!notes){
                return res.json(createResponse(false, 'No notes available', []))
            }

            return res.json(createResponse(false, 'Notes retrieved', notes) as ApiResponse<Note[]>)
        } catch (error : any){
            return next(error)
        }
    }
    public static async addNote(req: Request, res: Response, next : NextFunction): Promise<Response | void> {
        const { title, content } = req.body

        if(!title || !content){
            return next(new Note_Error(createResponse(true, 'Missing mandatory fields', []), 400))
        }

        try {
            const newNote = await Note_model.addNote(title, content, (req as any).user.sub)

            return res.json(createResponse(false, 'Note added succesfully', newNote) as ApiResponse<Note>)
        } catch(error: any){
            return next(error)
        }
    }

    public static async getNoteById(req: Request, res: Response, next: NextFunction) : Promise<Response | void> {
        const { id } = req.params
        const noteId = Number(id)

        try {
            const note = await Note_model.getNoteById(noteId, (req as any).user.sub)

            if(!note){
                throw new Note_Error(createResponse(true, `Note with id = ${noteId} not found`, []), 404)
            }

            return res.json(createResponse(false, 'Note succesfully retrieved', note) as ApiResponse<Note>)
        } catch (error : any){
            return next(error)
        }
    }

    public static async deleteNote(req : Request, res: Response, next: NextFunction) : Promise<Response | void> {
        const { id } = req.params
        const noteId = Number(id)
        /*
        check by id before deleting
        */

        try {
            const note = await Note_model.getNoteById(noteId, (req as any).user.sub)
            
            if(!note){
                throw new Note_Error(createResponse(true, `Note with id = ${noteId} not found`, []), 404)
            }

            const result = await Note_model.deleteNote(noteId, (req as any).user.sub)
            const affectedRows = (result as any).affectedRows 
            const success = affectedRows == 1

            if(!success){
                throw new Note_Error(createResponse(true, `Note with id = ${noteId} not found`, []), 404)
            }

            return res.json(createResponse(false, 'Note succesfully deleted', { RowsAffected: affectedRows }))

        } catch (error : any){
            return next(error)
        }
    }
    public static async updateNote(req: Request, res: Response, next : NextFunction) : Promise<Response | void> {
        const { title, content } = req.body
        const { id } = req.params
        const noteId = Number(id)

        try {
            const note = await Note_model.getNoteById(noteId, (req as any).user.sub)

            if(!note){
                throw new Note_Error(createResponse(true, `Note with id = ${noteId} not found`, []), 404)
            }

            const newNote = await Note_model.updateNote(noteId, title, content, (req as any).user.sub)

            return res.json(createResponse(false, 'Note succesfully edited', newNote) as ApiResponse<Note>)
        } catch (error : any){
            return next(error)
        }
    }
}

// ✅ Export the class directly (not an instance)
export default Note_Controller;
