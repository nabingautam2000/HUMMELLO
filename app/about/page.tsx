import { Music, Wand2, Download, Headphones } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Music className="h-12 w-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              HUMMELLO
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your musical ideas into beautiful compositions using the power of AI. 
            Simply hum your melody and let our advanced algorithms create professional-quality music.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Wand2 className="h-6 w-6 mr-3 text-blue-400" />
                AI-Powered Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                Our cutting-edge AI analyzes your humming patterns, pitch variations, and rhythm 
                to generate harmonically rich musical compositions that capture your original intent.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Music className="h-6 w-6 mr-3 text-purple-400" />
                Professional Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                Fine-tune your compositions with professional music production controls including 
                key selection, scale modes, tempo adjustment, and quantization settings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Headphones className="h-6 w-6 mr-3 text-green-400" />
                Real-time Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                Watch your music come to life with our interactive piano roll editor and 
                real-time waveform visualization. See every note and timing as it's generated.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Download className="h-6 w-6 mr-3 text-orange-400" />
                Export & Share
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>
                Export your creations as MIDI files for further editing in your favorite DAW, 
                or share audio versions directly with friends and collaborators.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Record Your Humming</h3>
                <p className="text-gray-300">
                  Use your device's microphone to record your musical ideas, or upload an existing audio file. 
                  Our waveform visualization shows your audio in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Configure Settings</h3>
                <p className="text-gray-300">
                  Choose your preferred musical key, scale, tempo, and other generation parameters. 
                  Adjust sensitivity and note length to match your creative vision.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Generate & Export</h3>
                <p className="text-gray-300">
                  Watch as AI transforms your humming into a complete musical composition. 
                  Preview in our piano roll editor and export as MIDI for further production.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-gray-800/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Technology</h2>
          <div className="text-center text-gray-300 space-y-4">
            <p>
              HUMMELLO leverages advanced machine learning algorithms trained on vast musical datasets 
              to understand pitch relationships, harmonic progressions, and rhythmic patterns.
            </p>
            <p>
              Built with modern web technologies including Next.js, TypeScript, and Web Audio APIs, 
              providing a seamless, responsive experience across all devices.
            </p>
            <p>
              All audio processing happens securely in your browser, ensuring your musical ideas 
              remain private while delivering professional-quality results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}