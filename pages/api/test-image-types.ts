import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { logo_url } = req.body;
    
    if (!logo_url) {
      return res.status(400).json({ error: 'logo_url is required' });
    }

    console.log('=== IMAGE TYPE TEST ===');
    console.log('Testing URL:', logo_url);

    // Test the image
    const response = await fetch(logo_url);
    
    if (!response.ok) {
      return res.status(400).json({
        error: 'Failed to fetch image',
        status: response.status,
        statusText: response.statusText
      });
    }

    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length') || '0';
    
    console.log('Content-Type:', contentType);
    console.log('Content-Length:', contentLength);

    // Get the image data
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${contentType};base64,${base64}`;

    // Determine image type
    let imageType = 'unknown';
    if (contentType.includes('svg')) imageType = 'SVG';
    else if (contentType.includes('png')) imageType = 'PNG';
    else if (contentType.includes('jpeg') || contentType.includes('jpg')) imageType = 'JPEG';
    else if (contentType.includes('gif')) imageType = 'GIF';
    else if (contentType.includes('webp')) imageType = 'WebP';

    // Create test HTML
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Image Type Test</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .test-container { 
            border: 2px solid #333; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center;
          }
          .image-info {
            background: #f5f5f5;
            padding: 10px;
            margin: 10px 0;
            text-align: left;
            font-family: monospace;
            font-size: 12px;
          }
          img { 
            max-width: 200px; 
            max-height: 100px; 
            object-fit: contain;
            border: 1px solid #ccc;
            margin: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Image Type Test: ${imageType}</h1>
        
        <div class="test-container">
          <h3>Original URL</h3>
          <img src="${logo_url}" alt="Original URL" id="original">
          <div class="image-info">
            <strong>URL:</strong> ${logo_url}<br>
            <strong>Type:</strong> ${imageType}<br>
            <strong>Content-Type:</strong> ${contentType}<br>
            <strong>Size:</strong> ${buffer.byteLength} bytes
          </div>
        </div>

        <div class="test-container">
          <h3>Base64 Data URL</h3>
          <img src="${dataUrl}" alt="Base64 Data URL" id="base64">
          <div class="image-info">
            <strong>Type:</strong> ${imageType}<br>
            <strong>Base64 Length:</strong> ${base64.length}<br>
            <strong>Data URL Length:</strong> ${dataUrl.length}
          </div>
        </div>

        <div class="image-info">
          <h3>Test Results</h3>
          <strong>Image Type:</strong> ${imageType}<br>
          <strong>Original Size:</strong> ${buffer.byteLength} bytes<br>
          <strong>Base64 Size:</strong> ${base64.length} characters<br>
          <strong>Data URL Size:</strong> ${dataUrl.length} characters<br>
          <strong>Compression Ratio:</strong> ${((base64.length / buffer.byteLength) * 100).toFixed(1)}%
        </div>
      </body>
      </html>
    `;

    return res.status(200).json({
      success: true,
      imageType,
      contentType,
      originalSize: buffer.byteLength,
      base64Length: base64.length,
      dataUrlLength: dataUrl.length,
      testHtml,
      message: `Successfully processed ${imageType} image`
    });

  } catch (err) {
    console.error('Image type test error:', err);
    res.status(500).json({ 
      error: 'Test failed', 
      details: err instanceof Error ? err.message : err 
    });
  }
}
