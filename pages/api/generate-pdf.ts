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
    // 1. Read the HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'dscr-term-sheet.html');
    let html = await fs.readFile(templatePath, 'utf8');

    // 2. Replace placeholders in the template with request data
    for (const [key, value] of Object.entries(req.body)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      html = html.replace(regex, String(value ?? ''));
    }

    // 3. Handle logo fallback
    const defaultLogoUrl = 'https://yvykefnhoxuvovczsucw.supabase.co/storage/v1/object/public/documint-uploads/brrrr-loans-logo-light.svg';
    const logoUrl = req.body.logo_url || defaultLogoUrl;
    console.log('Logo URL being used:', logoUrl);
    html = html.replace(/\{\{\s*logo_url\s*\}\}/g, logoUrl);

    // 4. Handle program color fallback
    const defaultProgramColor = '#F6AE35';
    const programColor = req.body.program_color || defaultProgramColor;
    html = html.replace(/\{\{\s*program_color\s*\}\}/g, programColor);

    // 3. Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--allow-running-insecure-content']
    });
    const page = await browser.newPage();
    
    // Enable images and set user agent for better compatibility
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.setContent(html);
    
    // Wait for images to load and check if logo is present
    await page.waitForTimeout(2000);
    
    // Check if the logo image is loaded
    const logoElement = await page.$('img[src*="supabase"]');
    if (logoElement) {
      const isVisible = await logoElement.isVisible();
      const src = await logoElement.getAttribute('src');
      console.log('Logo found:', { src, isVisible });
    } else {
      console.log('No logo element found');
    }
    
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

    // 4. Convert to real Buffer and send the PDF as a file
    const buffer = Buffer.from(pdfBuffer);
    console.log('PDF buffer type:', typeof buffer, 'isBuffer:', Buffer.isBuffer(buffer), 'length:', buffer.length);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=term-sheet.pdf');
    res.setHeader('Content-Length', buffer.length.toString());
    res.status(200).end(buffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF', details: err instanceof Error ? err.message : err, stack: err instanceof Error ? err.stack : undefined });
  }
} 