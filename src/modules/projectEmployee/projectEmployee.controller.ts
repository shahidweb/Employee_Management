
import type { NextFunction, Request, Response } from "express";
import { createProjectEmployeeService } from "./projectEmployee.service";
import { createProjectEmployeeValidation } from "./projectEmployee.validation";


export const createProjectEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = createProjectEmployeeValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            })
        }
        const projectEmployee = await createProjectEmployeeService(validation.data);
        return res.status(201).json({
            success: true,
            message: "Employee assigned to project successfully",
            data: projectEmployee
        })

    } catch (error) {
        next(error)
    }
}