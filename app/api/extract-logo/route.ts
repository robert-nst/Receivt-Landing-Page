import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to find the logo using common selectors
    let logoUrl = '';
    
    // Check for common logo selectors
    const possibleSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'meta[property="og:image"]',
      'img[alt*="logo" i]',
      'img[class*="logo" i]',
      'img[id*="logo" i]',
      'img[src*="logo" i]'
    ];

    for (const selector of possibleSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        logoUrl = element.attr('href') || element.attr('src') || '';
        if (logoUrl) break;
      }
    }

    // If we found a relative URL, make it absolute
    if (logoUrl && !logoUrl.startsWith('http')) {
      const baseUrl = new URL(url);
      logoUrl = new URL(logoUrl, baseUrl.origin).toString();
    }

    if (!logoUrl) {
      return NextResponse.json({ error: 'No logo found' }, { status: 404 });
    }

    return NextResponse.json({ logoUrl });
  } catch (error) {
    console.error('Error extracting logo:', error);
    return NextResponse.json({ error: 'Failed to extract logo' }, { status: 500 });
  }
} 