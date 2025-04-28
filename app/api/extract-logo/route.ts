import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const websiteUrl = searchParams.get('url');

    if (!websiteUrl) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        const formattedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
        
        const response = await axios.get(formattedUrl, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);

        // Function to check if an element is likely to be a logo
        const isLikelyLogo = ($el: any) => {
            const src = $el.attr('src')?.toLowerCase() || '';
            const alt = $el.attr('alt')?.toLowerCase() || '';
            const classNames = $el.attr('class')?.toLowerCase() || '';
            const id = $el.attr('id')?.toLowerCase() || '';
            
            // Check if the element is in a likely logo container
            const parent = $el.parent();
            const parentClass = parent.attr('class')?.toLowerCase() || '';
            const parentId = parent.attr('id')?.toLowerCase() || '';

            return Boolean(
                // Check element attributes
                src.includes('logo') ||
                alt.includes('logo') ||
                classNames.includes('logo') ||
                id.includes('logo') ||
                // Check parent container
                parentClass.includes('logo') ||
                parentId.includes('logo') ||
                parentClass.includes('brand') ||
                parentId.includes('brand') ||
                // Check common logo patterns
                (src.includes('header') && (alt.includes('brand') || alt.includes('company'))) ||
                (parentClass.includes('header') && (alt.includes('brand') || alt.includes('company')))
            );
        };

        // 1. Look in header and navigation first
        const headerNavLogos = $('header img, nav img').filter((_, el) => isLikelyLogo($(el)));
        if (headerNavLogos.length) {
            const src = headerNavLogos.first().attr('src');
            if (src) {
                return NextResponse.json({ logoUrl: new URL(src, formattedUrl).href });
            }
        }

        // 2. Look for SVG logos (common in modern sites)
        const svgLogos = $('svg').filter((_, el) => {
            const $svg = $(el);
            const classNames = $svg.attr('class')?.toLowerCase() || '';
            const id = $svg.attr('id')?.toLowerCase() || '';
            return classNames.includes('logo') || id.includes('logo');
        });
        if (svgLogos.length) {
            // If it's an SVG logo, we'll return the parent element's background image if available
            const parent = svgLogos.first().parent();
            const bgImage = parent.css('background-image');
            if (bgImage && bgImage !== 'none') {
                const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                if (urlMatch && urlMatch[1]) {
                    return NextResponse.json({ logoUrl: new URL(urlMatch[1], formattedUrl).href });
                }
            }
        }

        // 3. Look for background images in likely logo containers
        const bgLogos = $('[class*="logo"], [id*="logo"], [class*="brand"], [id*="brand"]')
            .filter((_, el) => {
                const $el = $(el);
                const bgImage = $el.css('background-image');
                return Boolean(bgImage && bgImage !== 'none');
            });
        if (bgLogos.length) {
            const bgImage = bgLogos.first().css('background-image');
            if (bgImage && bgImage !== 'none') {
                const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                if (urlMatch && urlMatch[1]) {
                    return NextResponse.json({ logoUrl: new URL(urlMatch[1], formattedUrl).href });
                }
            }
        }

        // 4. Look for any image that might be a logo
        const allImages = $('img').filter((_, el) => isLikelyLogo($(el)));
        if (allImages.length) {
            const src = allImages.first().attr('src');
            if (src) {
                return NextResponse.json({ logoUrl: new URL(src, formattedUrl).href });
            }
        }

        // 5. Look for common logo paths
        const commonLogoPaths = [
            '/images/logo.png',
            '/images/logo.svg',
            '/assets/logo.png',
            '/assets/logo.svg',
            '/img/logo.png',
            '/img/logo.svg',
            '/logo.png',
            '/logo.svg'
        ];

        for (const path of commonLogoPaths) {
            try {
                const logoUrl = new URL(path, formattedUrl).href;
                const response = await axios.head(logoUrl);
                if (response.status === 200) {
                    return NextResponse.json({ logoUrl });
                }
            } catch (error) {
                // Continue to next path
            }
        }

        return NextResponse.json({ logoUrl: null });
    } catch (error) {
        console.error("Error extracting logo:", error);
        return NextResponse.json({ error: 'Failed to extract logo' }, { status: 500 });
    }
} 