import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const isDevelopment = process.env.NODE_ENV == 'development'

//devuelve true por ahora
console.log(isDevelopment && process.env.DB_HOST)

export const pool = mysql.createPool({
    host: isDevelopment ? process.env.DB_HOST : process.env.DB_HOST_PRODUCTION,
    user: isDevelopment ? process.env.DB_USER : process.env.DB_USER_PRODUCTION,
    password: isDevelopment ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

