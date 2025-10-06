import express from 'express'
import { PDF_Controller } from '../controllers/pdf.controller'
const router = express.Router()
import { verifyCookie } from '../middlewares/auth.middlewares'
import { pdfCreationLimiter } from '../utils/rateLimiter'

//max 5 pdfs for ip within 15 minutes
router.post('/generate-pdf', pdfCreationLimiter, verifyCookie, PDF_Controller.createPDF)

export default router