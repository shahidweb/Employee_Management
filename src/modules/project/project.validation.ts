import z from "zod";

export const createProjectValidation = z.object({
  projectName: z.string().trim().min(3).max(150),
  clientName: z.string().trim().min(3).max(100),
  startDate: z.coerce.date(),
  leadByEmpId: z.number().int().positive(),
  contactPerson: z.string().trim().min(3).max(100),
  contactNo: z.string().regex(/^[0-9]{10,15}$/, "Contact number must contain 10-15 digits"),
  emailId: z.email().max(100),
}).strict();


export const updateProjectValidation = z.object({
  projectName: z.string().trim().min(3).max(150).optional(),
  clientName: z.string().trim().min(2).max(150).optional(),
  startDate: z.coerce.date().optional(),
  leadByEmpId: z.number().int().positive().optional(),
  contactPerson: z.string().trim().min(2).max(100).optional(),
  contactNo: z.string().regex(/^[0-9]{10,15}$/, "Contact number must contain 10-15 digits").optional(),
  emailId: z.email().max(150).optional()
})
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required"
    }
  );

export type UpdateProjectInput = z.infer<typeof updateProjectValidation>;
export type CreateProjectInput = z.infer<typeof createProjectValidation>