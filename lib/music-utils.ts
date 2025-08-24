export const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const SCALES = ['major', 'minor'] as const;
export const QUANTIZATIONS = ['1/4', '1/8', '1/16'] as const;

export function generateMockNotes(controls: import('./types').GenerationControls): import('./types').GeneratedNote[] {
  // Mock generation - in real app this would call the AI backend
  const notes: import('./types').GeneratedNote[] = [];
  const baseTime = 0;
  const noteDuration = (60 / controls.tempo) * (parseFloat(controls.quantization.split('/')[1]) / 4);
  
  // Generate a simple melody pattern
  const pattern = [60, 62, 64, 65, 67, 65, 64, 62]; // C major scale pattern
  const keyOffset = KEYS.indexOf(controls.key);
  
  pattern.forEach((basePitch, index) => {
    const adjustedPitch = basePitch + keyOffset + (controls.scale === 'minor' ? -3 : 0);
    notes.push({
      pitch: adjustedPitch,
      start: baseTime + (index * noteDuration),
      duration: noteDuration * (controls.noteLength / 100),
      velocity: Math.floor(64 + (controls.sensitivity * 63 / 100))
    });
  });
  
  return notes;
}

export function exportToMIDI(notes: import('./types').GeneratedNote[]): Uint8Array {
  // Simple MIDI export - in real app would use proper MIDI library
  // This is a mock implementation
  const midiData = new Uint8Array([
    0x4D, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Header length
    0x00, 0x00, // Format 0
    0x00, 0x01, // 1 track
    0x00, 0x60  // 96 ticks per quarter note
  ]);
  
  return midiData;
}