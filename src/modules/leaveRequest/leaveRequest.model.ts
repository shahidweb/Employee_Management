import { model, Schema } from "mongoose"

export const LeaveRequestStatus = ['Pending', 'Approved', 'Rejected'];
export type ILeaveRequestStatus = "Pending" | "Approved" | "Rejected";

export interface ILeaveRequest extends Document {
    leaveId: number;
    employeeId: number;
    leaveTypeId: number;
    startDate: Date;
    endDate: Date;
    status: ILeaveRequestStatus;
    reason: string,
    requestDate: Date;
    isActive: boolean;
}

export const leaveRequestSchema = new Schema<ILeaveRequest>({
    leaveId: { type: Number, required: true, unique: true },
    employeeId: { type: Number, required: true },
    leaveTypeId: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: LeaveRequestStatus, default: "Pending", required: true },
    reason: { type: String, trim: true },
    requestDate: { type: Date, default: Date.now, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const LeaveRequest = model<ILeaveRequest>("LeaveRequest", leaveRequestSchema)