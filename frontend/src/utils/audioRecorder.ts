export class AudioRecorderManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private recognition: any = null;
  private animationFrameId: number | null = null;

  public isRecording = false;
  public transcript = '';

  // Khởi tạo thu âm & Speech Recognition
  async startRecording(
    onTranscriptUpdate: (text: string) => void,
    onVisualizerDraw?: (dataArray: Uint8Array) => void
  ): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      this.transcript = '';

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      // Audio Visualizer Spectrum Setup
      if (onVisualizerDraw) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          if (!this.isRecording) return;
          this.analyser?.getByteFrequencyData(dataArray);
          onVisualizerDraw(dataArray);
          this.animationFrameId = requestAnimationFrame(draw);
        };
        draw();
      }

      // Web Speech API (Realtime STT)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          this.transcript = currentTranscript.trim();
          onTranscriptUpdate(this.transcript);
        };

        this.recognition.onerror = (e: any) => {
          console.warn('Speech recognition error:', e.error);
        };

        this.recognition.start();
      }

      return true;
    } catch (err) {
      console.error('Không thể truy cập Microphone:', err);
      return false;
    }
  }

  // Dừng thu âm và trả về Audio Blob URL + Transcript
  async stopRecording(): Promise<{ audioUrl: string; audioBlob: Blob; transcript: string }> {
    return new Promise((resolve) => {
      this.isRecording = false;

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {
          console.warn('Speech recognition stop warning:', e);
        }
      }

      if (!this.mediaRecorder) {
        resolve({
          audioUrl: '',
          audioBlob: new Blob(),
          transcript: this.transcript
        });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Clean up tracks
        this.stream?.getTracks().forEach((track) => track.stop());
        if (this.audioContext && this.audioContext.state !== 'closed') {
          this.audioContext.close();
        }

        resolve({
          audioUrl,
          audioBlob,
          transcript: this.transcript
        });
      };

      this.mediaRecorder.stop();
    });
  }
}
