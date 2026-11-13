import z from "zod";


export const createProjectEmployeeValidation = z.object({
    projectId: z.number().int().positive(),
    empId: z.number().int().positive(),
    assignedDate: z.coerce.date(),
    role: z.string().trim().min(2).max(100),
}).strict()


export const updateProjectEmployeeValidation = z.object({
    projectId: z.number().int().positive().optional(),
    empId: z.number().int().positive().optional(),
    assignedDate: z.coerce.date().optional(),
    role: z.string().trim().min(2).max(100).optional(),
    isActive: z.boolean().optional()
}).strict().refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" })



export type createProjectEmployeeInput = z.infer<typeof createProjectEmployeeValidation>
export type updateProjectEmployeeInput = z.infer<typeof updateProjectEmployeeValidation>

