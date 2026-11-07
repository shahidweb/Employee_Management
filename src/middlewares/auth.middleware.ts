import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { APIError } from "../utils/APIError";
import { getEnvKey } from "../lib/env";


interface AuthPayload extends JwtPayload {
    id: string;
    role: string;
}


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new APIError(401, "Authentication required")
        }
        const decoded = jwt.verify(token, getEnvKey.secretKey);

        if (typeof decoded === "string") {
            throw new APIError(401, "Invalid token")
        }

        res.locals.auth = decoded as AuthPayload;
        next();

    } catch (error) {
        if (error instanceof APIError) {
            return next(error)
        }
        return next(new APIError(401, "Invalid or expired token"))
    }
}

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        const user = res.locals.auth as AuthPayload | undefined;

        if (!user || !roles.includes(user.role)) {
            return next(new APIError(403, "You are not authorized."))
        }
        next();
    }
}