import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;

    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'dscr-term-sheet.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Compile the template with Handlebars
    const template = Handlebars.compile(templateContent);
    const html = template(data);

    // Launch Puppeteer
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdf = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    await browser.close();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=term-sheet.pdf');
    res.setHeader('Content-Length', pdf.length.toString());

    // Send the PDF
    res.send(pdf);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 