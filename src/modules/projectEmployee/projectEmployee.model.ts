import mongoose from "mongoose"

export interface IProjectModel extends Document {
    empProjectId: number,
    projectId: number,
    empId: number,
    assignedDate: Date,
    role: string,
    isActive: boolean
}

const projectEmployeeSchema = new mongoose.Schema({
    empProjectId: { type: Number, required: true, unique: true },
    projectId: { type: Number, required: true },
    empId: { type: Number, required: true },
    assignedDate: { type: Date, required: true },
    role: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Prevent duplicate active assignments for the same employee and project.
projectEmployeeSchema.index(
    { projectId: 1, empId: 1 },
    { unique: true, partialFilterExpression: { isActive: true } }
)

export const ProjectEmployee = mongoose.model<IProjectModel>("ProjectEmployee", projectEmployeeSchema)