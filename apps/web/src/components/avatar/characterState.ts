/**
 * Dwirro Character Protocol & State Adapter
 * Represents the emotional and behavioral state of the 3D avatar.
 */

export type DwirroState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'surprised'
  | 'away';

export interface DwirroExpression {
  state: DwirroState;
  eyeScaleX: number;
  eyeScaleY: number;
  eyeRotation: number;
  eyeOffsetY: number;
  glowIntensity: number;
  headTiltX: number;
  headTiltY: number;
  headTiltZ: number;
  bodyBobSpeed: number;
  bodyBobAmp: number;
}

export const STATE_EXPRESSIONS: Record<DwirroState, DwirroExpression> = {
  idle: {
    state: 'idle',
    eyeScaleX: 1.0,
    eyeScaleY: 1.0,
    eyeRotation: 0,
    eyeOffsetY: 0,
    glowIntensity: 2.2,
    headTiltX: 0,
    headTiltY: 0,
    headTiltZ: 0,
    bodyBobSpeed: 2.0,
    bodyBobAmp: 0.015,
  },
  listening: {
    state: 'listening',
    eyeScaleX: 1.05,
    eyeScaleY: 1.05,
    eyeRotation: 0,
    eyeOffsetY: 0.01,
    glowIntensity: 3.2,
    headTiltX: 0.08, // leaning attentively forward
    headTiltY: 0,
    headTiltZ: 0,
    bodyBobSpeed: 3.0,
    bodyBobAmp: 0.01,
  },
  thinking: {
    state: 'thinking',
    eyeScaleX: 0.95,
    eyeScaleY: 0.85,
    eyeRotation: -0.05,
    eyeOffsetY: 0.02,
    glowIntensity: 2.8,
    headTiltX: -0.06, // looking slightly up & tilted
    headTiltY: 0.08,
    headTiltZ: -0.07,
    bodyBobSpeed: 1.2,
    bodyBobAmp: 0.008,
  },
  speaking: {
    state: 'speaking',
    eyeScaleX: 1.0,
    eyeScaleY: 0.95,
    eyeRotation: 0,
    eyeOffsetY: 0,
    glowIntensity: 3.5,
    headTiltX: 0.04,
    headTiltY: 0,
    headTiltZ: 0,
    bodyBobSpeed: 7.5, // animated speaking cadence
    bodyBobAmp: 0.025,
  },
  happy: {
    state: 'happy',
    eyeScaleX: 1.15,
    eyeScaleY: 0.7, // cheerful squint
    eyeRotation: 0.08,
    eyeOffsetY: 0.01,
    glowIntensity: 3.8,
    headTiltX: -0.02,
    headTiltY: 0,
    headTiltZ: 0.04,
    bodyBobSpeed: 6.0,
    bodyBobAmp: 0.035,
  },
  surprised: {
    state: 'surprised',
    eyeScaleX: 1.25,
    eyeScaleY: 1.25, // wide eyes
    eyeRotation: 0,
    eyeOffsetY: 0.025,
    glowIntensity: 4.2,
    headTiltX: -0.08,
    headTiltY: 0,
    headTiltZ: 0,
    bodyBobSpeed: 1.0,
    bodyBobAmp: 0.005,
  },
  away: {
    state: 'away',
    eyeScaleX: 0.9,
    eyeScaleY: 0.4, // sleepy / dimmed
    eyeRotation: 0,
    eyeOffsetY: -0.02,
    glowIntensity: 1.0,
    headTiltX: 0.12, // head drooping down
    headTiltY: 0,
    headTiltZ: 0.03,
    bodyBobSpeed: 1.0,
    bodyBobAmp: 0.006,
  },
};
