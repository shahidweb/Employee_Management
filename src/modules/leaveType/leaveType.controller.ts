import type { NextFunction, Request, Response } from "express";
import { createLeaveTypeService, getLeaveTypesService } from "./leaveType.service";
import { createLeaveTypeValidation } from "./leaveType.validation";


export const createLeaveType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = createLeaveTypeValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).send({
                success: false,
                message: "Validation Failed",
                error: validation.error.flatten()
            })
        }
        const leaveType = await createLeaveTypeService(validation.data);
        return res.status(201).send({
            success: true,
            message: "Leave type created successfully!",
            data: leaveType
        })

    } catch (error) {
        next(error)
    }
}


export const getLeaveType = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const leaveType = await getLeaveTypesService()
        return res.status(201).send({
            success: true,
            message: "Leave type fetched successfully!",
            data: leaveType
        })

    } catch (error) {
        next(error)
    }
}