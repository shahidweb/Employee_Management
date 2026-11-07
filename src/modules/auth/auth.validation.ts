import z from "zod";

export const loginSchema = z.object({
    username: z.email("valid email address is required"),
    password: z.string().min(6, "password must be at least 6 characters long")
})

export type LoginInput = z.infer<typeof loginSchema>