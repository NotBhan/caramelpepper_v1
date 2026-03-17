
import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route to forward requests from Next.js to the C++ backend.
 * CaramelPepper runs a local Crow server on port 18080.
 */
const BACKEND_URL = 'http://127.0.0.1:18080';

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.join('/');
  const searchParams = req.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
      },
      body,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error(`[PROXY ERROR]: Failed to connect to backend at ${url}`, error);
    return NextResponse.json({ error: 'Backend connection failed' }, { status: 502 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
