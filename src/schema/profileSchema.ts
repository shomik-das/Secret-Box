import {z} from 'zod';

export const profileSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name must be at most 20 characters"),
    username: z.string()
        .min(3, {message: "Username must be at least 3 characters long"})
        .max(20, {message: "Username must be at most 20 characters long"})
        .regex(/^[a-zA-Z0-9_]+$/, {message: "Name can only contain letters, numbers, and underscores"}),
    email: z.string().email({message: "Invalid email address"}),
    headline: z.string().optional(),
    question: z.string().optional(),
    image: z.string().url("Invalid image URL").optional(),
});