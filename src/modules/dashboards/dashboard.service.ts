import { EarnedLeave } from "../earnedLeave/earnedLeave.model";
import { Employee } from "../employee/employee.model";
import { LeaveRequest, LeaveRequestStatus } from "../leaveRequest/leaveRequest.model";
import { Project } from "../project/project.model";



export const getHRDashboardService = async () => {
    const totalEmployee = await Employee.countDocuments({ isActive: true });
    const leaveStats = await LeaveRequest.aggregate([
        {
            $match: { isActive: true }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])
    console.log(leaveStats)
    const totalLeave = leaveStats.reduce((total, item) => total + item.count, 0);
    const totalNewLeaves = leaveStats.find(item => item._id === LeaveRequestStatus[1])?.count ?? 0
    const totalApprovedLeaves = leaveStats.find(item => item._id === LeaveRequestStatus[1])?.count ?? 0
    const totalCanceledLeave = leaveStats.find(item => item._id === LeaveRequestStatus[2])?.count ?? 0

    return {
        totalEmployee,
        totalLeave,
        totalNewLeaves,
        totalApprovedLeaves,
        totalCanceledLeave,
    }

}

export const getEmployeeLeaveDashboardService = async (employeeId: number) => {
    const earnedLeaveRecode =
        await EarnedLeave
            .findOne({ employeeId, isActive: true })
            .select("totalEarnedLeaves -_id")
            .lean();

    const leaveStats = await LeaveRequest.aggregate([
        {
            $match: { employeeId, isActive: true }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])
    const totalNewLeaves = leaveStats.find(item => item._id === LeaveRequestStatus[1])?.count ?? 0
    const totalApprovedLeaves = leaveStats.find(item => item._id === LeaveRequestStatus[1])?.count ?? 0
    const totalCanceledLeave = leaveStats.find(item => item._id === LeaveRequestStatus[2])?.count ?? 0

    return {
        earnedLeave: earnedLeaveRecode?.totalEarnedLeaves ?? 0,
        totalNewLeaves,
        totalApprovedLeaves,
        totalCanceledLeave,
    }

}

export const getDashboardService = async () => {

    const [
        totalEmployee,
        totalProject,
        recentEmployee,
        recentProjects
    ] = await Promise.all([

        Employee.countDocuments({ isActive: true }),
        Project.countDocuments({ isActive: true }),

        Employee.find({ isActive: true })
            .select("employeeId employeeName contactNo emailId deptId gender role createdDate -_id")
            .sort({ employeeId: -1 })
            .limit(5)
            .lean(),

        Project.find({ isActive: true })
            .select("projectId projectName clientName startDate leadByEmpId contactPerson contactNo emailId -_id")
            .sort({ projectId: -1 })
            .limit(5)
            .lean()

    ]);

    return {
        totalEmployee,
        totalProject,
        recentEmployee,
        recentProjects
    };
};