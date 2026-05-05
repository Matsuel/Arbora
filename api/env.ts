import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(3000)
});

const _env = envSchema.parse(process.env);

export const env = _env;