import type { NextFunction, Request, Response } from "express";
import { createBulkDepartmentService, createDepartmentService, deleteDepartmentService, getAllDepartmentService, updateDepartmentService } from "./department.service";
import { createBulkDepartmentValidation, createDepartmentValidation, updateDepartmentValidation } from "./department.validation";

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = createDepartmentValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.flatten()
            });
        }

        const department = await createDepartmentService(validation.data);

        return res.status(201).json({
            success: true,
            message: "Parent Department created successsfully!",
            data: department
        })
    } catch (error) {
        next(error)
    }
}

export const createBulkDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = createBulkDepartmentValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.flatten()
            });
        }

        const department = await createBulkDepartmentService(validation.data);

        return res.status(201).json({
            success: true,
            message: "Parent Department created successsfully!",
            data: department
        })
    } catch (error) {
        next(error)
    }
}

export const getAllDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const department = await getAllDepartmentService()
        return res.status(200).json({
            success: true,
            message: "Parent Department fetched successsfully!",
            data: department
        })
    } catch (error) {
        next(error)
    }
}

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const departmentId = Number(req.params.id)
        if (!Number.isInteger(departmentId) || departmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid department ID",
            })
        }

        const validation = updateDepartmentValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.flatten()
            });
        }

        const department = await updateDepartmentService(departmentId, validation.data);

        return res.status(200).json({
            success: true,
            message: "Parent Department updated successsfully!",
            data: department
        })
    } catch (error) {
        next(error)
    }
}

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const departmentId = Number(req.params.id)
        if (!Number.isInteger(departmentId || departmentId <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project employee ID",
            })
        }

        const department = await deleteDepartmentService(departmentId);

        return res.status(200).json({
            success: true,
            message: "Parent Department delete successsfully!",
            data: department
        })
    } catch (error) {
        next(error)
    }
}