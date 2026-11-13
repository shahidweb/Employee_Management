import mongoose, { Schema } from "mongoose";


const departmentCounterCounterScehma = new Schema(
    {
        _id: { type: String, required: true },
        sequence: { type: Number, required: true, default: 0 }
    },
    { versionKey: false }
)

export const DepartmentCounter = mongoose.model("DepartmentCounter", departmentCounterCounterScehma)