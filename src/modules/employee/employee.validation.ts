import z from "zod";

export const createEmployeeSchema = z.object({
    employeeName: z.string().min(3).max(100),
    contactNo: z.string().min(10).max(15),
    emailId: z.email("valid email address is required"),
    deptId: z.number().int().positive(),
    password: z.string().min(6),
    isActive: z.boolean(),
    gender: z.enum(["Male", "Female", "Other"]),
    role: z.enum(["Admin", "HR", "Employee"])
});

export type CreateEmployeesInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
    employeeName: z.string().min(3).max(100).optional(),
    contactNo: z.string().min(10).max(15).optional(),
    emailId: z.string().email().optional(),
    deptId: z.number().int().positive().optional(),
    password: z.string().min(8).optional(),
    isActive: z.boolean().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    role: z.enum(["Admin", "HR", "Employee"]).optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;