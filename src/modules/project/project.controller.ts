import type { NextFunction, Request, Response } from "express";
import { APIError } from "../../utils/APIError";
import { createProjectService, deleteProjectService, getAllProjectService, getProjectByIdService, updateProjectService } from "./project.service";
import { createProjectValidation, updateProjectValidation } from "./project.validation";


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

export const getAllProject = async (_: Request, res: Response, next: NextFunction) => {
    try {

        const project = await getAllProjectService();

        return res.status(200).json({
            success: true,
            message: "All Projects fetched successfully",
            data: { project },
        })

    } catch (error) {
        next(error)
    }
}

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = Number(req.params.id)
        if (!Number.isInteger(projectId) || projectId <= 0) {
            throw new APIError(400, "ProjectId is invalid")
        }
        const project = await getProjectByIdService(projectId);
        return res.status(200).json({
            success: true,
            message: "Project fetched successfully!",
            data: { project }
        })

    } catch (error) {
        next(error)
    }
}

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = Number(req.params.id)
        if (!Number.isInteger(projectId) || projectId <= 0) {
            throw new APIError(400, "ProjectId is invalid")
        }
        const validation = updateProjectValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            });
        }
        const project = await updateProjectService(projectId,validation.data);
        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (error) {
        next(error)
    }
}


export const deleteProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            throw new APIError(400, "Invalid project ID");
        }

        // Call service
        const project = await deleteProjectService(projectId);

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: project
        });

    } catch (error) {
        next(error)
    }
}