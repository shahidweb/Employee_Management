import { APIError } from "../../utils/APIError";
import { Employee } from "../employee/employee.model";
import { Project } from "../project/project.model";
import { ProjectEmployee } from "./projectEmployee.model";
import type { createProjectEmployeeInput, updateProjectEmployeeInput } from "./projectEmployee.validation";
import { ProjectEmployeeCounter } from "./projectEmployeeCounter.model";



export const createProjectEmployeeService = async (data: createProjectEmployeeInput) => {
    const project = await Project.findOne({ projectId: data.projectId, isActive: true });
    if (!project) {
        throw new APIError(404, "Project is not found!")
    }

    const employee = await Employee.findOne({ employeeId: data.empId, isActive: true });
    if (!employee) {
        throw new APIError(404, "Employee not found!")
    }

    const existingProject = await ProjectEmployee.findOne({
        projectId: data.projectId,
        empId: data.empId,
        isActive: true
    })
    if (existingProject) {
        throw new APIError(409, "Employee is already assigned to this project")
    }

    const counter = await ProjectEmployeeCounter.findOneAndUpdate(
        { _id: "empProjectId" },
        { $inc: { sequence: 1 } },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
    )
    if (!counter) {
        throw new APIError(500, "Unable to generate assignment ID");
    }
    const projectEmployee = await ProjectEmployee.create({
        empProjectId: counter.sequence,
        ...data,
        isActive: true
    });

    return projectEmployee;
}

export const getAllProjectEmployeeService = async () => {
    const exisitingProject = await ProjectEmployee.aggregate([
        {
            $lookup: {
                from: 'projects',
                localField: "projectId",
                foreignField: "projectId",
                as: 'project',
            }
        },
        {
            $unwind: {
                path: "$project",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'employees',
                localField: 'empId',
                foreignField: 'employeeId',
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
            $project: {
                _id: 0,
                empProjectId: 1,
                projectId: 1,
                empId: 1,
                assignedDate: 1,
                role: 1,
                isActive: 1,
                projectName: {
                    $ifNull: ["$project.projectName", ""]
                },

                employeeName: {
                    $ifNull: ["$employee.employeeName", ""]
                }
            }
        },
        {
            $sort: {
                empProjectId: 1
            }
        }
    ])
    return exisitingProject;
}

export const getProjectEmployeeByIdService = async (empProjectId: number) => {
    const exisitingProject = await ProjectEmployee.aggregate([
        {
            $match: {
                empProjectId
            }
        },
        {
            $lookup: {
                from: 'projects',
                localField: "projectId",
                foreignField: "projectId",
                as: 'project',
            }
        },
        {
            $unwind: {
                path: "$project",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'employees',
                localField: 'empId',
                foreignField: 'employeeId',
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
            $project: {
                _id: 0,
                empProjectId: 1,
                projectId: 1,
                empId: 1,
                assignedDate: 1,
                role: 1,
                isActive: 1,
                projectName: {
                    $ifNull: ["$project.projectName", ""]
                },

                employeeName: {
                    $ifNull: ["$employee.employeeName", ""]
                }
            }
        }
    ])
    if (!exisitingProject.length) {
        throw new APIError(404, "Project employee assignment not found")
    }
    return exisitingProject[0];
}

export const updateProjectEmployeeByIdService = async (empProjectId: number, data: updateProjectEmployeeInput) => {

    const projectEmployee = await ProjectEmployee.findOne({ empProjectId, isActive: true });
    if (!projectEmployee) {
        throw new APIError(404, "Project Assignment is not found")
    }

    if (data.projectId !== undefined) {
        const project = await Project.findOne({ projectId: data.projectId, isActive: true });
        if (!project) {
            throw new APIError(404, "Project is not found!")
        }
    }
    if (data.empId !== undefined) {
        const employee = await Employee.findOne({ employeeId: data.empId, isActive: true });
        if (!employee) {
            throw new APIError(404, "Employee is not found!")
        }
    }

    const projectId = data.projectId ?? projectEmployee.projectId;
    const employeeId = data.empId ?? projectEmployee.empId;
    const isActive = data.isActive ?? projectEmployee.isActive;

    if (isActive) {
        const existingAssignment = await ProjectEmployee.findOne({
            projectId,
            employeeId,
            isActive,
            empProjectId: { $ne: empProjectId }
        });
        if (existingAssignment) {
            throw new APIError(409, "Employee is already assigned to this project");
        }
    }

    Object.assign(projectEmployee, data);
    await projectEmployee.save();
    return projectEmployee;
}

export const deleteProjectEmployeeByIdService = async (empProjectId: number) => {
    const existingAssignment = await ProjectEmployee.findOne({ empProjectId, isActive: true });
    if (!existingAssignment) {
        throw new APIError(404, "Project employee assignment not found")
    }
    existingAssignment.isActive = false;
    await existingAssignment.save();
    return existingAssignment;
}
