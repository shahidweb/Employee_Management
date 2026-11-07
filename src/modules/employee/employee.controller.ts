import type { NextFunction, Request, Response } from "express";
import { createEmployeeService } from "./employee.service";
import { createEmployeeSchema } from "./employee.validation";


export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = createEmployeeSchema.safeDecode(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "validation Failed",
                error: validation.error.flatten()
            })
        }
        const employee = await createEmployeeService(validation.data);

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee
        })
    } catch (error) {
        next(error)
    }
}