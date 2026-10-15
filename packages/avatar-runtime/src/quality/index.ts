export type QualityTier = 'high' | 'medium' | 'low' | 'battery_saver';

export interface QualityProfile {
  tier: QualityTier;
  maxFps: number;
  enableAntiAliasing: boolean;
  shadowMapSize: number;
}
