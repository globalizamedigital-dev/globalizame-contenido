// Ejemplo: genera un video con Seedance 2.5 (texto → video) vía el SDK oficial de Higgsfield.
//   npm run higgsfield:example
// Credenciales: HF_CREDENTIALS="key-id:key-secret" en .env.local (ignorado por Git) o como variable/secreto del entorno.
// Nunca se imprimen ni se registran. Cada ejecución es una generación de pago.
import { existsSync } from 'node:fs';
import { config, higgsfield, HiggsfieldError, NotEnoughCreditsError } from '@higgsfield/client/v2';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
if (!process.env.HF_CREDENTIALS) {
  console.error('Falta HF_CREDENTIALS. Añádela en .env.local (HF_CREDENTIALS=key-id:key-secret) o como secreto del entorno.');
  process.exit(1);
}
config({ credentials: process.env.HF_CREDENTIALS });

const MODEL = 'bytedance/seedance-2.5/text-to-video';
const input = { prompt: 'A cinematic scene at sunset', duration: 5, resolution: '720p', aspect_ratio: '16:9' };

try {
  console.log(`Generando con ${MODEL}… (espera a que termine)`);
  const result = await higgsfield.subscribe(MODEL, { input, withPolling: true });
  if (result.status === 'completed' && result.video?.url) {
    console.log(`Completado (request ${result.request_id})\nVideo: ${result.video.url}`);
  } else {
    const why = { nsfw: 'rechazado por moderación', failed: 'la generación falló', canceled: 'cancelada', cancelled: 'cancelada' }[result.status]
      ?? (result.status === 'completed' ? 'terminó sin URL de video' : `estado inesperado "${result.status}"`);
    console.error(`No se generó el video: ${why} (request ${result.request_id}).`);
    process.exit(1);
  }
} catch (e) {
  if (e instanceof NotEnoughCreditsError) console.error('Sin créditos suficientes en Higgsfield.');
  else if (e instanceof HiggsfieldError) console.error(`Error de Higgsfield (${e.name}): ${e.message}`);
  else console.error(`Error inesperado: ${e.message}`);
  process.exit(1);
}
