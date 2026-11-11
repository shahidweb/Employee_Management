import { APIError } from "../../utils/APIError";
import { Employee } from "../employee/employee.model";
import { Project } from "../project/project.model";
import { ProjectEmployee } from "./projectEmployee.model";
import type { createProjectEmployeeInput } from "./projectEmployee.validation";
import { ProjectEmployeeCounter } from "./projectEmployeeCounter.model";



export const createProjectEmployeeService = async (data: createProjectEmployeeInput) => {
    const project = await Project.findOne({ projectId: data.projectId, isActive: true });
    if (!project) {
        throw new APIError(404, "Project not found!")
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