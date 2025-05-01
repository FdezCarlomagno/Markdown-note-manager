import type { Request, Response, NextFunction } from "express"
import Note_Error from "./noteError"
import createResponse from "../utils/createResponse"

export const notFoundHandler = (req : Request, res : Response, next : NextFunction ) => {
    return next(new Note_Error(createResponse(true, `The URL : ${getUrl(req)} was not found on the server (check request method)`, []), 404))
}

const getUrl = (req : Request) : string => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`
}