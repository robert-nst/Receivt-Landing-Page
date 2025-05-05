import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  try {
    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      return new NextResponse('Failed to fetch image', { status: 400 });
    }
    const buffer = await imageRes.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': imageRes.headers.get('content-type') || 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return new NextResponse('Error fetching image', { status: 500 });
  }
} 