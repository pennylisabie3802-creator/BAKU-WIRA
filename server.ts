/**
 * BAKUWIRA: Express + Vite Full-Stack Server
 * Serves Vite middleware and exposes server-side Gemini Interactions API endpoints
 * including gemini-omni-1.2-flash video generation.
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', game: 'BAKUWIRA: Misi Penyelamat Bahasa' });
});

// Gemini Omni Flash (gemini-omni-1.2-flash) Image-to-Video Animation Endpoint
app.post('/api/animate-video', async (req, res) => {
  try {
    const { imageBase64, mimeType, motionPrompt, aspectRatio } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY tidak dikonfigurasikan di persekitaran pelayan (AI Studio Secrets).',
      });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'Sila sertakan data gambar base64.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Interactions API call using gemini-omni-1.2-flash
    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.2-flash',
        input: [
          {
            type: 'image',
            mime_type: mimeType || 'image/jpeg',
            data: imageBase64,
          },
          {
            type: 'text',
            text:
              motionPrompt ||
              'Anime fantasy scene with gentle breeze, sakura petals falling, glowing magical particles, and soft cinematic camera movement.',
          },
        ],
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      return res.json({
        videoBase64: videoPart.data,
        mimeType: videoPart.mime_type || 'video/mp4',
      });
    }

    return res.status(500).json({
      error: 'Tiada video dihasilkan oleh model. Sila cuba lagi dengan prompt yang berbeza.',
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return res.status(500).json({
      error: error.message || 'Ralat semasa memproses video menggunakan Gemini Omni Flash.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BAKUWIRA Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
