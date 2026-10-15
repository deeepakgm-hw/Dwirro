import { CharacterExpression, CharacterGesture, CueToken, EmotionVector } from './vocab.js';

export type CharacterEventType =
  | 'turn:start'
  | 'turn:end'
  | 'turn:barge_in'
  | 'cue:expression'
  | 'cue:gesture'
  | 'audio:chunk'
  | 'transcript:delta'
  | 'transcript:complete';

export interface BaseProtocolEvent {
  id: string;
  timestamp: number;
  type: CharacterEventType;
  sessionId: string;
}

export interface TurnEvent extends BaseProtocolEvent {
  type: 'turn:start' | 'turn:end' | 'turn:barge_in';
  turnId: string;
  actor: 'user' | 'assistant';
}

export interface CueExpressionEvent extends BaseProtocolEvent {
  type: 'cue:expression';
  expression: CharacterExpression;
  intensity: number;
  emotion?: EmotionVector;
}

export interface CueGestureEvent extends BaseProtocolEvent {
  type: 'cue:gesture';
  gesture: CharacterGesture;
  durationMs: number;
}

export interface TranscriptDeltaEvent extends BaseProtocolEvent {
  type: 'transcript:delta';
  turnId: string;
  delta: string;
  cues?: CueToken[];
}

export interface TranscriptCompleteEvent extends BaseProtocolEvent {
  type: 'transcript:complete';
  turnId: string;
  fullText: string;
  cleanText: string;
}

export interface AudioChunkEvent extends BaseProtocolEvent {
  type: 'audio:chunk';
  turnId: string;
  sequenceNumber: number;
  dataBase64: string;
  sampleRate: number;
  isFinal: boolean;
}

export type CharacterProtocolMessage =
  | TurnEvent
  | CueExpressionEvent
  | CueGestureEvent
  | TranscriptDeltaEvent
  | TranscriptCompleteEvent
  | AudioChunkEvent;
