import type { NextFunction, Request, Response } from "express";
import { createEarnedLeaveValidation } from "./earnedLeave.validation";
import { createEarnedLeaveService, deleteEarnedLeaveByIdService, getAllEarnedLeaveService, getEarnedLeaveByEmpIdService } from "./earnedLeave.service";


export const createEarnedLeave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = createEarnedLeaveValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                error: validation.error.flatten()
            })
        }

        const earnedLeave = await createEarnedLeaveService(validation.data)
        return res.status(200).send({
            success: true,
            message: "EarnedLeaved created successfully!",
            data: earnedLeave
        })

    } catch (error) {
        next(error)
    }
}

export const getAllEarnedLeave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allEarnedLeave = await getAllEarnedLeaveService()
        return res.status(200).send({
            success: true,
            message: "EarnedLeaved fetched successfully!",
            data: allEarnedLeave
        })

    } catch (error) {
        next(error)
    }
}

export const getEarnedLeaveByEmpId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = Number(req.params.id);
        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            return res.status(400).send({
                success: false,
                message: "employeeId invalid!",
                data: null
            })
        }

        const earnedLeaveByEmpId = await getEarnedLeaveByEmpIdService(employeeId)
        return res.status(200).send({
            success: true,
            message: "Employee has Earned Leaved successfully!",
            data: earnedLeaveByEmpId
        })

    } catch (error) {
        next(error)
    }
}

export const deleteEarnedLeaveById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const earnedLeaveId = Number(req.params.id);
        if (!Number.isInteger(earnedLeaveId) || earnedLeaveId <= 0) {
            return res.status(400).send({
                success: false,
                message: "earnedLeaveId invalid!",
                data: null
            })
        }

        await deleteEarnedLeaveByIdService(earnedLeaveId)
        return res.status(200).send({
            success: true,
            message: "Earned Leaved deleted successfully!",
            data: null
        })

    } catch (error) {
        next(error)
    }
}