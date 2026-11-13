
import type { NextFunction, Request, Response } from "express";
import { createProjectEmployeeService, deleteProjectEmployeeByIdService, getAllProjectEmployeeService, getProjectEmployeeByIdService, updateProjectEmployeeByIdService } from "./projectEmployee.service";
import { createProjectEmployeeValidation, updateProjectEmployeeValidation } from "./projectEmployee.validation";


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

export const getAllProjectEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectEmp = await getAllProjectEmployeeService();

        return res.status(200).json({
            success: true,
            message: "All Project Employee fetched successfully!",
            data: projectEmp
        })

    } catch (error) {
        next(error)
    }
}

export const getProjectEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const empProjectId = Number(req.params.id)
        if (!Number.isInteger(empProjectId) || empProjectId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid project employee ID"
            });
        }
        const projectEmp = await getProjectEmployeeByIdService(empProjectId);

        return res.status(200).json({
            success: true,
            message: "Project Employee fetched successfully!",
            data: projectEmp
        })

    } catch (error) {
        next(error)
    }
}

export const updateProjectEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const empProjectId = Number(req.params.id)
        if (!Number.isInteger(empProjectId) || empProjectId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid project employee ID"
            });
        }
        const validation = updateProjectEmployeeValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            })
        }

        const projectEmp = await updateProjectEmployeeByIdService(empProjectId, validation.data);
        return res.status(200).json({
            success: true,
            message: "Project Employee updated successfully!",
            data: projectEmp
        })

    } catch (error) {
        next(error)
    }
}

export const deleteProjectEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const empProjectId = Number(req.params.id)
        if (!Number.isInteger(empProjectId) || empProjectId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid project employee ID"
            });
        }
        const projectEmp = await deleteProjectEmployeeByIdService(empProjectId);

        return res.status(200).json({
            success: true,
            message: "Project Employee delete successfully!",
            data: projectEmp
        })

    } catch (error) {
        next(error)
    }
}