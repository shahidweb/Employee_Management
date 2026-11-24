import { APIError } from "../../utils/APIError";
import { Employee } from "../employee/employee.model";
import { LeaveType } from "../leaveType/leaveType.model";
import { LeaveRequest, LeaveRequestStatus, type ILeaveRequestStatus } from "./leaveRequest.model";
import type { ChangeLeaveStatusInput, LeaveRequestValidationInput } from "./leaveRequest.validation";
import { LeaveRequestCounter } from "./leaveRequestCounter.model";


export const createLeaveRequestService = async (data: LeaveRequestValidationInput) => {

    const exisitngEmployee = await Employee.findOne({ employeeId: data.employeeId, isActive: true });
    if (!exisitngEmployee) {
        throw new APIError(409, "Employee id not found!")
    }

    const exisitngLeaveType = await LeaveType.findOne({ leaveTypeId: data.leaveTypeId, isActive: true });
    if (!exisitngLeaveType) {
        throw new APIError(400, "Leave Type ID not found")
    }

    if (data.startDate > data.endDate) {
        throw new APIError(400, "Start date cannot be greater than end date");
    }
    const counter = await LeaveRequestCounter.findByIdAndUpdate(
        "leaveId",
        { $inc: { sequence: 1 } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
    if (!counter) {
        throw new APIError(500, "Unable to generate Leave Request Id")
    }
    const newleaveRequest = await LeaveRequest.create({
        leaveId: counter.sequence,
        ...data,
        status: "Pending",
        reason: data.reason || '',
        requestDate: new Date()
    });

    return {
        leaveId: newleaveRequest.leaveId,
        employeeId: newleaveRequest.employeeId,
        leaveTypeId: newleaveRequest.leaveTypeId,
        startDate: newleaveRequest.startDate,
        endDate: newleaveRequest.endDate,
        status: newleaveRequest.status,
        reason: newleaveRequest.reason,
        requestDate: newleaveRequest.requestDate
    };
}

export const getAllLeaveRequestService = async () => {

    const getAllLeaveRequest = await LeaveRequest.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $lookup: {
                from: "employees",
                localField: "employeeId",
                foreignField: "employeeId",
                as: "employee"
            }
        },
        {
            $unwind: {
                path: "$employee",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "leavetypes",
                localField: "leaveTypeId",
                foreignField: "leaveTypeId",
                as: "leaveType"
            }
        },
        {
            $unwind: {
                path: "$leaveType",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                leaveId: 1,
                employeeId: 1,
                leaveTypeId: 1,
                startDate: 1,
                endDate: 1,
                status: 1,
                reason: 1,
                requestDate: 1,
                employeeName: '$employee.employeeName',
                contactNo: '$employee.contactNo',
                typeName: '$leaveType.typeName'
            }
        },
        {
            $sort: {
                leaveId: 1
            }
        }
    ])
    return getAllLeaveRequest
}

export const getLeaveRequestByEmpIdService = async (employeeId: number) => {

    const exitingEmployee = await Employee.findOne({ employeeId, isActive: true })
    if (!exitingEmployee) {
        throw new APIError(400, "Employe id doesn't exist")
    }

    const getLeaveRequest = await LeaveRequest.aggregate([
        {
            $match: {
                employeeId,
                isActive: true
            }
        },
        {
            $lookup: {
                from: "employees",
                localField: 'employeeId',
                foreignField: 'employeeId',
                as: 'employee'
            }
        },
        {
            $unwind: {
                path: "$employee",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "leavetypes",
                localField: "leaveTypeId",
                foreignField: "leaveTypeId",
                as: "leaveType"
            }
        },
        {
            $unwind: {
                path: "$leaveType",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                leaveId: 1,
                employeeId: 1,
                leaveTypeId: 1,
                startDate: 1,
                endDate: 1,
                status: 1,
                reason: 1,
                requestDate: 1,
                employeeName: '$employee.employeeName',
                contactNo: '$employee.contactNo',
                typeName: '$leaveType.typeName'
            }
        },
        {
            $sort: {
                leaveId: 1
            }
        }
    ])

    return getLeaveRequest[0];
}

export const changeLeaveRequestStatusService = async (leaveId: number, data: ChangeLeaveStatusInput) => {
    const leaveRequest = await LeaveRequest.findOne({ leaveId, isActive: true });
    if (!leaveRequest) {
        throw new APIError(404, "Leave Request ID not found")
    }
    
    leaveRequest.status = data.status;
    leaveRequest.save();

    return leaveRequest;
}

export const deleteLeaveRequestService = async (leaveId: number) => {
    const existingLeaveRequest = await LeaveRequest.findOne({ leaveId, isActive: true });

    if (!existingLeaveRequest) {
        throw new APIError(404, "Leave id invalid!")
    }
    existingLeaveRequest.isActive = false;
    existingLeaveRequest.save();

    return existingLeaveRequest;
}