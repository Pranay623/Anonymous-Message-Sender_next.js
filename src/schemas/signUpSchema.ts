import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2,"Username must be at least 2 characters long")
    .max(30,"Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain special characters")

export const signupSchema = z.object({
    usename: usernameValidation,
    email: z.string().email({message:"Invalid email"}),
    password: z.string().min(6,{message:"Password must be at least 6 characters long"}),

})