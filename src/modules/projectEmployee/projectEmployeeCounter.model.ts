import mongoose, { Schema } from "mongoose";

const projectEmployeeCounterSchema = new Schema(
    {
        _id: { type: String, required: true },
        sequence: { type: Number, default: 0 }
    },
    {
        versionKey: false
    }
)

export const ProjectEmployeeCounter = mongoose.model("ProjectEmployeeCounter", projectEmployeeCounterSchema);