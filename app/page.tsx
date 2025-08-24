'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Recorder from '@/components/Recorder';
import ControlsPanel from '@/components/ControlsPanel';
import PianoRoll from '@/components/PianoRoll';
import Player from '@/components/Player';
import { AudioData, GenerationControls, GenerationResult, AppStep } from '@/lib/types';
import { generateMusicFromHumming } from '@/lib/api';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('record');
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
        return; // Don't trigger shortcuts when typing in inputs
      }

      switch (event.key.toLowerCase()) {
        case 'r':
          if (currentStep === 'record') {
            // This would be handled by the Recorder component
          }
          break;
        case ' ':
          event.preventDefault();
          if (generationResult) {
            setIsPlaying(!isPlaying);
          }
          break;
        case 'e':
          if (generationResult && generationResult.midiData) {
            downloadMIDI();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, generationResult, isPlaying]);

  const downloadMIDI = () => {
    if (!generationResult?.midiData) return;
    
    const blob = new Blob([generationResult.midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hummello-generated.mid';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAudioReady = (audio: AudioData) => {
    setAudioData(audio);
    setCurrentStep('controls');
  };

  const handleGenerate = async (controls: GenerationControls) => {
    if (!audioData) return;
    
    setIsGenerating(true);
    try {
      const result = await generateMusicFromHumming(audioData, controls);
      setGenerationResult(result);
      setCurrentStep('results');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const goToStep = (step: AppStep) => {
    setCurrentStep(step);
  };

  const canGoToStep = (step: AppStep): boolean => {
    switch (step) {
      case 'record':
        return true;
      case 'controls':
        return audioData !== null;
      case 'results':
        return generationResult !== null;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: 'record', label: 'Record', number: 1 },
              { key: 'controls', label: 'Controls', number: 2 },
              { key: 'results', label: 'Results', number: 3 }
            ].map(({ key, label, number }, index) => (
              <div key={key} className="flex items-center">
                <button
                  onClick={() => canGoToStep(key as AppStep) && goToStep(key as AppStep)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep === key
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : canGoToStep(key as AppStep)
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer'
                      : 'border-gray-600 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!canGoToStep(key as AppStep)}
                >
                  {number}
                </button>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === key ? 'text-white' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                {index < 2 && <ChevronRight className="w-4 h-4 text-gray-600 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'record' && (
            <Recorder onAudioReady={handleAudioReady} audioData={audioData} />
          )}

          {currentStep === 'controls' && (
            <ControlsPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
          )}

          {currentStep === 'results' && generationResult && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Generated Music</h2>
                <p className="text-gray-400">Your AI-generated composition is ready!</p>
              </div>

              <Player result={generationResult} />
              <PianoRoll 
                notes={generationResult.notes}
                isPlaying={isPlaying}
                currentTime={playbackTime}
              />
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-12 max-w-4xl mx-auto">
          <Button
            onClick={() => {
              if (currentStep === 'controls') setCurrentStep('record');
              if (currentStep === 'results') setCurrentStep('controls');
            }}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={currentStep === 'record'}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep !== 'results' && (
            <Button
              onClick={() => {
                if (currentStep === 'record' && audioData) setCurrentStep('controls');
                if (currentStep === 'controls') {
                  // Generate button is in the controls panel
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                (currentStep === 'record' && !audioData) ||
                (currentStep === 'controls' && isGenerating)
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Keyboard shortcuts */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-gray-800/30 rounded-lg px-6 py-3">
            <div className="text-sm text-gray-400">
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs mr-2">R</span>
              Record
            </div>
            <div className="text-sm text-gray-400">
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs mr-2">Space</span>
              Play/Pause
            </div>
            <div className="text-sm text-gray-400">
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs mr-2">E</span>
              Export MIDI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}