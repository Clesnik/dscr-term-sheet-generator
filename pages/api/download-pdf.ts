import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== PDF DOWNLOAD GENERATION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Read HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'dscr-term-sheet.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // 1. FORCE LOGO URL - Use the logo_url from request or fallback
    let logoUrl = req.body.logo_url || 'https://yvykefnhoxuvovczsucw.supabase.co/storage/v1/object/public/documint-uploads/Full%20Mark%20-%20Loans%20-%20Orange%20-%2020230622%20-%20Smashed%20Media.svg';
    
    console.log('FORCING LOGO URL:', logoUrl);
    
    // FORCE LOGO WITH SIMPLE HTML APPROACH
    let embeddedLogo = '';
    try {
      console.log('FETCHING LOGO FOR SIMPLE HTML EMBEDDING...');
      const logoResponse = await fetch(logoUrl);
      if (logoResponse.ok) {
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoBase64 = Buffer.from(logoBuffer).toString('base64');
        const contentType = logoResponse.headers.get('content-type') || 'image/svg+xml';
        embeddedLogo = `<img src="data:${contentType};base64,${logoBase64}" alt="Logo" style="max-width: 200px; max-height: 100px; display: block !important; visibility: visible !important; opacity: 1 !important;">`;
        console.log('LOGO CONVERTED TO BASE64 IMG TAG!');
      } else {
        console.log('FAILED TO FETCH LOGO, USING FALLBACK');
        embeddedLogo = `<div style="background: orange; color: black; padding: 10px; font-weight: bold; max-width: 200px;">BRRRR LOANS</div>`;
      }
    } catch (error) {
      console.log('ERROR FETCHING LOGO:', error);
      embeddedLogo = `<div style="background: orange; color: black; padding: 10px; font-weight: bold; max-width: 200px;">BRRRR LOANS</div>`;
    }

    // 2. FORCE REPLACE LOGO_URL FIRST - NO EXCEPTIONS
    console.log('FORCING LOGO REPLACEMENT WITH EMBEDDED LOGO');
    html = html.replace(/\{\{\s*logo_url\s*\}\}/g, embeddedLogo);
    console.log('Logo replacement result:', html.includes('{{ logo_url }}') ? 'FAILED' : 'SUCCESS');

    // 3. Replace ALL placeholders
    for (const [key, value] of Object.entries(req.body)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        const replacement = String(value ?? '');
        html = html.replace(regex, replacement);
        console.log(`Replaced ${key}: ${replacement}`);
    }

    // 4. Generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
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

    // Send response with download headers
    const buffer = Buffer.from(pdfBuffer);
    console.log('PDF generated successfully, size:', buffer.length);
    console.log('=== PDF DOWNLOAD GENERATION END ===');
    
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
