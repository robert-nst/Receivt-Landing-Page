import { NextResponse } from 'next/server'
import axios from 'axios'
import sharp from 'sharp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    // Fetch the image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'binary')

    // Process the image with sharp
    const image = sharp(buffer)
    
    // Resize the image to make processing faster
    const resizedImage = await image.resize(100, 100, { fit: 'inside' })
    
    // Get raw pixel data
    const { data, info } = await resizedImage.raw().toBuffer({ resolveWithObject: true })
    
    // Extract colors
    const colors = new Map<string, number>()
    const pixels = new Uint8ClampedArray(data)
    
    // Count color occurrences
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      colors.set(hex, (colors.get(hex) || 0) + 1)
    }

    // Sort colors by frequency and get top 8
    const sortedColors = Array.from(colors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([color]) => color)

    return NextResponse.json({ colors: sortedColors })
  } catch (error) {
    console.error('Error extracting colors:', error)
    return NextResponse.json({ error: 'Failed to extract colors' }, { status: 500 })
  }
} 