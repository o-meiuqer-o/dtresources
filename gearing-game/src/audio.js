class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmOsc1 = null;
    this.bgmOsc2 = null;
    this.bgmGain = null;
    this.motorOsc = null;
    this.motorGain = null;
    this.isMuted = false;
    this.isPlayingBGM = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.5, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  playGrab() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSnap() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    // Metallic clack
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'square';
    osc2.type = 'triangle';
    
    osc1.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);
    
    osc2.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.15);
    osc2.stop(this.ctx.currentTime + 0.15);
  }

  playDrop() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playSuccess() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    // C Major Arpeggio: C4, E4, G4, C5
    const freqs = [261.63, 329.63, 392.00, 523.25];
    const now = this.ctx.currentTime;
    
    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  startMotor() {
    if (!this.ctx) this.init();
    if (this.motorOsc || this.isMuted) return;
    this.resume();
    
    this.motorOsc = this.ctx.createOscillator();
    this.motorGain = this.ctx.createGain();
    
    this.motorOsc.type = 'sawtooth';
    this.motorOsc.frequency.value = 40; // Low rumble
    
    this.motorGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.motorGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.5); // Very quiet
    
    this.motorOsc.connect(this.motorGain);
    this.motorGain.connect(this.masterGain);
    
    this.motorOsc.start();
  }

  stopMotor() {
    if (this.motorOsc && this.motorGain) {
      this.motorGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
      this.motorOsc.stop(this.ctx.currentTime + 0.3);
      this.motorOsc = null;
      this.motorGain = null;
    }
  }

  startBGM() {
    if (!this.ctx) this.init();
    if (this.isPlayingBGM || this.isMuted) return;
    this.resume();
    this.isPlayingBGM = true;

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.bgmGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2); // Fade in

    this.bgmOsc1 = this.ctx.createOscillator();
    this.bgmOsc1.type = 'sine';
    this.bgmOsc1.frequency.value = 110; // A2

    this.bgmOsc2 = this.ctx.createOscillator();
    this.bgmOsc2.type = 'triangle';
    this.bgmOsc2.frequency.value = 164.81; // E3

    // Add some slow modulation
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // 10s cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(this.bgmOsc1.frequency);
    lfoGain.connect(this.bgmOsc2.frequency);
    lfo.start();

    this.bgmOsc1.connect(this.bgmGain);
    this.bgmOsc2.connect(this.bgmGain);
    this.bgmGain.connect(this.masterGain);

    this.bgmOsc1.start();
    this.bgmOsc2.start();
  }
}

export const audio = new AudioEngine();
