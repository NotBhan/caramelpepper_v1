import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

/**
 * Validates that a path exists and is a directory.
 */
export async function POST(req: NextRequest) {
  try {
    const { path: rootPath } = await req.json();
    
    if (!rootPath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }
    
    const stats = await fs.stat(rootPath);
    if (!stats.isDirectory()) {
      return NextResponse.json({ error: 'Path is not a directory' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Path does not exist' }, { status: 404 });
  }
}
