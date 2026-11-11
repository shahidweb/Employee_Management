import z from "zod";


export const createProjectEmployeeValidation = z.object({
    projectId: z.number().int().positive(),
    empId: z.number().int().positive(),
    assignedDate: z.coerce.date(),
    role: z.string().trim().min(2).max(100),
}).strict()

export type createProjectEmployeeInput = z.infer<typeof createProjectEmployeeValidation>