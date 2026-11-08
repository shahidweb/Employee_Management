import bcrypt from "bcryptjs";
import { APIError } from "../../utils/APIError";
import { Counter } from "./counter.model";
import { Employee } from "./employee.model";
import type { CreateEmployeesInput, UpdateEmployeeInput } from "./employee.validation";


export const createEmployeeService = async (data: CreateEmployeesInput) => {

    const existingEmployee = await Employee.findOne({
        emailId: data.emailId.toLowerCase()
    })

    if (existingEmployee) {
        throw new APIError(409, "Email already registered")
    }

    const counter = await Counter.findByIdAndUpdate('employeeId',
        { $inc: { sequence: 1 } }, { new: true, upsert: true });

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const employee = await Employee.create({
        ...data,
        emailId: data.emailId.toLowerCase(),
        password: hashedPassword,
        employeeId: counter!.sequence,
    });

    const employeeRes = employee.toObject();
    if (employeeRes.password) {
        delete employeeRes.password
    }
    return employee;
}

export const getAllEmployeesService = async (query: any) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: any = {
        isActive: true
    }

    if (query.search) {
        filter.$or = [
            { employeeName: { $regex: query.search, $options: "i" } },
            { emailId: { $regex: query.search, $options: "i" } }
        ]
    }

    if (query.deptId) {
        filter.deptId = Number(query.deptId);
    }

    if (query.role) {
        filter.role = query.role
    }

    const [employees, totalRecords] = await Promise.all([
        Employee.find(filter)
            .select("-password")
            .sort({ createdDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Employee.countDocuments(filter)
    ]);

    return {
        employees,
        pagination: {
            totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            limit
        }
    }
}

export const getEmployeeByIdService = async (employeeId: number) => {
    const employee =
        await Employee.findOne({ employeeId, isActive: true })
            .select("-password").lean();

    if (!employee) {
        throw new APIError(404, "Employee not found")
    }
    return employee;
}

export const updateEmployeeService = async (employeeId: number, data: UpdateEmployeeInput) => {

    const employee = await Employee.findOne({ employeeId, isActive: true })
    if (!employee) {
        throw new APIError(404, "Employee not found. Please check!");
    }

    if (data.emailId) {
        const existingEmployee = await Employee.findOne({
            emailId: data.emailId.toLowerCase(),
            employeeId: { $ne: employeeId }
        })
        if (existingEmployee) {
            throw new APIError(409, "Email already registered");
        }
    }

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    if (data.emailId) {
        data.emailId = data.emailId.toLowerCase();
    }

    Object.assign(employee, data);
    await employee.save();

    const response = employee.toObject()
    delete response.password;
    return response;
}

export const deleteEmployeeService = async (employeeId: number) => {

    const employee = await Employee.findOne({ employeeId, isActive: true });
    if (!employee) {
        throw new APIError(404, "Employee not found");
    }

    employee.isActive = false;
    await employee.save();

    return {
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        isActive: employee.isActive
    };
};