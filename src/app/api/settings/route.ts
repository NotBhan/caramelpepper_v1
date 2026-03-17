
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

/**
 * Handles general application settings like Ollama configuration.
 */
export async function GET() {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();
    let config: Record<string, any> = {};
    
    try {
      const data = await fs.readFile(CONFIG_PATH, 'utf-8');
      config = JSON.parse(data);
    } catch (e) {}

    const newConfig = { ...config, ...updates };
    await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
