"""Voz en off por segmento → audio/vo/NN.wav + audio/vo.json (lo lee el motor y vo_mix.py).
Lee audio/lines.json ([{seg, text}], lo escribe build.mjs a partir de los `say` de tutorial.js).
- Voz propia (recomendado para marca personal): graba cada frase como audio/propia/NN.wav (NN = orden de la frase, 01, 02…)
  y se usa tal cual (se recortan silencios y se nivela).
- Si no, voz sintética local con Piper: python3 vo.py [modelo]  (modelos en ~/.local/share/piper, p. ej. es_ES-davefx-medium)."""
import json, os, subprocess, sys
VOICE = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('PIPER_VOICE', 'es_ES-davefx-medium')
MODEL = os.path.expanduser(f'~/.local/share/piper/{VOICE}.onnx')
SPEED = float(os.environ.get('PIPER_SPEED', 0.85))          # length_scale < 1 = más rápido
FX = ('silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
      'highpass=f=80,equalizer=f=3500:t=q:w=1:g=3,acompressor=threshold=-18dB:ratio=3')
lines = json.load(open('audio/lines.json'))
old = {o['text']: o for o in (json.load(open('audio/vo.json')) if os.path.exists('audio/vo.json') else [])}
os.makedirs('audio/vo', exist_ok=True); out = []
for i, ln in enumerate(lines):
    f, own = f'audio/vo/{i+1:02d}.wav', f'audio/propia/{i+1:02d}.wav'
    src = own if os.path.exists(own) else None
    cached = old.get(ln['text'])
    if not src and cached and os.path.exists(cached['file']) and cached['file'] == f and not cached.get('own'):
        out.append({**cached, 'seg': ln['seg']}); continue
    if not src:
        if not os.path.exists(MODEL): sys.exit(f'Falta el modelo de voz {MODEL}. Instálalo con ./instalar.sh --voz o graba audio/propia/{i+1:02d}.wav')
        src = f + '.raw.wav'
        subprocess.run([sys.executable, '-m', 'piper', '-m', MODEL, '--length-scale', str(SPEED), '-f', src], input=ln['text'].replace('*', ''), text=True, check=True, capture_output=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-af', FX, '-ac', '1', '-ar', '44100', f], check=True)
    if src.endswith('.raw.wav'): os.remove(src)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
    out.append({'seg': ln['seg'], 'file': f, 'dur': round(d, 3), 'text': ln['text'], 'own': src == own})
json.dump(out, open('audio/vo.json', 'w'), ensure_ascii=False, indent=1)
print('\n'.join(f"{o['dur']:5.2f}s {'(tu voz) ' if o.get('own') else ''}{o['text']}" for o in out), f"\nTOTAL voz {sum(o['dur'] for o in out):.1f} s")
