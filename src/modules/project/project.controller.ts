import type { NextFunction, Request, Response } from "express";
import { createProjectService } from "./project.service";
import { createProjectValidation } from "./project.validation";


export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationData = createProjectValidation.safeParse(req.body);
        if (!validationData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                error: validationData.error.flatten()
            })
        }
        const project = await createProjectService(validationData.data);

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        })

    } catch (error) {
        next(error)
    }
}