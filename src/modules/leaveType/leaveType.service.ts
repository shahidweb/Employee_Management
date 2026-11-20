import { APIError } from "../../utils/APIError";
import { LeaveType } from "./leaveType.model";
import type { CreateLeaveTypeInput } from "./leaveType.validation";
import { LeaveTypeCounter } from "./leaveTypeCounter.model";

export const createLeaveTypeService = async (data: CreateLeaveTypeInput) => {
    const existingLeaveType = await LeaveType.findOne({ typeName: data.typeName, isActive:true });
    if (existingLeaveType) {
        throw new APIError(409, "Leave type already exists ")
    }

    const counter = await LeaveTypeCounter.findByIdAndUpdate(
        { _id: "leaveTypeId" },
        { $inc: { sequence: 1 } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )

    if (!counter) {
        throw new APIError(500, "Unable to generate Leave Type Id")
    }

    const leaveType = await LeaveType.create({
        leaveTypeId: counter.sequence,
        typeName: data.typeName
    })

    return {
        leaveTypeId: leaveType.leaveTypeId,
        typeName: leaveType.typeName
    }
}

export const getLeaveTypesService = async () => {
    const leaveTypes = await LeaveType.find({})
        .select("leaveTypeId typeName -_id")
        .sort({ leaveTypeId: 1 })
        .lean();
    return leaveTypes;
}