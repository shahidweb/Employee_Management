import type { NextFunction, Request, Response } from "express";
import { changeLeaveRequestStatusService, createLeaveRequestService, deleteLeaveRequestService, getAllLeaveRequestService, getLeaveRequestByEmpIdService } from "./leaveRequest.service";
import { changeLeaveStatusValidation, LeaveRequestValidation } from "./leaveRequest.validation";


export const createLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validations = LeaveRequestValidation.safeParse(req.body);
        if (!validations.success) {
            return res.status(400).send({
                success: false,
                message: "Validation Failed!",
                error: validations.error.flatten()
            })
        }
        const newLeaveRequest = await createLeaveRequestService(validations.data)
        return res.status(201).send({
            success: true,
            message: "Leave Request created successfully",
            data: newLeaveRequest
        })

    } catch (error) {
        next(error)
    }
}

export const getAllLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allLeaveRequests = await getAllLeaveRequestService()
        return res.status(200).send({
            success: true,
            message: "Leave Request fetched successfully",
            data: allLeaveRequests
        })

    } catch (error) {
        next(error)
    }
}

export const getLeaveRequestByEmpId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = Number(req.params.id);

        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            return res.status(400).send({
                success: false,
                message: "Employee Id invalid",
            })
        }

        const allLeaveRequests = await getLeaveRequestByEmpIdService(employeeId)
        return res.status(200).send({
            success: true,
            message: "Leave Request fetched successfully",
            data: allLeaveRequests
        })

    } catch (error) {
        next(error)
    }
}

export const changeLeaveRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaveId = Number(req.params.id);
        if (!Number.isInteger(leaveId) || leaveId <= 0) {
            return res.status(400).send({
                success: false,
                message: "Leave Id or status Invalid!",
            })
        }

        const validation = changeLeaveStatusValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).send({
                success: false,
                message: "Validation Failed!",
                error: validation.error.flatten()
            })
        }

        const updateLeaveRequest = await changeLeaveRequestStatusService(leaveId, validation.data)
        return res.status(200).send({
            success: true,
            message: "Leave Request status updated successfully",
            data: updateLeaveRequest
        })

    } catch (error) {
        next(error)
    }
}

export const deleteLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaveId = Number(req.params.id);

        if (!Number.isInteger(leaveId) || leaveId <= 0) {
            return res.status(400).send({
                success: false,
                message: "Leave Id Invalid!",
            })
        }

        await deleteLeaveRequestService(leaveId)
        return res.status(200).send({
            success: true,
            message: "Leave Request delete successfully",
            data: null
        })

    } catch (error) {
        next(error)
    }
}