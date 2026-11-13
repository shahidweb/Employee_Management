import z from "zod";

export const createDepartmentValidation = z.object({
    departmentName: z.string().trim().min(2).max(100),
    departmentLogo: z.string().trim().min(1)
}).strict();

export const updateDepartmentValidation = z.object({
    departmentName: z.string().trim().min(2).max(100).optional(),
    departmentLogo: z.string().trim().min(1).optional()
}).strict().refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" })

export const createBulkDepartmentValidation = z
    .array(createDepartmentValidation)
    .min(1, "At least one department is required")
    .max(100, "Maximum 100 department allowed")


export type CreateDepartmentInput = z.infer<typeof createDepartmentValidation>
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentValidation>