export interface AudioData {
  blob: Blob;
  url: string;
  duration: number;
  waveform: number[];
}

export interface GenerationControls {
  key: string;
  scale: 'major' | 'minor';
  tempo: number;
  quantization: '1/4' | '1/8' | '1/16';
  noteLength: number;
  sensitivity: number;
}

export interface GeneratedNote {
  pitch: number;
  start: number;
  duration: number;
  velocity: number;
}

export interface GenerationResult {
  notes: GeneratedNote[];
  audioUrl?: string;
  midiData?: Uint8Array;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  error?: string;
}

export type AppStep = 'record' | 'controls' | 'results';