import { APIError } from "../../utils/APIError";
import { Employee } from "../employee/employee.model";
import { Project } from "./project.model";
import type { CreateProjectInput, UpdateProjectInput } from "./project.validation";
import { ProjectCounter } from "./projectCounter.model";


export const createProjectService = async (data: CreateProjectInput) => {
    const employee = await Employee.findOne({
        employeeId: data.leadByEmpId, isActive: true
    });

    if (!employee) {
        throw new APIError(404, "Project lead employee not found")
    }
    const counter = await ProjectCounter.findOneAndUpdate(
        { _id: "projectId" },
        { $inc: { sequence: 1 } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )

    if (!counter) {
        throw new APIError(500, "Unable to generate project ID")
    }

    const project = await Project.create({
        ...data,
        projectId: counter.sequence,
        emailId: data.emailId.toLowerCase()
    })
    return project;
}

export const getAllProjectService = async () => {
    const projects = await Project.aggregate([
        {
            $lookup: {
                from: "employees",
                localField: "LeadByEmpId",
                foreignField: "employeeId",
                as: "leadEmployee"
            }
        },
        {
            $unwind: {
                path: "$leadEmployee",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                projectId: 1,
                projectName: 1,
                clientName: 1,
                startDate: 1,
                leadByEmpId: 1,
                contactPerson: 1,
                contactNo: 1,
                emailId: 1,
                isActive: true,
                employeeName: {
                    $ifNull: ["$leadEmployee.employeeName", ""]
                }
            }
        },
        {
            $sort: {
                projectId: 1
            }
        }
    ]);
    return projects;
}

export const getProjectByIdService = async (projectId: number) => {
    // match  mean find data, where prodect id is same
    // lookup mean data  employee with project like join in sql 
    // unwind mean data convert array to object 
    // project mean select field for return response (1 mean include the field and 0 mean exlcude the field from response)
    const projects = await Project.aggregate([
        {
            $match: {
                projectId: projectId
            }
        },
        {
            $lookup: {
                from: "employees",
                localField: "leadByEmpId",
                foreignField: "employeeId",
                as: "leadEmployee"
            }
        },
        {
            $unwind: {
                path: "$leadEmployee",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                projectId: 1,
                projectName: 1,
                clientName: 1,
                startDate: 1,
                leadByEmpId: 1,
                contactPerson: 1,
                contactNo: 1,
                emailId: 1,
                employeeName: {
                    $ifNull: [
                        "$leadEmployee.employeeName",
                        ""
                    ]
                }
            }
        }
    ]);
    if (!projects.length) {
        throw new APIError(404, "Project not found");
    }

    return projects[0];
}

export const updateProjectService = async (projectId: number, data: UpdateProjectInput) => {
    const project = await Project.findOne({ projectId, isActive: true });
    if (!project) {
        throw new APIError(404, "Project not found");
    }
    if (data.leadByEmpId !== undefined) {
        const employee = await Employee.findOne({ employeeId: data.leadByEmpId, isActive: true });

        if (!employee) {
            throw new APIError(404, "Project lead employee not found");
        }
    }
    const updateData = {
        ...data,
        ...(data.emailId && { emailId: data.emailId.toLowerCase() })
    };

    Object.assign(project, updateData);
    await project.save();
    return project;
}

export const deleteProjectService = async (projectId: number) => {
    const project = await Project.findOne({ projectId, isActive: true });
    if (!project) {
        throw new APIError(404, "Project not found");
    }
    project.isActive = false;
    await project.save();

    return {
        projectId: project.projectId,
        projectName: project.projectName,
        isActive: project.isActive
    };
};