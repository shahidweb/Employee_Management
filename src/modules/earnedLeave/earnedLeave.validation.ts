import z from "zod";


export const createEarnedLeaveValidation = z.object({
    employeeId: z.number().int().positive(),
    totalEarnedLeaves: z.number().int().positive(),
    totalSickEarnedLeaves: z.number().int().positive(),
    lastUpdatedDate: z.coerce.date()
}).strict();

export type CreateEarnedLeaveInput = z.infer<typeof createEarnedLeaveValidation>