import express from 'express';
import Note_Controller from '../controllers/note.controller';
import { verifyToken, verifyCookie } from '../middlewares/auth.middlewares';
const router = express.Router();

router.get('/health', Note_Controller.apiCheck);

//Protected routes
router.get('/notes/:id', verifyCookie, Note_Controller.getNoteById)
router.get('/notes', verifyCookie, Note_Controller.getNotes)
router.post('/notes', verifyCookie, Note_Controller.addNote)
router.put('/notes/:id', verifyCookie, Note_Controller.updateNote)
router.delete('/notes/:id', verifyCookie, Note_Controller.deleteNote)

export default router;
