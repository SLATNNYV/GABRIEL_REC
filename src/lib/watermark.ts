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
        .text { 
          fill: white; 
          stroke: black; 
          stroke-width: 1.2px; 
          fill-opacity: 0.32; 
          stroke-opacity: 0.28; 
          font-family: sans-serif; 
          font-weight: 900; 
        }
        .small { font-size: ${Math.max(12, Math.floor(width / 50))}px; }
      </style>
      
      <!-- Pattern watermark (dense repeating tiles) -->
      <pattern id="pattern" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
        <text x="0" y="40" class="text small">${photographerName}</text>
        <text x="0" y="110" class="text small">PREVIA PROTEGIDA</text>
        <text x="0" y="180" class="text small">${clientName}</text>
      </pattern>
      
      <rect width="100%" height="100%" fill="url(#pattern)" />
      
      <!-- Giant diagonal center watermark -->
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" 
            transform="rotate(-30, ${width / 2}, ${height / 2})" 
            style="fill: white; stroke: black; stroke-width: ${Math.max(2, Math.floor(width / 400))}px; fill-opacity: 0.25; stroke-opacity: 0.25; font-family: sans-serif; font-weight: 900; font-size: ${Math.floor(width / 12)}px;">
        PREVIA PROTEGIDA
      </text>
      <text x="${width / 2}" y="${height / 2 + Math.floor(width / 14)}" text-anchor="middle" dominant-baseline="middle" 
            transform="rotate(-30, ${width / 2}, ${height / 2})" 
            style="fill: white; stroke: black; stroke-width: ${Math.max(1, Math.floor(width / 600))}px; fill-opacity: 0.20; stroke-opacity: 0.20; font-family: sans-serif; font-weight: 900; font-size: ${Math.floor(width / 22)}px;">
        NÃO AUTORIZADO PARA USO
      </text>
      
      <!-- Dynamic timestamp at the bottom -->
      <text x="${width - 20}" y="${height - 20}" text-anchor="end" class="text small">
        Visualizado em: ${new Date().toLocaleString('pt-BR')}
      </text>
    </svg>
  `;

  // 2. Composite the watermark over the image and lower the quality for preview
  return await sharp(inputBuffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 60 }) // Lower quality to prevent print/misuse and speed up loading
    .toBuffer();
}
