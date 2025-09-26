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
    let logoUrl = req.body.logo_url || 'https://yvykefnhoxuvovczsucw.supabase.co/storage/v1/object/public/documint-uploads/Full Mark - Loans - Orange - 20230622 - Smashed Media.svg';
    
    // Try to fetch the logo and convert to base64
    try {
      console.log('Fetching logo from:', logoUrl);
      const logoResponse = await fetch(logoUrl);
      if (logoResponse.ok) {
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoBase64 = Buffer.from(logoBuffer).toString('base64');
        const contentType = logoResponse.headers.get('content-type') || 'image/svg+xml';
        
        console.log('Logo content type:', contentType);
        
        // Always use base64 for all image types - this is more reliable
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
    
    // Handle logo_url fallback if it wasn't processed in the loop
    if (html.includes('{{ logo_url }}')) {
      console.log('logo_url not found in request body, using fallback');
      html = html.replace(/\{\{\s*logo_url\s*\}\}/g, logoUrl);
    }

    console.log('Final HTML logo_url replacement:', html.includes('logo_url') ? 'FAILED' : 'SUCCESS');
    
    // Debug: Check if logo_url placeholder still exists
    const logoPlaceholderCount = (html.match(/\{\{\s*logo_url\s*\}\}/g) || []).length;
    console.log('Remaining logo_url placeholders:', logoPlaceholderCount);
    
    // Debug: Show a snippet of the HTML around the logo
    const logoIndex = html.indexOf('logo_url');
    if (logoIndex !== -1) {
      const snippet = html.substring(Math.max(0, logoIndex - 50), logoIndex + 50);
      console.log('HTML snippet around logo_url:', snippet);
    }
    
    // Auto-adjust font size for long labels to prevent wrapping - AGGRESSIVE APPROACH
    console.log('Starting font size adjustment for labels...');
    
    // Handle span-based labels
    html = html.replace(/<span class="data-label">([^<]+)<\/span>/g, (match, labelText) => {
      const length = labelText.length;
      let fontSize = 12;
      
      if (length > 60) fontSize = 8;
      else if (length > 50) fontSize = 9;
      else if (length > 40) fontSize = 10;
      else if (length > 35) fontSize = 11;
      
      console.log(`Label: "${labelText}" (${length} chars) -> ${fontSize}px`);
      return `<span class="data-label" style="font-size: ${fontSize}px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; max-width: 70% !important;">${labelText}</span>`;
    });
    
    // Handle table cell labels (for credits/debits sections)
    html = html.replace(/(<td[^>]*style="[^"]*color: [^"]*; padding: [^"]*; background-color: [^"]*;">)([^<]+)(<\/td>)/g, (match, startTag, labelText, endTag) => {
      const length = labelText.length;
      let fontSize = 12;
      
      if (length > 60) fontSize = 8;
      else if (length > 50) fontSize = 9;
      else if (length > 40) fontSize = 10;
      else if (length > 35) fontSize = 11;
      
      console.log(`Table Label: "${labelText}" (${length} chars) -> ${fontSize}px`);
      return `${startTag}${labelText}${endTag}`.replace(/style="([^"]*)"/, `style="$1; font-size: ${fontSize}px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;"`);
    });
    
    // Also handle any td elements that might contain labels
    html = html.replace(/(<td[^>]*>)([^<]+)(<\/td>)/g, (match, startTag, content, endTag) => {
      // Only process if it looks like a label (not a value with $ or numbers)
      if (content.includes('$') || /^\s*[\d,]+\.?\d*\s*$/.test(content.trim())) {
        return match; // Skip values
      }
      
      const length = content.length;
      if (length < 10) return match; // Skip short content
      
      let fontSize = 12;
      if (length > 60) fontSize = 8;
      else if (length > 50) fontSize = 9;
      else if (length > 40) fontSize = 10;
      else if (length > 35) fontSize = 11;
      
      console.log(`Generic Label: "${content}" (${length} chars) -> ${fontSize}px`);
      return startTag.replace(/style="([^"]*)"/, `style="$1; font-size: ${fontSize}px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;"`) + content + endTag;
    });

    // 4. Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--disable-features=VizDisplayCompositor',
        '--enable-features=NetworkService',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
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
        return Array.from(images).every(img => {
          // For data URLs, check if the image is loaded
          if (img.src.startsWith('data:')) {
            return img.complete && img.naturalWidth > 0;
          }
          // For external URLs, just check if complete
          return img.complete;
        });
      }, { timeout: 10000 });
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