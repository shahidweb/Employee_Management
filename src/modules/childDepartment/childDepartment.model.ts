import { model, Schema } from "mongoose"


export interface IChidlDepartment extends Document {
    childDeptId: number,
    parentDeptId: number,
    departmentName: string,
    isActive: boolean
}

const childDepartmentSchema = new Schema<IChidlDepartment>({
    childDeptId: { type: Number, required: true, unique: true },
    parentDeptId: { type: Number, required: true },
    departmentName: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true }
})

export const ChildDepartment = model<IChidlDepartment>('ChildDepartment', childDepartmentSchema)