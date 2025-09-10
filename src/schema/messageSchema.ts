import {z} from 'zod';

export const messageSchema = z.object({
    message: z.string()
            .min(10, {message: "Message must be at least 10 characters long"})
            .max(200, {message: "Message must be at most 200 characters long"})
});
