import z from "zod";

export const createLeaveTypeValidation = z.object({
    typeName: z.string().trim().min(2, "Leave type name is required").max(100, "Leave type name is too long")
}).strict()


export type CreateLeaveTypeInput = z.infer<typeof createLeaveTypeValidation>