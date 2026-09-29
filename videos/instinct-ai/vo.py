"""Genera la voz en off por escena con Piper (local) y escribe audio/vo.json con las duraciones.
Uso: python3 vo.py [voz]   (modelos en ~/.local/share/piper, p. ej. es_ES-davefx-medium)"""
import json, os, subprocess, sys
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'es_ES-davefx-medium'
MODEL = os.path.expanduser(f'~/.local/share/piper/{VOICE}.onnx')
SPEED = 0.82   # length_scale < 1 = más rápido
LINES = [
  'Una startup de inteligencia artificial acaba de levantar mil millones de dólares.',
  'Ya vale diez mil millones. Hace un mes valía dos mil quinientos.',
  'Se llama Instinct. Y no es otro chatbot.',
  'Le escribes un mensaje, y lo hace por ti: con su propio teléfono y su propio ordenador.',
  'Reserva restaurantes, hace la compra, cancela suscripciones que olvidaste… y hasta llama por ti para pedir citas.',
  'El problema: casi nadie puede entrar. Solo con invitación.',
  'Eso sí: accede a mucha información personal. Empieza poco a poco y revisa bien los permisos.',
  'Comenta INSTINCT y te mando una invitación.',
]
out = []
for i, txt in enumerate(LINES):
    w, f = f'audio/vo/{i+1:02d}.raw.wav', f'audio/vo/{i+1:02d}.wav'
    subprocess.run([sys.executable, '-m', 'piper', '-m', MODEL, '--length-scale', str(SPEED), '-f', w], input=txt, text=True, check=True, capture_output=True)
    # recorta silencios y da brillo/presencia a la voz
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', w, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,highpass=f=80,equalizer=f=3500:t=q:w=1:g=3,acompressor=threshold=-18dB:ratio=3', '-ar', '44100', f], check=True)
    os.remove(w)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
    out.append({'file': f, 'dur': round(d, 3), 'text': txt})
json.dump(out, open('audio/vo.json', 'w'), ensure_ascii=False, indent=1)
print('\n'.join(f"{o['dur']:.2f}s  {o['text']}" for o in out), '\nTOTAL', round(sum(o['dur'] for o in out), 2))
