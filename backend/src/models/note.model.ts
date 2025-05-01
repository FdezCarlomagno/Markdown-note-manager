import { pool } from "../db/connect";
import { Note, User } from "../types/models";

class Note_model {
    public static async getNotes(user_id : User['id']): Promise<Note[]> {
        const query = 'SELECT * FROM note WHERE user_id = ?';
        const [rows] = await pool.query(query, [user_id]);
        return rows as Note[];
    }

    public static async addNote(title: string, content: string, user_id : User['id']) : Promise<Note | null> {
        const query = 'INSERT INTO note(title, content, user_id) VALUES(?,?, ?)'
        const [result] = await pool.query(query, [title, content, user_id])
        const insertId = (result as any).insertId
        return await Note_model.getNoteById(insertId, user_id)
    }

    public static async deleteNote(id : number, user_id : User['id']) {
        const query = 'DELETE FROM note WHERE id = ? AND user_id = ?'
        const [result] = await pool.query(query, [id, user_id])

        return result
    }

    public static async updateNote(id : number, title: string, content: string, user_id : User['id']) : Promise<Note | null> {
        const query = 'UPDATE note SET title = ?, content = ? WHERE id = ? AND user_id = ?'
        await pool.query(query, [title, content, id, user_id])

        return await Note_model.getNoteById(id, user_id)
    }

    public static async getNoteById(id: number, user_id : User['id']) : Promise<Note | null> {
        const query = 'SELECT * FROM note WHERE id = ? AND user_id = ?';
        const [rows] = await pool.query(query, [id, user_id])
        const notes = rows as Note[]

        return notes.length > 0 ? notes[0] : null;
    }   
}

export default Note_model;
