import { APIError } from "../../utils/APIError";
import { Department } from "./department.model";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "./department.validation";
import { DepartmentCounter } from "./departmentCounter.model";


export const createDepartmentService = async (data: CreateDepartmentInput) => {

    const existingDepartment = await Department.findOne({ departmentName: data.departmentName });
    if (existingDepartment) {
        throw new APIError(409, "Department already exists")
    }

    const counter = await DepartmentCounter.findOneAndUpdate(
        { _id: "departmentId" },
        { $inc: { sequence: 1 } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
    if (!counter) {
        throw new APIError(500, "Unable to generate department ID")
    }

    const department = await Department.create({
        departmentId: counter.sequence,
        ...data
    });

    return {
        departmentId: department.departmentId,
        departmentName: department.departmentName,
        departmentLogo: department.departmentLogo
    };
}

export const createBulkDepartmentService = async (data: CreateDepartmentInput[]) => {

    const departmentNames = data.map(item => item.departmentName.trim().toLowerCase());

    if (new Set(departmentNames).size !== departmentNames.length) {
        throw new APIError(409, "Dupilcate department names in request")
    }

    const existingDepartment = await Department.find({
        isActive: true,
        departmentName: {
            $in: data.map(item => item.departmentName)
        }
    }).lean();

    if (existingDepartment.length > 0) {
        throw new APIError(409, "Department already exists")
    }

    const counter = await DepartmentCounter.findOneAndUpdate(
        { _id: "departmentId" },
        { $inc: { sequence: data.length } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
    if (!counter) {
        throw new APIError(500, "Unable to generate department ID");
    }
    const firstDepartmentId = counter.sequence - data.length + 1;

    const departmentToCreate = data.map((item, index) => ({
        departmentId: firstDepartmentId + index,
        departmentName: item.departmentName,
        departmentLogo: item.departmentLogo,
        isActive: true
    }))

    const department = await Department.insertMany(departmentToCreate)

    return department.map(department => ({
        departmentId: department.departmentId,
        departmentName: department.departmentName,
        departmentLogo: department.departmentLogo
    }));
}

export const getAllDepartmentService = async () => {
    const department = await Department.find({ isActive: true })
        .select("departmentId departmentName departmentLogo -_id")
        .sort({ departmentId: 1 })
        .lean()
    return department;
}

export const updateDepartmentService = async (departmentId: number, data: UpdateDepartmentInput) => {
    const exisitngDepartment = await Department.findOne({ departmentId, isActive: true });
    if (!exisitngDepartment) {
        throw new APIError(404, "Department id not found")
    }

    if (data.departmentName) {
        const duplicateDepartment = await Department.findOne({
            departmentName: data.departmentName,
            departmentId: { $ne: departmentId },
            isActive: true
        })
        if (duplicateDepartment) {
            throw new APIError(409, "Department already exists")
        }
    }
    Object.assign(exisitngDepartment, data)
    await exisitngDepartment.save();
    return {
        departmentId: exisitngDepartment.departmentId,
        departmentName: exisitngDepartment.departmentName,
        departmentLogo: exisitngDepartment.departmentLogo
    };
}

export const deleteDepartmentService = async (departmentId: number) => {
    const exisitngDepartment = await Department.findOne({ departmentId, isActive: true });
    if (!exisitngDepartment) {
        throw new APIError(404, "Department id not found")
    }
    exisitngDepartment.isActive = false;
    await exisitngDepartment.save();
    return {
        departmentId: exisitngDepartment.departmentId,
        departmentName: exisitngDepartment.departmentName,
        departmentLogo: exisitngDepartment.departmentLogo
    };
}