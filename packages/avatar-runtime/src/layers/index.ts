export interface AnimationLayer {
  name: string;
  weight: number;
  active: boolean;
}

export type StandardLayerName = 'base_idle' | 'gesture' | 'expression' | 'look_at' | 'lip_sync';
