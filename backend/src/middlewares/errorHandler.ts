import type { Request, Response, NextFunction } from 'express';
import Note_Error from './noteError'; // Import your custom error class
import { ApiResponse } from '../types/models';
import createResponse from '../utils/createResponse';

// Updated error handler to properly handle errors
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): Response {
    if (err instanceof Note_Error) {
        return res.status(err.getStatusCode() || 500).json(createResponse(err.error, err.message, err.data));
    }

    // Para otros errores, retorna un mensaje genérico
    return res.status(500).json(createResponse(true, 'Internal server error', []));
}
