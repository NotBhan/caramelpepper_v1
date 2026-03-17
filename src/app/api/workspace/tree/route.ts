import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * Recursively builds a nested directory tree.
 * Filters out heavy directories and normalizes paths for cross-platform UI consistency.
 */
async function buildTree(dirPath: string): Promise<any[]> {
  const IGNORE_LIST = ['.git', 'node_modules', '.next', 'build', '.gguf', 'out', '.cache'];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    const tree = await Promise.all(
      entries.map(async (entry) => {
        if (IGNORE_LIST.includes(entry.name)) return null;
        
        const fullPath = path.join(dirPath, entry.name);
        const normalizedPath = fullPath.split(path.sep).join('/');
        
        const item: any = {
          name: entry.name,
          path: normalizedPath,
          is_dir: entry.isDirectory(),
        };
        
        if (entry.isDirectory()) {
          item.children = await buildTree(fullPath);
        }
        
        return item;
      })
    );
    
    return tree.filter(Boolean).sort((a, b) => {
      if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error(`[FS ERROR]: Inaccessible directory ${dirPath}`, error);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rootPath = searchParams.get('path');
  
  if (!rootPath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }
  
  try {
    const tree = await buildTree(rootPath);
    return NextResponse.json(tree);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
