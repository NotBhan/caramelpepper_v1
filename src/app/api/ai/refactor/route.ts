
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const VAULT_PATH = path.join(process.cwd(), 'secrets.json');
const CONFIG_PATH = path.join(process.cwd(), 'config.json');

/**
 * AI Refactoring Router.
 * Handles switching between cloud Genkit providers and local Ollama inference.
 */
export async function POST(req: NextRequest) {
  try {
    const { code, language, provider } = await req.json();

    if (provider === 'ollama') {
      return handleOllamaRefactor(code, language);
    }

    // [FUTURE]: Proxy to Genkit flows for other providers if pivoting fully to API routes.
    // For now, we return an error if calling from here for non-ollama as they use server actions.
    return NextResponse.json({ error: 'Provider not supported via API route yet.' }, { status: 400 });

  } catch (err: any) {
    console.error("[AI API ERROR]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handleOllamaRefactor(code: string, language: string) {
  let config: Record<string, any> = { 
    ollamaUrl: 'http://127.0.0.1:11434', 
    ollamaModel: 'qwen2.5-coder' 
  };

  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    config = { ...config, ...JSON.parse(data) };
  } catch (e) {}

  const systemPrompt = `You are an expert code refactoring assistant.
CRITICAL CONSTRAINT: VERTICAL PACING
You MUST preserve 100% of the original vertical spacing.
- If the original code has an empty line between blocks, your output MUST have an empty line in the same place.
- Do not compress or minify the code.
- Maintain the exact original paragraphing.

Your goal is to improve code quality, maintainability, and reduce complexity.
Provide your response as a JSON object with:
"refactoredCode": The improved source code.
"suggestions": A list of specific improvements made.
"complexityAnalysis": A brief analysis of the code's complexity.

Format: JSON only.`;

  const userPrompt = `Refactor this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const response = await fetch(`${config.ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ollamaModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        format: 'json'
      })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Model '${config.ollamaModel}' not found in Ollama. Please run 'ollama pull ${config.ollamaModel}'.`);
      }
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.message.content);
    return NextResponse.json(result);

  } catch (err: any) {
    if (err.code === 'ECONNREFUSED' || err.message.includes('fetch failed')) {
      return NextResponse.json({ 
        error: 'Ollama Service Unavailable. Check if Ollama is running and CORS is allowed.' 
      }, { status: 503 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
