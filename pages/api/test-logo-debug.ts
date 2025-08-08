import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

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

    console.log('=== LOGO DEBUG START ===');
    console.log('Logo URL received:', logo_url);

    // Test 1: Check if URL is accessible
    let urlTest = { success: false, status: 0, contentType: '', error: '' };
    try {
      const response = await fetch(logo_url);
      urlTest = {
        success: response.ok,
        status: response.status,
        contentType: response.headers.get('content-type') || '',
        error: ''
      };
      console.log('URL test result:', urlTest);
    } catch (error) {
      urlTest.error = error instanceof Error ? error.message : 'Unknown error';
      console.log('URL test failed:', urlTest.error);
    }

    // Test 2: Create simple HTML with the logo
    const simpleHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Logo Test</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .logo-container { 
            border: 2px solid red; 
            padding: 10px; 
            margin: 10px 0; 
            text-align: center;
            min-height: 100px;
          }
          img { 
            max-width: 150px; 
            max-height: 80px; 
            object-fit: contain;
            border: 1px solid blue;
          }
        </style>
      </head>
      <body>
        <h1>Logo Debug Test</h1>
        <div class="logo-container">
          <p>Logo should appear below:</p>
          <img src="${logo_url}" alt="Test Logo" id="test-logo">
        </div>
        <div>
          <p>Logo URL: ${logo_url}</p>
          <p>URL Test: ${JSON.stringify(urlTest)}</p>
        </div>
      </body>
      </html>
    `;

    // Test 3: Generate PDF with just the logo
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    
    await page.setContent(simpleHtml);
    
    // Wait a bit for images
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check image status
    const imageStatus = await page.evaluate(() => {
      const img = document.getElementById('test-logo') as HTMLImageElement;
      if (!img) return { found: false };
      
      return {
        found: true,
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: img.width,
        height: img.height,
        style: {
          maxWidth: img.style.maxWidth,
          maxHeight: img.style.maxHeight,
          objectFit: img.style.objectFit
        }
      };
    });
    
    console.log('Image status:', imageStatus);
    
    // Generate PDF
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true
    });
    
    await browser.close();

    // Return results
    res.status(200).json({
      success: true,
      logo_url,
      urlTest,
      imageStatus,
      pdfSize: pdfBuffer.length,
      message: 'Debug test completed'
    });

  } catch (err) {
    console.error('Logo debug error:', err);
    res.status(500).json({ 
      error: 'Debug test failed', 
      details: err instanceof Error ? err.message : err 
    });
  }
}
