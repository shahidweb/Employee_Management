import { model, Schema } from "mongoose"

export interface ILeaveType extends Document {
    leaveTypeId: number;
    typeName: string;
    isActive: boolean;
}

const leaveTypeSchema = new Schema<ILeaveType>({
    leaveTypeId: { type: Number, unique: true, required: true },
    typeName: { type: String, unique: true, required: true, trim: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })


export const LeaveType = model<ILeaveType>('LeaveType', leaveTypeSchema)