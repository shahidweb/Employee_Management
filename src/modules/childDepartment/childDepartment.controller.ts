import type { NextFunction, Request, Response } from "express";
import { createChildDepartmentService, deleteChildDepartmentByIdService, getAllChildDepartmentService, getChildDepartmentByParentIdService } from "./childDepartment.service";
import { createChildDepartmentValidation } from "./childDepartment.validation";



export const createChildDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = createChildDepartmentValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: validation.error.flatten()
            })
        }
        const childDepartment = await createChildDepartmentService(validation.data);
        return res.status(201).send({
            success: true,
            message: "Child department created successfully!",
            data: { childDepartment }
        })

    } catch (error) {
        next(error)
    }
}

export const getAllChildDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const childDepartment = await getAllChildDepartmentService();
        return res.status(200).send({
            success: true,
            message: "All Child department fetched successfully!",
            data: childDepartment
        })
    } catch (error) {
        next(error)
    }
}

export const getChildDepartmentByParentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parentDepartmentId = Number(req.params.id);
        if (!Number.isInteger(parentDepartmentId) || parentDepartmentId <= 0) {
            return res.status(400).send({
                success: false,
                message: "Parent Department Id invalid!",
                data: null
            })
        }
        const childDepartment = await getChildDepartmentByParentIdService(parentDepartmentId);
        return res.status(200).send({
            success: true,
            message: "Child department fetched successfully!",
            data: childDepartment 
        })

    } catch (error) {
        next(error)
    }
}

export const deleteChildDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const childDepartmentId = Number(req.params.id);
        if (!Number.isInteger(childDepartmentId) || childDepartmentId <= 0) {
            return res.status(400).send({
                success: false,
                message: "Child Department Id invalid!",
                data: null
            })
        }
        const childDepartment = await deleteChildDepartmentByIdService(childDepartmentId);
        return res.status(200).send({
            success: true,
            message: "Child department delete successfully!",
            data: childDepartment
        })

    } catch (error) {
        next(error)
    }
}