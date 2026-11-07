import type { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/APIError";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof APIError ? err.statusCode : 500;
    const messsage = err instanceof APIError ? err.message : "Internal Server Error";
    return res.status(statusCode).json({ success: false, messsage })
}
