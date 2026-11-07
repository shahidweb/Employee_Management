
import type { NextFunction, Request, Response } from "express";
import { loginService } from "./auth.service";
import { loginSchema } from "./auth.validation";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "validation Failed",
                errors: validation.error.flatten()
            });
        }
        const result = await loginService(validation.data)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        })

    } catch (err) {
        next(err);
    }
}