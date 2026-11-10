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

export type CreateProjectInput = z.infer<typeof createProjectValidation>