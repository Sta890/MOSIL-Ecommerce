import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private ctx = new AudioContext();

  private _muted = false;

  setMuted(value: boolean) {
    this._muted = value;
  }


  private async resume() {
    if (this.ctx.state === 'closed') {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  private async play(frequency: number, type: OscillatorType, duration: number, volume = 0.3) {
    if (this._muted) return;
    await this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  async addToCart() {
    await this.play(523, 'sine', 0.15);
    setTimeout(() => this.play(659, 'sine', 0.15), 100);
    setTimeout(() => this.play(784, 'sine', 0.2), 200);
  }

  async removeFromCart() {
    await this.play(400, 'sine', 0.15);
    setTimeout(() => this.play(300, 'sine', 0.2), 100);
  }

  async orderSuccess() {
    await this.play(523, 'sine', 0.1);
    setTimeout(() => this.play(659, 'sine', 0.1), 100);
    setTimeout(() => this.play(784, 'sine', 0.1), 200);
    setTimeout(() => this.play(1047, 'sine', 0.4), 300);
  }

  async login() {
    await this.play(440, 'sine', 0.1);
    setTimeout(() => this.play(550, 'sine', 0.2), 100);
  }

  async error() {
    await this.play(200, 'sawtooth', 0.3);
  }
}
