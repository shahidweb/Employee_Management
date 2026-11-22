import { APIError } from "../../utils/APIError";
import { Employee } from "../employee/employee.model";
import { EarnedLeave } from "./earnedLeave.model";
import type { CreateEarnedLeaveInput } from "./earnedLeave.validation";
import { EarnedLeaveCounter } from "./earnedLeaveCounter.model";


export const createEarnedLeaveService = async (data: CreateEarnedLeaveInput) => {
    const existingEmploye = await Employee.findOne({ employeeId: data.employeeId, isActive: true })
    if (!existingEmploye) {
        throw new APIError(404, "Employee ID not found")
    }

    const existingEarnedLeave = await EarnedLeave.findOne({ employeeId: data.employeeId, isActive: true })
    if (existingEarnedLeave) {
        throw new APIError(409, "Earned Leave record already exists for this employee")
    }

    // const updateEarnedLeave = await EarnedLeave.findOne({ employeeId: data.employeeId, isActive: false });
    // if (updateEarnedLeave) {
    //     updateEarnedLeave.isActive = true;
    //     updateEarnedLeave.totalEarnedLeaves = data.totalEarnedLeaves;
    //     updateEarnedLeave.totalSickEarnedLeaves = data.totalSickEarnedLeaves;
    //     updateEarnedLeave.lastUpdatedDate = data.lastUpdatedDate;

    //     await updateEarnedLeave.save();
    //     return {
    //         earnedLeaveId: updateEarnedLeave.earnedLeaveId,
    //         employeeId: updateEarnedLeave.employeeId,
    //         totalEarnedLeaves: updateEarnedLeave.totalEarnedLeaves,
    //         totalSickEarnedLeaves: updateEarnedLeave.totalSickEarnedLeaves,
    //         lastUpdatedDate: updateEarnedLeave.lastUpdatedDate
    //     };
    // }

    const counter = await EarnedLeaveCounter.findByIdAndUpdate(
        "earnedLeaveId",
        { $inc: { sequence: 1 } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )

    if (!counter) {
        throw new APIError(500, "Unable to generate child department ID")
    }

    const earnedLeave = await EarnedLeave.create({
        earnedLeaveId: counter.sequence,
        employeeId: data.employeeId,
        totalEarnedLeaves: data.totalEarnedLeaves,
        totalSickEarnedLeaves: data.totalSickEarnedLeaves,
        lastUpdatedDate: data.lastUpdatedDate
    })

    return {
        earnedLeaveId: earnedLeave.earnedLeaveId,
        employeeId: earnedLeave.employeeId,
        totalEarnedLeaves: earnedLeave.totalEarnedLeaves,
        totalSickEarnedLeaves: earnedLeave.totalSickEarnedLeaves,
        lastUpdatedDate: earnedLeave.lastUpdatedDate
    };

}

export const getAllEarnedLeaveService = async () => {
    const allearnedLeaveService = await EarnedLeave.find()
        .select("earnedLeaveId employeeId totalEarnedLeaves totalSickEarnedLeaves lastUpdatedDate -_id")
        .sort({ earnedLeaveId: 1 }).lean();

    return allearnedLeaveService;

}

export const getEarnedLeaveByEmpIdService = async (employeeId: number) => {
    const existingEmploye = await Employee.findOne({ employeeId, isActive: true })
    if (!existingEmploye) {
        throw new APIError(404, "Employee ID not found")
    }

    const existingEarnedLeave = await EarnedLeave.findOne({ employeeId, isActive: true })
    if (!existingEarnedLeave) {
        throw new APIError(409, "Earned Leave record does not exists for this employee")
    }

    return {
        earnedLeaveId: existingEarnedLeave.earnedLeaveId,
        employeeId: existingEarnedLeave.employeeId,
        totalEarnedLeaves: existingEarnedLeave.totalEarnedLeaves,
        totalSickEarnedLeaves: existingEarnedLeave.totalSickEarnedLeaves,
        lastUpdatedDate: existingEarnedLeave.lastUpdatedDate
    };

}

export const deleteEarnedLeaveByIdService = async (earnedLeaveId: number) => {
    const existingEarnedLeave = await EarnedLeave.findOne({ earnedLeaveId, isActive: true })
    if (!existingEarnedLeave) {
        throw new APIError(409, "Earned Leave record does not exists for this employee")
    }
    existingEarnedLeave.isActive = false;
    await existingEarnedLeave.save();
    return null;
}