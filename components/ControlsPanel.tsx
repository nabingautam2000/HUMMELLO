'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import { GenerationControls } from '@/lib/types';
import { KEYS, SCALES, QUANTIZATIONS } from '@/lib/music-utils';

interface ControlsPanelProps {
  onGenerate: (controls: GenerationControls) => void;
  isGenerating: boolean;
}

export default function ControlsPanel({ onGenerate, isGenerating }: ControlsPanelProps) {
  const [controls, setControls] = useState<GenerationControls>({
    key: 'C',
    scale: 'major',
    tempo: 120,
    quantization: '1/8',
    noteLength: 80,
    sensitivity: 50
  });

  const updateControl = <K extends keyof GenerationControls>(
    key: K,
    value: GenerationControls[K]
  ) => {
    setControls(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    onGenerate(controls);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Configure Music Generation</h2>
        <p className="text-gray-400">Fine-tune the parameters for your AI-generated music</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Musical Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Key</label>
                <Select value={controls.key} onValueChange={(value) => updateControl('key', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-600">
                    {KEYS.map(key => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Scale</label>
                <Select value={controls.scale} onValueChange={(value: 'major' | 'minor') => updateControl('scale', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-600">
                    {SCALES.map(scale => (
                      <SelectItem key={scale} value={scale} className="text-white hover:bg-gray-700 capitalize">
                        {scale}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Tempo: {controls.tempo} BPM
              </label>
              <Slider
                value={[controls.tempo]}
                onValueChange={(value) => updateControl('tempo', value[0])}
                min={60}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Quantization</label>
              <Select value={controls.quantization} onValueChange={(value: any) => updateControl('quantization', value)}>
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  {QUANTIZATIONS.map(quant => (
                    <SelectItem key={quant} value={quant} className="text-white hover:bg-gray-700">
                      {quant} Note
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Generation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Note Length: {controls.noteLength}%
              </label>
              <Slider
                value={[controls.noteLength]}
                onValueChange={(value) => updateControl('noteLength', value[0])}
                min={25}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                How much of each beat the notes should occupy
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Sensitivity: {controls.sensitivity}%
              </label>
              <Slider
                value={[controls.sensitivity]}
                onValueChange={(value) => updateControl('sensitivity', value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                How responsive the AI should be to subtle pitch changes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5 mr-2" />
              Generate Music
            </>
          )}
        </Button>
      </div>
    </div>
  );
}