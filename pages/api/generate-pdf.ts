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
    console.log('=== PDF GENERATION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // 1. Read the HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'dscr-term-sheet.html');
    let html = await fs.readFile(templatePath, 'utf8');

    // 2. Handle logo URL - convert to base64 if possible
    let logoUrl = req.body.logo_url || 'https://yvykefnhoxuvovczsucw.supabase.co/storage/v1/object/public/documint-uploads/brrrr-loans-logo-light.svg';
    
    // Try to fetch the logo and convert to base64
    try {
      console.log('Fetching logo from:', logoUrl);
      const logoResponse = await fetch(logoUrl);
      if (logoResponse.ok) {
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoBase64 = Buffer.from(logoBuffer).toString('base64');
        const contentType = logoResponse.headers.get('content-type') || 'image/svg+xml';
        logoUrl = `data:${contentType};base64,${logoBase64}`;
        console.log('Logo converted to base64, length:', logoBase64.length);
      } else {
        console.log('Failed to fetch logo, using original URL');
      }
    } catch (error) {
      console.log('Error fetching logo, using original URL:', error);
    }

    // 3. Replace ALL placeholders including logo_url
    for (const [key, value] of Object.entries(req.body)) {
      if (key === 'logo_url') {
        // Handle logo_url specially
        const regex = new RegExp(`{{\\s*logo_url\\s*}}`, 'g');
        console.log(`Replacing logo_url with base64 data URL`);
        html = html.replace(regex, logoUrl);
      } else {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        const replacement = String(value ?? '');
        console.log(`Replacing ${key} with: ${replacement}`);
        html = html.replace(regex, replacement);
      }
    }

    // 4. Handle fallbacks for missing values
    const defaultProgramColor = '#F6AE35';
    html = html.replace(/\{\{\s*program_color\s*\}\}/g, defaultProgramColor);

    console.log('Final HTML logo_url replacement:', html.includes('logo_url') ? 'FAILED' : 'SUCCESS');

    // 4. Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1200, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Set content and wait for network idle
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Wait for images to load using a different approach
    try {
      await page.waitForFunction(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete && img.naturalWidth > 0);
      }, { timeout: 5000 });
    } catch (error) {
      console.log('Timeout waiting for images, continuing anyway');
    }
    
    // Debug: Log all images
    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete
      }));
    });
    console.log('Images found:', images);

    // Generate PDF
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.25in',
        right: '0.25in',
        bottom: '0in',
        left: '0.25in'
      }
    });

    await browser.close();

    // Send response
    const buffer = Buffer.from(pdfBuffer);
    console.log('PDF generated successfully, size:', buffer.length);
    console.log('=== PDF GENERATION END ===');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=term-sheet.pdf');
    res.setHeader('Content-Length', buffer.length.toString());
    res.status(200).end(buffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: err instanceof Error ? err.message : err, 
      stack: err instanceof Error ? err.stack : undefined 
    });
  }
} 