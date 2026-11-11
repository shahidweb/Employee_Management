import mongoose, { Schema } from "mongoose"


export interface IProjectModel extends Document {
    projectId: number,
    projectName: string,
    clientName: string,
    startDate: Date,
    leadByEmpId: number,
    contactPerson: string,
    contactNo: string,
    emailId: string,
    isActive:boolean
}

export const projectSchema = new Schema<IProjectModel>({
    projectId: { type: Number, required: true, unique: true },
    projectName: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    leadByEmpId: { type: Number, required: true, },
    contactPerson: { type: String, required: true, trim: true },
    contactNo: { type: String, required: true },
    startDate: { type: Date, required: true },
    emailId: { type: String, required: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true}
}, { timestamps: true })

export const Project = mongoose.model<IProjectModel>('Project', projectSchema)