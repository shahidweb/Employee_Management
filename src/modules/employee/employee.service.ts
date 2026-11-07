import bcrypt from "bcryptjs";
import { APIError } from "../../utils/APIError";
import { Counter } from "./counter.model";
import { Employee } from "./employee.model";
import type { CreateEmployeeInput } from "./employee.validation";


export const createEmployeeService = async (data: CreateEmployeeInput) => {

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
    if(employeeRes.password){
        delete employeeRes.password
    }
    return employee;
}