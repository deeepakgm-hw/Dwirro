export interface AvatarConfig {
  modelUrl: string;
  enableShadows?: boolean;
  fpsLimit?: number;
  autoBlink?: boolean;
}

export type AvatarState = 'unloaded' | 'loading' | 'ready' | 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
