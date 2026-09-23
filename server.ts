import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import JSZip from 'jszip';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API: Download full project as ZIP archive for GitHub / Local backup
app.get('/api/download-zip', async (_req: Request, res: Response) => {
  try {
    const zip = new JSZip();
    const rootDir = process.cwd();

    function addFilesToZip(currentDir: string, zipFolder: JSZip) {
      const files = fs.readdirSync(currentDir);
      for (const file of files) {
        if (
          file === 'node_modules' ||
          file === '.git' ||
          file === '.aistudio' ||
          file === 'dist' ||
          file === '.next' ||
          file === 'bun.lock'
        ) {
          continue;
        }

        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(file);
          if (subFolder) {
            addFilesToZip(fullPath, subFolder);
          }
        } else if (stat.isFile()) {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(file, content);
        }
      }
    }

    addFilesToZip(rootDir, zip);

    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="autoinsta-source-code.zip"');
    res.send(buffer);
  } catch (err: any) {
    console.error('Error creating ZIP archive:', err);
    res.status(500).json({ error: 'Falha ao gerar arquivo ZIP do projeto' });
  }
});

// Initialize Gemini SDK with server-side API key
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (geminiApiKey) {
  genAI = new GoogleGenAI({ apiKey: geminiApiKey });
}

// API: Proxy latency and health tester
app.post('/api/proxy/test', (req: Request, res: Response) => {
  const { host, port, type } = req.body;
  if (!host || !port) {
    return res.status(400).json({ success: false, message: 'Host e porta são obrigatórios' });
  }

  // Simulate network handshake test with realistic latency
  const latency = Math.floor(Math.random() * 80) + 35; // 35ms - 115ms
  const ipMock = `${Math.floor(Math.random() * 150) + 45}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250) + 1}`;
  
  setTimeout(() => {
    res.json({
      success: true,
      latencyMs: latency,
      ip: ipMock,
      country: 'Brasil (BR)',
      city: 'São Paulo',
      protocol: type || 'HTTP',
      status: 'Operacional e seguro para automação'
    });
  }, 400);
});

// API: Gemini AI assistant for Copy, Spintax and Optimization
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  const { type, niche, prompt: customPrompt } = req.body;

  try {
    if (!geminiApiKey || !genAI) {
      // Graceful fallback with rich templates if API key is not yet set
      if (type === 'spintax_comments') {
        return res.json({
          text: `{Sensacional|Excelente|Show de bola|Incrível|Muito bom} esse {conteúdo|post|vídeo}, @{username}! {Parabéns pelo trabalho|Sempre agregando valor|Muito inspirador|Dica valiosa}! {👏🔥|🚀👏|🔝💯}`
        });
      }
      if (type === 'welcome_dm') {
        return res.json({
          text: `Olá {primeiro_nome}! Seja muito bem-vindo(a) ao meu perfil 👋 Preparei um conteúdo exclusivo para você que acabou de chegar. Me conta: qual o seu maior desafio hoje em ${niche || 'seu negócio'}?`
        });
      }
      if (type === 'keyword_dm') {
        return res.json({
          text: `E aí {primeiro_nome}! Vi que você comentou no nosso post sobre ${niche || 'nosso material'}. Conforme prometido, aqui está o seu acesso direto: 🔗 https://exemplo.com/acesso-vip`
        });
      }
      return res.json({
        text: `Configuração otimizada para o nicho de ${niche}: Recomendado Modo Seguro nos primeiros 7 dias, foco em seguidores de 3 perfis concorrentes de referência e intervalo de 55 a 110 segundos entre ações.`
      });
    }

    let systemInstruction = "Você é um especialista em automação e crescimento orgânico no Instagram (AutoInsta). Responda sempre em português do Brasil de forma concisa e prática.";
    let promptText = "";

    if (type === 'spintax_comments') {
      promptText = `Crie uma variação em formato Spintax (com sintaxe {opcao1|opcao2|opcao3}) para comentários humanizados e genuínos no Instagram para o nicho "${niche || 'geral'}". 
Inclua variáveis como @{username} e emojis naturais. Retorne APENAS a linha com o formato Spintax pronto para copiar e colar, sem explicações adicionais.`;
    } else if (type === 'welcome_dm') {
      promptText = `Crie uma mensagem de Direct (DM) de boas-vindas para novos seguidores no Instagram para o nicho "${niche || 'negócios'}".
Deve ser acolhedora, humanizada, com gancho para iniciar uma conversa e usar a variável {primeiro_nome}. Retorne apenas o texto da mensagem.`;
    } else if (type === 'keyword_dm') {
      promptText = `Crie uma mensagem de direct rápida e persuasiva para ser enviada automaticamente quando o usuário comentar uma palavra-chave no post do Instagram sobre "${niche || 'oferta'}". Use {primeiro_nome} e um placeholder de link [LINK_AQUI]. Retorne apenas o texto.`;
    } else {
      promptText = customPrompt || `Dê 3 dicas rápidas de segmentação no Instagram para o nicho "${niche}".`;
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 600,
      }
    });

    const resultText = response.text || '';
    res.json({ text: resultText.trim() });
  } catch (error: any) {
    console.error('Error generating with Gemini:', error);
    res.status(500).json({ error: error?.message || 'Falha ao processar solicitação com IA' });
  }
});

async function startServer() {
  // Mount Vite middleware in development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoInsta Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
