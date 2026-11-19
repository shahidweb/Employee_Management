import z from "zod";

export const createChildDepartmentValidation = z.object({
    parentDeptId: z.number().int().positive(),
    departmentName: z.string().trim().min(2).max(100)
}).strict()


export type CreateChildDepartmentInput = z.infer<typeof createChildDepartmentValidation>