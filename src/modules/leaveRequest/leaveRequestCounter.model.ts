import { model, Schema } from "mongoose";

const leaveRequestCounter = new Schema({
    _id: { type: String, required: true },
    sequence: { type: Number, default: 0 }
}, { versionKey: false })

export const LeaveRequestCounter = model("LeaveRequestCounters", leaveRequestCounter)
