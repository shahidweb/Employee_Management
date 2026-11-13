import mongoose, { Schema } from "mongoose";


export interface IDepartment extends Document {
    departmentId: number,
    departmentName: string,
    departmentLogo: string,
    isActive: boolean
}

const departmentSchema = new Schema<IDepartment>({
    departmentId: { type: Number, required: true, unique: true },
    departmentName: { type: String, required: true, trim: true },
    departmentLogo: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
})

export const Department = mongoose.model<IDepartment>('Department', departmentSchema);