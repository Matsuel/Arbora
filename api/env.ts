import { z } from 'zod';

const envSchema = z.object({
    PORT: z.number().default(3000),
    SUPABASE_URL: z.url(),
    SUPABASE_KEY: z.string(),
    LOGO_DEV_TOKEN: z.string().optional(),
    HOST: z.string().default('localhost'),
});

const _env = envSchema.parse(process.env);

export const env = _env;