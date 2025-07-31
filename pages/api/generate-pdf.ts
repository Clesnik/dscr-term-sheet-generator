import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Incoming request body:', req.body); // <-- Log incoming data
    const data = req.body;

    // Validate required data
    if (!data || typeof data !== 'object') {
      console.error('Invalid request body:', data); // <-- Log invalid data
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'dscr-term-sheet.html');
    
    if (!fs.existsSync(templatePath)) {
      console.error('Template file not found:', templatePath);
      return res.status(500).json({ error: 'Template file not found' });
    }

    let templateContent: string;
    try {
      templateContent = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error('Error reading template file:', error);
      return res.status(500).json({ error: 'Error reading template file' });
    }

    // Compile the template with Handlebars
    let template: HandlebarsTemplateDelegate;
    let html: string;
    
    try {
      template = Handlebars.compile(templateContent);
      html = template(data);
    } catch (error) {
      console.error('Error compiling template:', error);
      return res.status(500).json({ error: 'Error compiling template' });
    }

    // Launch Puppeteer with additional options for Vercel
    let browser;
    try {
      browser = await puppeteer.launch({ 
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
      });
    } catch (error) {
      console.error('Error launching Puppeteer:', error);
      return res.status(500).json({ error: 'Error launching browser', details: error instanceof Error ? error.message : 'Unknown error' });
    }

    let page;
    try {
      page = await browser.newPage();
      
      // Set viewport and content
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
    } catch (error) {
      console.error('Error setting up page:', error);
      await browser.close();
      return res.status(500).json({ error: 'Error setting up page' });
    }
    
    // Generate PDF with optimized settings
    let pdf: Buffer;
    try {
      pdf = await page.pdf({ 
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      await browser.close();
      return res.status(500).json({ error: 'Error generating PDF' });
    }

    try {
      await browser.close();
    } catch (error) {
      console.error('Error closing browser:', error);
      // Continue anyway since we have the PDF
    }

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