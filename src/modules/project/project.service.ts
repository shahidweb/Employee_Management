import { APIError } from "../../utils/APIError";
import { Employee } from "../employee/employee.model";
import { Project } from "./project.model";
import type { CreateProjectInput } from "./project.validation";
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