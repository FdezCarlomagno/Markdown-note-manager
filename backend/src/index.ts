import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import note_routes from './routes/notes.routes'
import user_routes from './routes/user.routes'
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import pdf_routes from './routes/pdf.routes'
import cookieParser from "cookie-parser";
import { appLimiter } from "./utils/rateLimiter";

dotenv.config()

const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.CLIENT_URL

const app = express()

//Rate limiter
app.use(appLimiter)

app.use(express.json())

//Cookie parser package
app.use(cookieParser())

//http://localhost:5173

const ALLOWED_ORIGINS = [
    FRONTEND_URL,
    'https://t7kvkw28-5173.brs.devtunnels.ms',
]

app.use(cors({
    origin: (origin, callback) => {
        if(!origin || ALLOWED_ORIGINS.includes(origin)){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, // Explicitly allow your frontend URL
    credentials: true
}));


app.use('/api', note_routes)
app.use('/api', user_routes)
app.use('/api', pdf_routes)

app.use(notFoundHandler)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log('Server listening in PORT:', PORT)
})