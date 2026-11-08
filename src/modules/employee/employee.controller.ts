import { type NextFunction, type Request, type Response } from "express";
import { APIError } from "../../utils/APIError";
import { createEmployeeService, deleteEmployeeService, getAllEmployeesService, getEmployeeByIdService, updateEmployeeService } from "./employee.service";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.validation";


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

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllEmployeesService(req.query);

        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully",
            data: result
        })

    } catch (error) {
        next(error)
    }
}

export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = Number(req.params.id);

        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            throw new APIError(400, "Invalid employee ID")
        }

        const employee = await getEmployeeByIdService(employeeId);

        return res.status(200).json({
            success: true,
            message: "Employee fetched successfully",
            data: employee
        })

    } catch (error) {
        next(error)
    }
}

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = Number(req.params.id);

        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            throw new APIError(400, "Invalid employee ID")
        }

        const validation = updateEmployeeSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            })
        }

        const currentUser = res.locals.auth;
        if (currentUser.role === 'HR' && validation.data.role !== undefined) {
            throw new APIError(403, "HR is not allowed to change employees roles")
        }

        const employee = await updateEmployeeService(employeeId, validation.data);
        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: employee
        });

    } catch (error) {
        next(error)
    }
}

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = Number(req.params.id);

        if (!Number.isInteger(employeeId) || employeeId <= 0) {
            throw new APIError(400, "Invalid employee ID");
        }

        const employee = await deleteEmployeeService(employeeId);

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
            data: employee
        });

    } catch (error) {
        next(error);
    }
};