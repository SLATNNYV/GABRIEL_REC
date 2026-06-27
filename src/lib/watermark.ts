import sharp from "sharp";
import path from "path";

/**
 * Generates a watermarked version of an image buffer.
 * In production, this would be cached or served via a CDN.
 */
export async function generateWatermarkedBuffer(
  inputBuffer: Buffer, 
  clientName: string = "CLIENTE",
  photographerName: string = "GABRIEL LUIZ (REC)"
) {
  const metadata = await sharp(inputBuffer).metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 800;

  // 1. Create a SVG watermark overlay
  const svgOverlay = `
    <svg width="${width}" height="${height}">
      <style>
        .text { fill: white; fill-opacity: 0.15; font-family: sans-serif; font-weight: bold; }
        .small { font-size: ${Math.floor(width / 40)}px; }
        .big { font-size: ${Math.floor(width / 15)}px; }
      </style>
      
      <!-- Pattern watermark -->
      <pattern id="pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
        <text x="0" y="50" class="text small">${photographerName}</text>
        <text x="0" y="150" class="text small">PREVIA PROTEGIDA</text>
        <text x="0" y="250" class="text small">${clientName}</text>
      </pattern>
      
      <rect width="100%" height="100%" fill="url(#pattern)" />
      
      <!-- Dynamic timestamp at the bottom -->
      <text x="${width - 20}" y="${height - 20}" text-anchor="end" class="text small">
        Visualizado em: ${new Date().toLocaleString('pt-BR')}
      </text>
    </svg>
  `;

  // 2. Composite the watermark over the image and lower the quality for preview
  return await sharp(inputBuffer)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 70 }) // Lower quality for preview speed and protection
    .toBuffer();
}
