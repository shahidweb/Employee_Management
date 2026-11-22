import { model, Schema } from "mongoose"


export interface IEarnedLeave extends Document {
    earnedLeaveId: number,
    employeeId: number,
    totalEarnedLeaves: number,
    totalSickEarnedLeaves: number,
    lastUpdatedDate: Date;
    isActive: boolean;
}

const earnedLeaveSchema = new Schema<IEarnedLeave>({
    earnedLeaveId: { type: Number, unique: true, required: true },
    employeeId: { type: Number, unique: true, required: true },
    totalEarnedLeaves: { type: Number, unique: true, required: true },
    totalSickEarnedLeaves: { type: Number, unique: true, required: true },
    lastUpdatedDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })


export const EarnedLeave = model<IEarnedLeave>("EarnedLeave", earnedLeaveSchema)