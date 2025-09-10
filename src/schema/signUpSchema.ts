import {z} from 'zod';

export const signInSchema = z.object({
    name: z.string()
        .min(3, {message: "Name must be at least 3 characters long"})
        .max(20, {message: "Name must be at most 20 characters long"})
        .regex(/^[a-zA-Z0-9_]+$/, {message: "Name can only contain letters, numbers, and underscores"}),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(3, {message: "Password must be at least 3 characters long"}),
});

export type SignInInput = z.infer<typeof signInSchema>;