import z from "zod";

export const LeaveRequestValidation = z.object({
    employeeId: z.number().int().positive(),
    leaveTypeId: z.number().int().positive(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.literal("Pending").optional(),
    reason: z.string().trim().optional(),
    requestDate: z.coerce.date().optional()
}).strict().refine((data) => data.startDate <= data.endDate,
    { message: "Start date cannot be greator then end date", path: ['endDate'] })

export type LeaveRequestValidationInput = z.infer<typeof LeaveRequestValidation>



export const changeLeaveStatusValidation = z.object({
    status: z.enum(["Pending", "Approved", "Rejected"])
}).strict();

export type ChangeLeaveStatusInput = z.infer<typeof changeLeaveStatusValidation>;
