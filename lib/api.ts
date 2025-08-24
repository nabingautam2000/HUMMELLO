import { GenerationControls, GenerationResult, AudioData } from './types';
import { generateMockNotes, exportToMIDI } from './music-utils';

// Mock API functions - replace with real backend calls later
export async function generateMusicFromHumming(
  audioData: AudioData,
  controls: GenerationControls
): Promise<GenerationResult> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock generation
  const notes = generateMockNotes(controls);
  const midiData = exportToMIDI(notes);
  
  return {
    notes,
    midiData,
    audioUrl: audioData.url // In real app, this would be generated audio
  };
}

export async function uploadAudio(audioData: AudioData): Promise<string> {
  // Mock upload - in real app would upload to server
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'mock-audio-id';
}