import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { normalizeAbsolutePath } from '@/lib/path-utils';

/**
 * Reads the content of a file from the filesystem.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPath = searchParams.get('path');
  
  if (!rawPath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  const filePath = normalizeAbsolutePath(rawPath);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (err: any) {
    console.error(`[FS ERROR]: Failed to read file at ${filePath}`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
