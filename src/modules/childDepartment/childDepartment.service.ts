import { APIError } from "../../utils/APIError";
import { Department } from "../department/department.model";
import { ChildDepartment } from "./childDepartment.model";
import type { CreateChildDepartmentInput } from "./childDepartment.validation";
import { ChildDepartmentCounter } from "./childDepartmentCounter.model";


export const createChildDepartmentService = async (data: CreateChildDepartmentInput) => {

    const parentDepartment = await Department.findOne({ departmentId: data.parentDeptId, isActive: true })
    if (!parentDepartment) {
        throw new APIError(404, 'Invalid Department Id')
    }
    if (parentDepartment?.departmentName !== data.departmentName) {
        throw new APIError(404, 'Department name is not correct')
    }

    const existingDepartment = await ChildDepartment.findOne({
        parentDeptId: data.parentDeptId,
        departmentName: data.departmentName,
        isActive: true
    });

    if (existingDepartment) {
        throw new APIError(409, "Child department already exists!")
    }

    const counter = await ChildDepartmentCounter.findByIdAndUpdate(
        { _id: "childDeptId" },
        { $inc: { sequence: 1 } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )

    if (!counter) {
        throw new APIError(500, "Unable to generate child department ID")
    }

    const childDepartment = await ChildDepartment.create({
        childDeptId: counter.sequence,
        ...data,
        isActive: true,
    });
    return {
        childDeptId: childDepartment.childDeptId,
        parentDeptId: childDepartment.parentDeptId,
        departmentName: childDepartment.departmentName
    }
}

export const getAllChildDepartmentService = async () => {
    const childDepartment = await ChildDepartment.find({ isActive: true })
        .select("childDeptId parentDeptId departmentName -_id")
        .sort({ childDeptId: 1 })
        .lean()
    return childDepartment
}

export const getChildDepartmentByParentIdService = async (parentDeptId: number) => {
    const childDepartment = await ChildDepartment.findOne({ parentDeptId, isActive: true })
        .select("childDeptId parentDeptId departmentName -_id")
        .sort({ childDeptId: 1 })
        .lean()
    return childDepartment
}

export const deleteChildDepartmentByIdService = async (childDeptId: number) => {
    const childDepartment = await ChildDepartment.findOne({ childDeptId, isActive: true });

    if (!childDepartment) {
        throw new APIError(404, "Child Department id not found")
    }
    childDepartment.isActive = false;
    await childDepartment.save();
    return {
        childDeptId: childDepartment.childDeptId,
        parentDeptId: childDepartment.parentDeptId,
        departmentName: childDepartment.departmentName
    }
}