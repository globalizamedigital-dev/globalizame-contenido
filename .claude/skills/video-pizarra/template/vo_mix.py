"""Mezcla la voz en off (marcas 'vo_N' de sfx.json) sobre la mezcla de música+sfx, con ducking.
Uso: python3 vo_mix.py <mix_in.wav> <mix_out.wav>"""
import json, subprocess, sys, wave, numpy as np
SR = 44100; src, dst = sys.argv[1], sys.argv[2]
with wave.open(src) as w: ch = w.getnchannels(); mix = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch) / 32767
L = len(mix); vo = np.zeros(L); files = {i + 1: o['file'] for i, o in enumerate(json.load(open('audio/vo.json')))}
for e in json.load(open('sfx.json')):
    if not e['name'].startswith('vo_'): continue
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', files[int(e['name'][3:])], '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).astype(float); s = int(e['t'] * SR); n = min(L - s, len(x))
    if n > 0: vo[s:s + n] += x[:n]
vo /= max(1e-6, np.abs(vo).max()) / 0.85
env = np.convolve(np.abs(vo) > 0.02, np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')   # ducking suave
duck = 1 - 0.55 * np.clip(env * 3, 0, 1)
out = mix * duck[:, None] + np.stack([vo, vo], 1) * 1.1
out = np.tanh(out * 1.05) / np.tanh(1.05)
with wave.open(dst, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
print('vo mezclada →', dst)
