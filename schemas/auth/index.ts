import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Email is Invalid" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z.email({ error: "Email is Invalid" }),
  password: z.string().min(6, { error: "Password is required" }),
});
