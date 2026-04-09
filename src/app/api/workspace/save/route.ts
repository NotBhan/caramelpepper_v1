import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * Saves content to a specified file path.
 * Ensures parent directories exist before writing.
 */
export async function POST(req: NextRequest) {
  try {
    const { path: filePath, content } = await req.json();
    
    if (!filePath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }
    
    const parentDir = path.dirname(filePath);
    await fs.mkdir(parentDir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[FS ERROR]: Failed to save file`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
