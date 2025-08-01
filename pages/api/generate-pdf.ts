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
    const defaultLogoUrl = 'https://yvykefnhoxuvovczsucw.supabase.co/storage/v1/object/public/documint-uploads//brrrr-loans-logo-mark-gradient-orange-light-909%20(1).png';
    const logoUrl = req.body.logo || defaultLogoUrl;
    html = html.replace(/\{\{\s*logo_url\s*\}\}/g, logoUrl);

    // 3. Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
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