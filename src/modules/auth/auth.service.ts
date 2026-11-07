import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnvKey } from "../../lib/env";
import { APIError } from "../../utils/APIError";
import { Employee } from "../employee/employee.model";
import type { LoginInput } from "./auth.validation";



export const loginService = async (data: LoginInput) => {

    const employee = await Employee.findOne({
        emailId: data.username.toLowerCase()
    }).select("+password");

    if (!employee) {
        throw new APIError(401, "Invalid username or password");
    }
    if(!employee.password) {return}
    const isPasswordValid = await bcrypt.compare(data.password, employee.password);

    if (!isPasswordValid) {
        throw new APIError(403, "Invalid username or password");
    }

    const token = jwt.sign(
        {
            id: employee._id.toString(),
            employeeId: employee.employeeId,
            role: employee.role
        },
        getEnvKey.secretKey,
        {
            expiresIn: "1d"
        })

    return {
        token,
        employee: {
            employeeId: employee.employeeId,
            employeeName: employee.employeeName,
            email: employee.emailId,
            role: employee.role,
            depId: employee.deptId
        }
    }
}