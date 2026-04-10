import { NextResponse } from 'next/server';
import { analyzeCodeStyle } from '@/ai/flows/code-style-alignment';

/**
 * WASM Resolution Protocol:
 * If using web-tree-sitter, ensure tree-sitter.wasm and language .wasm files are 
 * either placed in the /public folder and loaded via absolute URL, or explicitly 
 * permitted in next.config.ts using webpack experiments.asyncWebAssembly.
 */

export const dynamic = 'force-dynamic';

/**
 * AI Style Analysis Route.
 * Rewritten to use proper Next.js 15 App Router request handling and 
 * implement deep diagnostic logging to identify AST or WASM failures.
 */
export async function POST(req: Request) {
  try {
    // 1. Request Extraction & Validation
    const body = await req.json();
    const code = body.code;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Missing code snippet or invalid input format' }, 
        { status: 400 }
      );
    }

    // 2. AST Engine / AI Analysis Block
    try {
      const result = await analyzeCodeStyle({ code });
      return NextResponse.json(result);
    } catch (error: any) {
      // 3. Deep Diagnostic Logging
      // This catches WASM initialization errors, Genkit flow failures, or parsing exceptions.
      console.error('[AST ENGINE FAILURE]:', error.message, error.stack);
      
      // 4. Detailed Error Response
      // Surface the exact error message to the client for transparency.
      return NextResponse.json(
        { 
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 
        { status: 500 }
      );
    }

  } catch (err: any) {
    console.error("[STYLE API REQUEST ERROR]:", err.message);
    return NextResponse.json(
      { error: 'Invalid request payload or JSON format' }, 
      { status: 400 }
    );
  }
}
