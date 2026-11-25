import mongoose, { Schema } from "mongoose";

const employeeCounterSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    sequence: {
        type: Number,
        default: 0
    }
});

export const EmployeeCounter = mongoose.model("EmployeeCounter", employeeCounterSchema)