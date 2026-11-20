import { model, Schema } from "mongoose";


export const LeaveTypeCounterSchema = new Schema({
    _id: { type: String, requred: true },
    sequence: { type: Number, default: 0 }
}, { versionKey: false })


export const LeaveTypeCounter = model("LeaveTypeCounter", LeaveTypeCounterSchema)