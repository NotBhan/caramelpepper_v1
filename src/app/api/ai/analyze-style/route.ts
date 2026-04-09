import { NextRequest, NextResponse } from 'next/server';
import { analyzeCodeStyle } from '@/ai/flows/code-style-alignment';

export const dynamic = 'force-dynamic';

/**
 * AI Style Analysis Route.
 * Isolates Genkit flow execution to the server-side.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code) {
      return NextResponse.json({ error: 'Missing code snippet' }, { status: 400 });
    }

    const result = await analyzeCodeStyle({ code: body.code });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[STYLE API ERROR]:", err);
    return NextResponse.json({ error: err.message || 'Style analysis failed' }, { status: 500 });
  }
}
