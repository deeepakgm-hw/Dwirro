import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().default(''),
  REDIS_URL: z.string().default(''),
  JWT_SECRET: z.string().default(''),
  JWT_REFRESH_SECRET: z.string().default(''),
  ENCRYPTION_KEY: z.string().default(''),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  GOOGLE_REDIRECT_URI: z.string().default(''),
  LLM_PROVIDER: z.string().default('openai'),
  LLM_API_KEY: z.string().default(''),
  STT_PROVIDER: z.string().default('whisper'),
  TTS_PROVIDER: z.string().default('elevenlabs'),
  FCM_SERVER_KEY: z.string().default(''),
  SMS_PROVIDER_KEY: z.string().default(''),
  TELECOM_PROVIDER_KEY: z.string().default(''),
  STUN_URL: z.string().default(''),
  TURN_URL: z.string().default(''),
  TURN_USER: z.string().default(''),
  TURN_PASSWORD: z.string().default(''),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('CRITICAL: Environment validation failed fast:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
export type EnvConfig = z.infer<typeof envSchema>;
