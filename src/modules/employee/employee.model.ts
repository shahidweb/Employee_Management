import mongoose, { Document, Schema } from "mongoose";
import type { IUser } from "../auth/user.model";

export type EmployeeRole = "Admin" | "HR" | "Employee";
export type Gender = "Male" | "Female" | "Other";

export interface IEmployee extends Document {
    employeeId: number;
    employeeName: string;
    contactNo: string;
    emailId: string;
    deptId: number;
    password?: string;
    gender: Gender;
    isActive: boolean;
    role: EmployeeRole;
}

const employeeSchema = new Schema<IEmployee>({
    employeeId: { type: Number, unique: true },
    employeeName: { type: String, required: true, trim: true },
    contactNo: { type: String, required: true, trim: true },
    emailId: { type: String, required: true, unique: true, trim: true, lowercase: true },
    deptId: { type: Number, required: true },
    password: { type: String, required: true, minlength: 6, select: false },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    isActive: {type: Boolean, default: true},
    role: { type: String, enum: ["Admin", "HR", "Employee"], default: "Employee" },
},{
    timestamps: true,
})

export const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);