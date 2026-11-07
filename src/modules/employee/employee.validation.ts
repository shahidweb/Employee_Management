import z from "zod";

export const createEmployeeSchema = z.object({
    employeeName: z.string().min(3).max(100),
    contactNo: z.string().min(10).max(15),
    emailId: z.email("valid email address is required"),
    deptId: z.number().int().positive(),
    password: z.string().min(6),
    gender: z.enum(["Male", "Female", "Other"]),
    role: z.enum(["Admin", "HR", "Employee"])
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;