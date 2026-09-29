"""Hoja de inspección de una grabación propia (OBS, QuickTime, Xbox Game Bar…) para elegir zooms a mano.
Uso: python3 inspeccionar.py capturas/mi-grabacion.mp4 [cada_seg=2]  → capturas/<nombre>-inspect.jpg
Cada miniatura lleva su segundo y una rejilla con coordenadas en píxeles del video original:
con eso se escriben los `zoom: [{ at, rect: [x, y, w, h] }]` del segmento."""
import os, subprocess, sys, tempfile, glob
from PIL import Image, ImageDraw, ImageFont
src = sys.argv[1]; every = float(sys.argv[2]) if len(sys.argv) > 2 else 2
w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split(','))
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'fps=1/{every},scale=640:-2', f'{tmp}/%04d.jpg'], check=True)
fs = sorted(glob.glob(f'{tmp}/*.jpg')); tw, th = Image.open(fs[0]).size; k = tw / w; cols = 3
sheet = Image.new('RGB', (tw * cols, (th + 34) * ((len(fs) + cols - 1) // cols)), 'white')
try: fnt = ImageFont.truetype('DejaVuSans-Bold.ttf', 18)
except OSError: fnt = ImageFont.load_default()
step = 200 if w <= 2000 else 400
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB'); d = ImageDraw.Draw(im)
    for x in range(0, w, step): d.line([(x * k, 0), (x * k, th)], fill=(255, 75, 11), width=1); d.text((x * k + 2, 2), str(x), fill=(255, 75, 11), font=fnt)
    for y in range(0, h, step): d.line([(0, y * k), (tw, y * k)], fill=(255, 75, 11), width=1); d.text((2, y * k + 2), str(y), fill=(255, 75, 11), font=fnt)
    x0, y0 = (i % cols) * tw, (i // cols) * (th + 34); sheet.paste(im, (x0, y0 + 34))
    ImageDraw.Draw(sheet).text((x0 + 8, y0 + 6), f'{i * every:.1f} s', fill='black', font=fnt)
dst = os.path.splitext(src)[0] + '-inspect.jpg'; sheet.save(dst, quality=85)
print(f'{dst}: {len(fs)} fotogramas, video {w}x{h}, rejilla cada {step}px')
