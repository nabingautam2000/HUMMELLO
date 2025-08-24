'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { GenerationResult } from '@/lib/types';

interface PlayerProps {
  result: GenerationResult;
}

export default function Player({ result }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (result.audioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
    }
  }, [result.audioUrl]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const interval = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleTimeSeek = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const downloadMIDI = () => {
    if (!result.midiData) return;
    
    const blob = new Blob([result.midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hummello-generated.mid';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Audio Player</h3>
        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <Slider
          value={[currentTime]}
          onValueChange={handleTimeSeek}
          max={duration}
          step={0.1}
          className="w-full"
        />
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          onClick={togglePlayback}
          disabled={!result.audioUrl}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={stopPlayback}
          disabled={!result.audioUrl}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          size="lg"
        >
          <Square className="h-5 w-5" />
        </Button>

        <Button
          onClick={downloadMIDI}
          disabled={!result.midiData}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          size="lg"
        >
          <Download className="h-5 w-5 mr-2" />
          Download MIDI
        </Button>
      </div>

      {/* Audio element */}
      {result.audioUrl && (
        <audio
          ref={audioRef}
          src={result.audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        Generated {result.notes.length} notes • Ready for export
      </div>
    </div>
  );
}