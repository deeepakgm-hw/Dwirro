import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters'),
  GOOGLE_CLIENT_ID: z.string().default('placeholder-client-id'),
  GOOGLE_CLIENT_SECRET: z.string().default('placeholder-client-secret'),
  GOOGLE_REDIRECT_URI: z.string().default('http://localhost:3000/modules/auth/google/callback'),
  LLM_PROVIDER: z.string().default('openai'),
  LLM_API_KEY: z.string().default('placeholder-llm-key'),
  STT_PROVIDER: z.string().default('whisper'),
  TTS_PROVIDER: z.string().default('elevenlabs'),
  FCM_SERVER_KEY: z.string().default('placeholder-fcm-key'),
  SMS_PROVIDER_KEY: z.string().default('placeholder-sms-key'),
  TELECOM_PROVIDER_KEY: z.string().default('placeholder-telecom-key'),
  STUN_URL: z.string().default('stun:stun.l.google.com:19302'),
  TURN_URL: z.string().default('turn:localhost:3478'),
  TURN_USER: z.string().default('turnuser'),
  TURN_PASSWORD: z.string().default('turnpassword'),
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
