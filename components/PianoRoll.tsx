'use client';

import { useRef, useEffect, useState } from 'react';
import { GeneratedNote } from '@/lib/types';

interface PianoRollProps {
  notes: GeneratedNote[];
  isPlaying: boolean;
  currentTime: number;
}

const PIANO_KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_KEYS = [1, 3, 6, 8, 10];

export default function PianoRoll({ notes, isPlaying, currentTime }: PianoRollProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: 400 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    drawPianoRoll();
  }, [notes, currentTime, dimensions]);

  const drawPianoRoll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const keyboardWidth = 80;
    const rollWidth = dimensions.width - keyboardWidth;
    const keyHeight = 20;
    const numKeys = 48; // 4 octaves
    const baseOctave = 3;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Draw piano keyboard
    for (let i = 0; i < numKeys; i++) {
      const keyIndex = i % 12;
      const octave = Math.floor(i / 12) + baseOctave;
      const y = dimensions.height - (i + 1) * keyHeight;
      
      // Draw white keys
      if (WHITE_KEYS.includes(keyIndex)) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, y, keyboardWidth, keyHeight);
        ctx.strokeStyle = '#9ca3af';
        ctx.strokeRect(0, y, keyboardWidth, keyHeight);
        
        // Key label
        ctx.fillStyle = '#374151';
        ctx.font = '12px monospace';
        ctx.fillText(`${PIANO_KEYS[keyIndex]}${octave}`, 8, y + 14);
      } else {
        // Black keys
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, y, keyboardWidth * 0.6, keyHeight);
        ctx.strokeStyle = '#6b7280';
        ctx.strokeRect(0, y, keyboardWidth * 0.6, keyHeight);
        
        // Key label
        ctx.fillStyle = '#f3f4f6';
        ctx.font = '10px monospace';
        ctx.fillText(`${PIANO_KEYS[keyIndex]}${octave}`, 4, y + 13);
      }
    }

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= numKeys; i++) {
      const y = dimensions.height - i * keyHeight;
      ctx.beginPath();
      ctx.moveTo(keyboardWidth, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
    }

    // Vertical grid lines (beats)
    const beatsPerSecond = 2; // 120 BPM = 2 beats per second
    const pixelsPerSecond = rollWidth / 8; // Show 8 seconds
    for (let beat = 0; beat <= 16; beat++) {
      const x = keyboardWidth + (beat / beatsPerSecond) * pixelsPerSecond;
      if (x <= dimensions.width) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
    }

    // Draw notes
    notes.forEach(note => {
      const midiNote = note.pitch;
      const noteIndex = (midiNote - (baseOctave * 12)) % (numKeys);
      
      if (noteIndex >= 0 && noteIndex < numKeys) {
        const y = dimensions.height - (noteIndex + 1) * keyHeight + 2;
        const x = keyboardWidth + (note.start * pixelsPerSecond) + 2;
        const width = (note.duration * pixelsPerSecond) - 4;
        const height = keyHeight - 4;
        
        // Note color based on velocity
        const alpha = note.velocity / 127;
        const keyIndex = midiNote % 12;
        const isBlackKey = BLACK_KEYS.includes(keyIndex);
        
        if (isBlackKey) {
          ctx.fillStyle = `rgba(147, 51, 234, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        }
        
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = isBlackKey ? '#a855f7' : '#3b82f6';
        ctx.strokeRect(x, y, width, height);
      }
    });

    // Draw playhead
    if (isPlaying && currentTime >= 0) {
      const playheadX = keyboardWidth + (currentTime * pixelsPerSecond);
      if (playheadX >= keyboardWidth && playheadX <= dimensions.width) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, dimensions.height);
        ctx.stroke();
      }
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Piano Roll</h3>
        <p className="text-sm text-gray-400">
          Generated notes visualization • {notes.length} notes
        </p>
      </div>
      
      <div className="bg-gray-900 rounded border border-gray-600 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ display: 'block' }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Piano keys on left • Time flows left to right • Blue notes = white keys • Purple notes = black keys
      </div>
    </div>
  );
}