import { model, Schema } from "mongoose";


const childDepartmentCounterSchema = new Schema(
    {
        _id: { type: String, required: true },
        sequence: { type: Number, required: true, default: 0 },
    },
    { versionKey: false }
)

export const ChildDepartmentCounter = model('ChildDepartmentCounter', childDepartmentCounterSchema);