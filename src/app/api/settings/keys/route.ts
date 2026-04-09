import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const VAULT_PATH = path.join(process.cwd(), 'secrets.json');

/**
 * Securely stores API keys in a local JSON vault.
 */
export async function POST(req: NextRequest) {
  try {
    const { provider, key } = await req.json();
    let keys: Record<string, string> = {};
    
    try {
      const data = await fs.readFile(VAULT_PATH, 'utf-8');
      keys = JSON.parse(data);
    } catch (e) {
      // Vault doesn't exist yet, start fresh
    }

    keys[provider] = key;
    await fs.writeFile(VAULT_PATH, JSON.stringify(keys, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
