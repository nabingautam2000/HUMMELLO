'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Upload, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioRecorder, processAudioFile } from '@/lib/audio-utils';
import { AudioData, RecordingState } from '@/lib/types';

interface RecorderProps {
  onAudioReady: (audio: AudioData) => void;
  audioData: AudioData | null;
}

export default function Recorder({ onAudioReady, audioData }: RecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    error: undefined
  });
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (recordingState.isRecording) {
      const interval = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [recordingState.isRecording]);

  useEffect(() => {
    drawWaveform();
  }, [audioData]);

  const startRecording = async () => {
    try {
      recorderRef.current = new AudioRecorder();
      await recorderRef.current.startRecording();
      setRecordingState({
        isRecording: true,
        isPaused: false,
        duration: 0,
        error: undefined
      });
    } catch (error) {
      setRecordingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Recording failed'
      }));
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    
    try {
      const audioBlob = await recorderRef.current.stopRecording();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const audioData: AudioData = {
        blob: audioBlob,
        url: URL.createObjectURL(audioBlob),
        duration: audioBuffer.duration,
        waveform: generateWaveform(audioBuffer)
      };
      
      onAudioReady(audioData);
      setRecordingState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        error: undefined
      });
    } catch (error) {
      setRecordingState(prev => ({
        ...prev,
        error: 'Failed to process recording'
      }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const audioData = await processAudioFile(file);
      onAudioReady(audioData);
    } catch (error) {
      setRecordingState(prev => ({
        ...prev,
        error: 'Failed to process audio file'
      }));
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioData) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const generateWaveform = (audioBuffer: AudioBuffer): number[] => {
    const channelData = audioBuffer.getChannelData(0);
    const samples = 200;
    const blockSize = Math.floor(channelData.length / samples);
    const waveform = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j] || 0);
      }
      waveform.push(sum / blockSize);
    }

    return waveform;
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !audioData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = '#3b82f6';
    const barWidth = width / audioData.waveform.length;
    
    audioData.waveform.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Record or Upload Your Humming</h2>
        <p className="text-gray-400">Start by capturing your musical idea</p>
      </div>

      {recordingState.error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-200">
          {recordingState.error}
        </div>
      )}

      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center space-x-4 mb-6">
          {!recordingState.isRecording ? (
            <>
              <Button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                size="lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3"
                size="lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Audio
              </Button>
            </>
          ) : (
            <Button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
              size="lg"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop Recording ({formatDuration(recordingState.duration)})
            </Button>
          )}
        </div>

        {audioData && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">
                  Duration: {formatDuration(Math.floor(audioData.duration))}
                </span>
                <Button
                  onClick={togglePlayback}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              <canvas
                ref={canvasRef}
                width={600}
                height={100}
                className="w-full h-20 bg-gray-800 rounded border border-gray-600"
              />
            </div>
            <audio
              ref={audioRef}
              src={audioData.url}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}