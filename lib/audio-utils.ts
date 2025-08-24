export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.start();
    } catch (error) {
      throw new Error('Failed to start recording. Please check microphone permissions.');
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

export function generateWaveform(audioBuffer: AudioBuffer): number[] {
  const channelData = audioBuffer.getChannelData(0);
  const samples = 200; // Number of waveform points
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
}

export async function processAudioFile(file: File): Promise<import('./types').AudioData> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const waveform = generateWaveform(audioBuffer);
  
  return {
    blob: new Blob([arrayBuffer], { type: file.type }),
    url: URL.createObjectURL(file),
    duration: audioBuffer.duration,
    waveform
  };
}