import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email({ message: "Invalid email address" })
});

export const signInSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(3),
});


export const signUpSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(3),
  confirm: z.string().min(3),
})
.refine((data) => data.password === data.confirm, {
  message: "Password doesn't match",
});

export const createRoomSchema = z.object({
  slug: z.string().min(3).max(20),  
})