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

const app = express()

//Rate limiter
app.use(appLimiter)

app.use(express.json())

//Cookie parser package
app.use(cookieParser())

//http://localhost:5173

const isProduction = process.env.NODE_ENV == 'production';

const ALLOWED_ORIGINS: string[] = Object.keys(process.env)
  .filter(key => key.split('_')[1] === 'URL')
  .map(key => process.env[key] as string);


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