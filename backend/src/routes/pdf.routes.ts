import express from 'express'
import { PDF_Controller } from '../controllers/pdf.controller'
const router = express.Router()
import { verifyToken, verifyCookie } from '../middlewares/auth.middlewares'

router.post('/generate-pdf', verifyCookie, PDF_Controller.createPDF)

export default router