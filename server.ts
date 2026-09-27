import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API proxy route for Gemini multi-turn chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash', role = 'advisor' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.',
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Role-specific System Instructions
    let systemInstruction = '';
    if (role === 'advisor') {
      systemInstruction =
        'You are the Student Tools Hub Academic Advisor. Your role is to help university and college students understand their GPA, CGPA, graduation requirements, course planning, grading scales (4.0, 4.33, 5.0, 10.0), syllabus breakdowns, and academic standing. Provide encouraging, mathematically precise, clear, and actionable advice formatted cleanly with markdown bullet points and bold text where appropriate.';
    } else if (role === 'speed_tutor') {
      systemInstruction =
        'You are the Speed Tutor on Student Tools Hub. Your role is to provide lightning-fast, ultra-concise definitions, formulas, and rapid explanations for academic terms, percentages, attendance rules, and study concepts. Keep answers brief, direct, and under 3-4 sentences unless detailed derivation is specifically requested.';
    } else if (role === 'stem_solver') {
      systemInstruction =
        'You are the Advanced STEM & Math Problem Solver on Student Tools Hub. Your role is to solve complex academic tasks, mathematics, calculus, linear algebra, statistics, computer science algorithms, and engineering problems step-by-step. Break down calculations thoroughly, show intermediate formulas, verify boundary conditions, and explain the intuition clearly.';
    } else {
      systemInstruction =
        'You are an intelligent, helpful academic assistant on Student Tools Hub. Help students excel in their courses, manage workload, calculate grades accurately, and stay organized.';
    }

    // Enforce valid models: gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general tasks, and gemini-3.1-flash-lite for fast tasks
    let selectedModel = 'gemini-3.5-flash';
    if (model === 'gemini-3.1-pro-preview') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (model === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else {
      selectedModel = 'gemini-3.5-flash';
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format message history for multi-turn chat
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || 'I could not generate a response. Please try again.';
    res.json({ reply: replyText, model: selectedModel });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate response from Gemini API',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
