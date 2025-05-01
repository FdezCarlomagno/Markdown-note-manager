import { User, UserToken } from "../types/models";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createResponse from "../utils/createResponse";
import { User_model } from "../models/user.model";
import Note_Error from "./noteError";

dotenv.config();

const secret: string = process.env.JWT_SECRET as string;

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const headers = req.headers.authorization;

    if (!headers) {
        return res.status(401).json(createResponse(true, "Missing authorization header", []));
    }

    const auth = headers.split(" ");
    
    const token = auth[1]
    const header = auth[0]
    
    if (header !== "Bearer" || !token) {
        return res.status(401).json(createResponse(true, "Invalid token format", []));
    }

    try {
        const decoded = jwt.verify(token, secret) as UserToken;
        (req as any).user = decoded; // Attach decoded user to request
        const user = await User_model.getUserById(Number(decoded.sub)) as User
        
        if(!user || decoded.tokenVersion !== user.tokenVersion){
            throw new Note_Error(createResponse(true, "Token revoked. Please log in again", []), 401)
        }

        next();
    } catch (err : any) {
        return res.status(err.statusCode || 500).json(createResponse(err.error, err.message, err.data));
    }
};

export const verifyCookie = async (req: Request, res: Response, next : NextFunction) : Promise<Response | void> => {
    //Verify the user is logged in
    const token = req.cookies.jwt;
    
    try {
        if(!token){
            throw new Note_Error(createResponse(true, "Missing token", req.cookies), 401)
        }

        const decoded = jwt.verify(token, secret) as UserToken;
        (req as any).user = decoded; // Attach decoded user to request

        next();
    } catch (err : any) {
        return res.status(err.statusCode || 500).json(createResponse(err.error, err.message, err.data));
    }
}

export const checkIsVerified = async (req: Request, res: Response, next: NextFunction) => {
    //the user has to be logged in
    const reqUser : UserToken = (req as any).user
    try {
        const user = await User_model.getUserById(Number(reqUser.sub)) 
        
        if(!user?.isVerified){
            throw new Note_Error(createResponse(true, 'Email is not verified', []), 401)
        }

        next()
    } catch (err : any) {
        return res.status(err.statusCode || 500).json(createResponse(err.error, err.message, err.data));
    }
}

export const checkIsAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
    const user = (req as any).user as User;
    if (!user?.isAdmin) {
        return res.status(403).json(createResponse(true, "Admin access required", []));
    }
    next();
};
