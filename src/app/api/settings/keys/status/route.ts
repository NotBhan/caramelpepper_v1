import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const VAULT_PATH = path.join(process.cwd(), 'secrets.json');

/**
 * Returns which providers have keys configured in the vault without revealing plaintext keys.
 */
export async function GET() {
  try {
    let keys: Record<string, string> = {};
    try {
      const data = await fs.readFile(VAULT_PATH, 'utf-8');
      keys = JSON.parse(data);
    } catch (e) {
      // Vault empty
    }

    const status = {
      openai: !!keys.openai,
      anthropic: !!keys.anthropic || !!keys.claude,
      gemini: !!keys.gemini,
    };
    
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json({ openai: false, anthropic: false, gemini: false }, { status: 200 });
  }
}
