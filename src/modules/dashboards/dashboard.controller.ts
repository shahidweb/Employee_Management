import type { NextFunction, Request, Response } from "express";
import { getDashboardService, getEmployeeLeaveDashboardService, getHRDashboardService } from "./dashboard.service";

export const getHRDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allHRData = await getHRDashboardService();
        return res.status(200).send({
            success: true,
            message: "HR Dashboard data fetched sucessfully",
            data: allHRData
        })
    } catch (error) {
        next(error)
    }
}

export const getEmployeeLeaveDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = Number(req.params.id)
        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID",
            })
        }

        const allEmployeeLeaveData = await getEmployeeLeaveDashboardService(employeeId);
        return res.status(200).send({
            success: true,
            message: "Employee Leave Dashboard data fetched sucessfully",
            data: allEmployeeLeaveData
        })
    } catch (error) {
        next(error)
    }
}

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getAllDashboardData = await getDashboardService();
        return res.status(200).send({
            success: true,
            message: "Dashboard data fetched sucessfully",
            data: getAllDashboardData
        })
    } catch (error) {
        next(error)
    }
}
