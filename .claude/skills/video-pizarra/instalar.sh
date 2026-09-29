#!/usr/bin/env bash
# Revisa (y opcionalmente instala) lo que necesita video-pizarra: Node 18+, Python 3 con numpy y Pillow, ffmpeg y Chromium de Playwright.
# Uso: ./instalar.sh          -> solo revisa
#      ./instalar.sh --instalar -> instala lo que falte
#      ./instalar.sh --voz      -> además instala la voz local (Piper, español) para la voz en off
set -u
INST=0; [ "${1:-}" = "--instalar" ] && INST=1
if [ "${1:-}" = "--voz" ]; then
  python3 -m pip install piper-tts 2>/dev/null || python3 -m pip install --break-system-packages piper-tts
  D="$HOME/.local/share/piper"; mkdir -p "$D"; V=es_ES-davefx-medium; U=https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/davefx/medium/$V
  curl -sSL -o "$D/$V.onnx" "$U.onnx" && curl -sSL -o "$D/$V.onnx.json" "$U.onnx.json" && echo "  ✔ voz $V en $D"; exit 0
fi
ok(){ printf "  ✔ %s\n" "$1"; }; falta(){ printf "  ✘ %s\n" "$1"; MISS=1; }
MISS=0
SUDO=""; [ "$(id -u)" != 0 ] && command -v sudo >/dev/null && SUDO=sudo
pkg(){ # instala un paquete del sistema según el gestor disponible
  if command -v brew >/dev/null; then brew install "$1"
  elif command -v apt-get >/dev/null; then $SUDO apt-get install -y "$1" || { $SUDO apt-get update && $SUDO apt-get install -y "$1"; }
  elif command -v winget >/dev/null; then winget install "$1"
  else echo "Instala $1 a mano"; fi; }
echo "Revisando dependencias…"
if command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 18 ]; then ok "Node $(node -v)"; else falta "Node.js 18+ (https://nodejs.org)"; [ $INST = 1 ] && pkg nodejs; fi
if command -v python3 >/dev/null; then ok "$(python3 --version)"; else falta "Python 3"; [ $INST = 1 ] && pkg python3; fi
for m in numpy PIL; do
  if python3 -c "import $m" 2>/dev/null; then ok "python: $m"; else falta "python: $m"; [ $INST = 1 ] && { python3 -m pip install numpy pillow 2>/dev/null || python3 -m pip install --break-system-packages numpy pillow; }; fi
done
if command -v ffmpeg >/dev/null; then ok "$(ffmpeg -version | head -1 | cut -d' ' -f1-3)"; else falta "ffmpeg"; [ $INST = 1 ] && pkg ffmpeg; fi
if [ -n "${CHROME_PATH:-}" ] && [ -x "$CHROME_PATH" ]; then ok "Chromium (CHROME_PATH)"
elif ls "${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}"/chromium-* >/dev/null 2>&1 || ls "$HOME/Library/Caches/ms-playwright"/chromium-* >/dev/null 2>&1; then ok "Chromium de Playwright"
else falta "Chromium de Playwright (npx playwright install chromium)"; [ $INST = 1 ] && npx --yes playwright install chromium; fi
[ $INST = 1 ] && { echo; exec "$0"; }
if python3 -c "import piper" 2>/dev/null && ls "$HOME/.local/share/piper/"*.onnx >/dev/null 2>&1; then ok "voz local Piper"; else printf "  · voz local Piper (opcional): ./instalar.sh --voz\n"; fi
[ $MISS = 0 ] && echo "Todo listo." || echo "Faltan dependencias: corre ./instalar.sh --instalar"
