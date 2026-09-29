"""Base rítmica sintetizada (128 BPM, 4/4) → audio/music.mp3 + audio/beats.json. Uso: python3 beat.py [segundos]"""
import json, subprocess, sys, wave, numpy as np
SR, BPM = 44100, 128; DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 60
B = 60 / BPM; L = int(SR * DUR); out = np.zeros(L); rng = np.random.default_rng(7)
def add(x, t, g=1.0):
    s = int(t * SR); e = min(L, s + len(x))
    if s < L: out[s:e] += g * x[:e - s]
tt = lambda d: np.arange(int(SR * d)) / SR
def kick():
    t = tt(0.35); f = 45 + 110 * np.exp(-t * 28); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
def clap():
    t = tt(0.22); n = rng.standard_normal(len(t)); env = np.exp(-t * 22) + 0.6 * np.exp(-((t - 0.012) * 400) ** 2)
    return np.convolve(n, np.ones(6) / 6, 'same') * env * 0.55
def hat(o=False):
    t = tt(0.18 if o else 0.05); n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(3) / 3, 'same')
    return n * np.exp(-t * (18 if o else 90)) * 0.35
def bass(f, d):
    t = tt(d); x = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * t)
    x = np.convolve(x, np.ones(40) / 40, 'same'); return x * np.minimum(1, t * 60) * np.exp(-t * 3) * 0.28
def stab(fs, d):
    t = tt(d); x = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) for f in fs)
    return x * np.exp(-t * 7) * 0.09
roots = [55.0, 43.65, 65.41, 49.0]          # A1 F1 C2 G1
chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [261.6, 329.6, 392], [196, 246.9, 293.7]]
nb = int(DUR / B) + 1; beats, strength = [], []
for i in range(nb):
    t = i * B; bar = (i // 4) % 4; intro = i < 4
    beats.append(round(t, 3)); strength.append(1.0 if i % 4 == 0 else 0.6 if i % 2 == 0 else 0.4)
    add(kick(), t, 0.5 if intro else 1.0)
    if i % 4 in (1, 3) and not intro: add(clap(), t)
    add(hat(), t + B / 2, 0.8); add(hat(), t + B / 4, 0.3)
    if i % 2 == 1: add(hat(True), t + B / 2, 0.5)
    if not intro:
        add(bass(roots[bar], B * 0.45), t + B / 2)
        if i % 4 == 0: add(stab(chords[bar], B * 1.5), t)
        if i % 4 == 2: add(stab(chords[bar], B * 0.5), t + B * 0.75)
out = np.tanh(out * 1.4) / np.tanh(1.4); out /= np.abs(out).max() / 0.9
pcm = (np.stack([out, out], 1) * 32767).astype(np.int16)
with wave.open('audio/_beat.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'audio/_beat.wav', '-b:a', '192k', 'audio/music.mp3'], check=True)
json.dump({'tempo': BPM, 'beats': beats, 'strength': strength, 'sections': [0, round(4 * B, 2)]}, open('audio/beats.json', 'w'))
print(f'audio/music.mp3 {DUR}s @ {BPM} BPM, {nb} beats')
