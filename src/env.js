import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    AUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_BUCKET_NAME: z.string(),
    AWS_REGION: z.string(),
    AWS_SECRET: z.string()
  },
  client: {},
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_ID,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_SECRET: process.env.AWS_SECRET
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true
})
