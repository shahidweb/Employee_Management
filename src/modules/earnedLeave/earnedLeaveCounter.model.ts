import { model, Schema } from "mongoose";


const earnedLeaveCounterSchema = new Schema({
    _id: { type: String, required: true },
    sequence: { type: Number, required: true, default: 0 }
}, { versionKey: false })


export const EarnedLeaveCounter = model('EarnedLeaveCounter', earnedLeaveCounterSchema)