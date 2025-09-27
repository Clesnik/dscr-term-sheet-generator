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

    // 2. FORCE REPLACE LOGO_URL WITH HARDCODED SVG
    const hardcodedSvg = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 467.94 75.67" style="enable-background:new 0 0 467.94 75.67; max-width: 200px; max-height: 100px; display: block !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 9999 !important;" xml:space="preserve">
        <style type="text/css">
            .st0{fill:#F1561B;}
            .st1{fill:#0C0C0C;}
        </style>
        <g>
            <path class="st0" d="M348.81,53.03V20.25h2.99v30.09h15.62v2.69H348.81z"/>
            <path class="st0" d="M383.13,53.54c-2.12,0-4-0.54-5.63-1.62c-1.63-1.08-2.9-2.57-3.82-4.47c-0.92-1.9-1.38-4.11-1.38-6.6c0-2.52,0.46-4.74,1.38-6.65c0.92-1.92,2.19-3.41,3.82-4.48c1.63-1.07,3.5-1.61,5.63-1.61c2.12,0,4,0.54,5.62,1.62c1.62,1.08,2.89,2.57,3.82,4.48c0.92,1.91,1.38,4.12,1.38,6.64c0,2.5-0.46,4.7-1.38,6.6c-0.92,1.9-2.19,3.4-3.82,4.47C387.13,53,385.25,53.54,383.13,53.54z M383.13,50.93c1.71,0,3.15-0.46,4.34-1.38c1.18-0.92,2.08-2.14,2.7-3.67s0.92-3.21,0.92-5.04s-0.31-3.52-0.92-5.06c-0.61-1.54-1.51-2.77-2.7-3.7c-1.18-0.93-2.63-1.39-4.34-1.39c-1.7,0-3.14,0.46-4.33,1.39c-1.19,0.93-2.09,2.16-2.71,3.7c-0.61,1.54-0.92,3.22-0.92,5.06s0.31,3.52,0.92,5.04c0.61,1.53,1.51,2.75,2.7,3.67C379.98,50.47,381.42,50.93,383.13,50.93z"/>
            <path class="st0" d="M407.08,53.59c-1.48,0-2.84-0.29-4.07-0.87c-1.23-0.58-2.2-1.42-2.93-2.53c-0.73-1.1-1.09-2.45-1.09-4.03c0-1.22,0.23-2.24,0.69-3.07c0.46-0.83,1.11-1.52,1.95-2.05c0.84-0.53,1.84-0.95,2.99-1.26c1.15-0.31,2.42-0.55,3.81-0.72c1.38-0.17,2.54-0.32,3.5-0.45c0.96-0.13,1.68-0.33,2.19-0.61c0.5-0.28,0.75-0.73,0.75-1.34v-0.58c0-1.68-0.5-3-1.5-3.96c-1-0.97-2.43-1.45-4.3-1.45c-1.77,0-3.21,0.39-4.33,1.17c-1.12,0.78-1.9,1.7-2.35,2.75l-2.71-0.98c0.55-1.34,1.32-2.42,2.31-3.23c0.98-0.81,2.08-1.39,3.3-1.74s2.45-0.54,3.7-0.54c0.94,0,1.92,0.12,2.94,0.37c1.02,0.25,1.97,0.67,2.84,1.27c0.87,0.6,1.58,1.44,2.13,2.51c0.54,1.07,0.82,2.43,0.82,4.07v16.7h-2.85v-3.89h-0.18c-0.34,0.73-0.85,1.43-1.52,2.11c-0.67,0.68-1.52,1.24-2.53,1.68S408.44,53.59,407.08,53.59z M407.46,50.98c1.52,0,2.83-0.34,3.94-1.01c1.11-0.67,1.97-1.57,2.57-2.68c0.6-1.11,0.9-2.34,0.9-3.69v-3.55c-0.21,0.2-0.57,0.38-1.06,0.54c-0.5,0.16-1.07,0.3-1.71,0.42c-0.65,0.12-1.29,0.23-1.93,0.31c-0.64,0.09-1.22,0.16-1.73,0.22c-1.39,0.17-2.57,0.44-3.55,0.8c-0.98,0.36-1.73,0.86-2.26,1.5s-0.78,1.45-0.78,2.44c0,1.49,0.53,2.65,1.6,3.47C404.51,50.57,405.85,50.98,407.46,50.98z"/>
            <path class="st0" d="M428.14,37.66v15.37h-2.85V28.44h2.77v3.86h0.26c0.58-1.26,1.48-2.27,2.7-3.03c1.22-0.76,2.73-1.14,4.54-1.14c1.65,0,3.11,0.34,4.36,1.03s2.23,1.7,2.93,3.03c0.7,1.33,1.05,2.97,1.05,4.91v15.93h-2.85V37.28c0-2.02-0.56-3.61-1.69-4.79c-1.12-1.17-2.63-1.76-4.52-1.76c-1.29,0-2.44,0.28-3.44,0.83c-1,0.56-1.8,1.35-2.38,2.39C428.43,35,428.14,36.23,428.14,37.66z"/>
            <path class="st0" d="M467.94,33.84l-2.61,0.74c-0.26-0.74-0.62-1.4-1.09-2s-1.08-1.07-1.83-1.42c-0.75-0.35-1.68-0.53-2.79-0.53c-1.66,0-3.03,0.4-4.1,1.18c-1.07,0.79-1.6,1.81-1.6,3.06c0,1.06,0.37,1.91,1.1,2.57c0.73,0.66,1.86,1.18,3.38,1.56l3.71,0.91c2.06,0.5,3.6,1.3,4.63,2.39c1.03,1.09,1.54,2.45,1.54,4.1c0,1.39-0.38,2.62-1.15,3.7c-0.77,1.08-1.84,1.92-3.21,2.54c-1.37,0.61-2.96,0.92-4.76,0.92c-2.4,0-4.38-0.54-5.94-1.62c-1.56-1.08-2.56-2.65-2.99-4.7l2.74-0.67c0.35,1.46,1.04,2.57,2.07,3.31s2.39,1.12,4.07,1.12c1.89,0,3.4-0.42,4.53-1.27c1.13-0.85,1.7-1.91,1.7-3.19c0-0.99-0.33-1.83-0.99-2.5s-1.67-1.18-3.01-1.5l-4.02-0.96c-2.13-0.51-3.71-1.32-4.74-2.43s-1.54-2.49-1.54-4.13c0-1.35,0.37-2.55,1.11-3.58c0.74-1.03,1.75-1.84,3.04-2.42s2.76-0.88,4.42-0.88c2.25,0,4.05,0.51,5.4,1.53S467.34,32.05,467.94,33.84z"/>
        </g>
        <g>
            <g>
                <g>
                    <g>
                        <path class="st1" d="M24.65,62.69c-13.71,0-24.85-11.15-24.85-24.85s11.15-24.85,24.85-24.85S49.5,24.13,49.5,37.84S38.35,62.69,24.65,62.69z M24.65,14.98c-12.6,0-22.85,10.25-22.85,22.85s10.25,22.85,22.85,22.85S47.5,50.44,47.5,37.84S37.25,14.98,24.65,14.98z"/>
                    </g>
                </g>
            </g>
            <g>
                <g>
                    <g>
                        <g>
                            <path class="st1" d="M16.22,49.95V25.72h8.47c1.69,0,3.08,0.29,4.18,0.87c1.1,0.58,1.91,1.36,2.45,2.33c0.54,0.97,0.8,2.05,0.8,3.24c0,1.04-0.18,1.9-0.55,2.58c-0.37,0.68-0.85,1.21-1.44,1.61s-1.24,0.69-1.93,0.88v0.24c0.74,0.05,1.49,0.31,2.24,0.78c0.75,0.47,1.38,1.15,1.88,2.04c0.5,0.88,0.76,1.96,0.76,3.24c0,1.21-0.28,2.31-0.83,3.28c-0.55,0.97-1.42,1.74-2.62,2.31c-1.19,0.57-2.74,0.85-4.65,0.85H16.22z M19.16,36.37h5.44c0.88,0,1.68-0.17,2.4-0.52c0.71-0.35,1.28-0.84,1.7-1.47c0.42-0.63,0.63-1.37,0.63-2.22c0-1.06-0.37-1.97-1.11-2.72c-0.74-0.75-1.92-1.12-3.53-1.12h-5.54V36.37z M19.16,47.35h5.82c1.92,0,3.28-0.37,4.09-1.12c0.81-0.75,1.21-1.65,1.21-2.72c0-0.82-0.21-1.58-0.63-2.28c-0.42-0.7-1.01-1.26-1.79-1.68c-0.77-0.42-1.69-0.63-2.75-0.63h-5.96V47.35z"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
        <g>
            <g>
                <g>
                    <g>
                        <path class="st1" d="M81.27,62.69c-13.71,0-24.85-11.15-24.85-24.85s11.15-24.85,24.85-24.85s24.85,11.15,24.85,24.85S94.98,62.69,81.27,62.69z M81.27,14.98c-12.6,0-22.85,10.25-22.85,22.85s10.25,22.85,22.85,22.85s22.85-10.25,22.85-22.85S93.87,14.98,81.27,14.98z"/>
                    </g>
                </g>
            </g>
            <g>
                <g>
                    <g>
                        <g>
                            <path class="st1" d="M72.58,49.95V25.72h8.19c1.89,0,3.45,0.32,4.66,0.96c1.21,0.64,2.11,1.52,2.7,2.64c0.58,1.12,0.88,2.39,0.88,3.82c0,1.43-0.29,2.69-0.88,3.8s-1.48,1.97-2.69,2.6s-2.75,0.94-4.63,0.94h-6.63v-2.65h6.53c1.29,0,2.34-0.19,3.13-0.57s1.37-0.92,1.73-1.62s0.54-1.53,0.54-2.5c0-0.97-0.18-1.82-0.54-2.54s-0.94-1.29-1.74-1.69s-1.85-0.6-3.16-0.6h-5.16v21.63H72.58z M83.99,39.07l5.96,10.89h-3.41l-5.87-10.89H83.99z"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
        <g>
            <g>
                <g>
                    <g>
                        <path class="st1" d="M137.78,62.69c-13.71,0-24.85-11.15-24.85-24.85s11.15-24.85,24.85-24.85s24.85,11.15,24.85,24.85S151.49,62.69,137.78,62.69z M137.78,14.98c-12.6,0-22.85,10.25-22.85,22.85s10.25,22.85,22.85,22.85s22.85-10.25,22.85-22.85S150.39,14.98,137.78,14.98z"/>
                    </g>
                </g>
            </g>
            <g>
                <g>
                    <g>
                        <g>
                            <path class="st1" d="M129.1,49.95V25.72h8.19c1.89,0,3.45,0.32,4.66,0.96c1.21,0.64,2.11,1.52,2.7,2.64c0.58,1.12,0.88,2.39,0.88,3.82c0,1.43-0.29,2.69-0.88,3.8s-1.48,1.97-2.69,2.6s-2.75,0.94-4.63,0.94h-6.63v-2.65h6.53c1.29,0,2.34-0.19,3.13-0.57s1.37-0.92,1.73-1.62s0.54-1.53,0.54-2.5c0-0.97-0.18-1.82-0.54-2.54s-0.94-1.29-1.74-1.69s-1.85-0.6-3.16-0.6h-5.16v21.63H129.1z M140.51,39.07l5.96,10.89h-3.41l-5.87-10.89H140.51z"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
        <g>
            <g>
                <g>
                    <g>
                        <path class="st1" d="M194.3,62.69c-13.71,0-24.85-11.15-24.85-24.85s11.15-24.85,24.85-24.85s24.85,11.15,24.85,24.85S208.01,62.69,194.3,62.69z M194.3,14.98c-12.6,0-22.85,10.25-22.85,22.85s10.25,22.85,22.85,22.85s22.85-10.25,22.85-22.85S206.9,14.98,194.3,14.98z"/>
                    </g>
                </g>
            </g>
            <g>
                <g>
                    <g>
                        <g>
                            <path class="st1" d="M185.61,49.95V25.72h8.19c1.89,0,3.45,0.32,4.66,0.96c1.21,0.64,2.11,1.52,2.7,2.64c0.58,1.12,0.88,2.39,0.88,3.82c0,1.43-0.29,2.69-0.88,3.8s-1.48,1.97-2.69,2.6s-2.75,0.94-4.63,0.94h-6.63v-2.65h6.53c1.29,0,2.34-0.19,3.13-0.57s1.37-0.92,1.73-1.62s0.54-1.53,0.54-2.5c0-0.97-0.18-1.82-0.54-2.54s-0.94-1.29-1.74-1.69s-1.85-0.6-3.16-0.6h-5.16v21.63H185.61z M197.02,39.07l5.96,10.89h-3.41l-5.87-10.89H197.02z"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
        <g>
            <g>
                <g>
                    <g>
                        <path class="st1" d="M250.82,62.69c-13.71,0-24.85-11.15-24.85-24.85s11.15-24.85,24.85-24.85c13.71,0,24.85,11.15,24.85,24.85S264.52,62.69,250.82,62.69z M250.82,14.98c-12.6,0-22.85,10.25-22.85,22.85s10.25,22.85,22.85,22.85c12.6,0,22.85-10.25,22.85-22.85S263.42,14.98,250.82,14.98z"/>
                    </g>
                </g>
            </g>
            <g>
                <g>
                    <g>
                        <g>
                            <path class="st1" d="M256.57,49.95V28.32h-5.16c-1.31,0-2.36,0.2-3.16,0.6s-1.38,0.96-1.74,1.69s-0.54,1.57-0.54,2.54c0,0.97,0.18,1.8,0.54,2.5s0.93,1.24,1.73,1.62s1.84,0.57,3.13,0.57h6.53v2.65h-6.63c-1.88,0-3.42-0.31-4.63-0.94s-2.1-1.49-2.69-2.6s-0.88-2.37-0.88-3.8c0-1.43,0.29-2.7,0.88-3.82c0.58-1.12,1.48-2,2.7-2.64c1.21-0.64,2.77-0.96,4.66-0.96h8.19v24.23H256.57z M251.41,39.07l-5.87,10.89h-3.41l5.96-10.89H251.41z"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
        <g>
            <g>
                <g>
                    <path class="st1" d="M281.58,25.18c-0.7,0-1.36-0.13-1.97-0.39c-0.61-0.26-1.15-0.63-1.62-1.09s-0.83-1-1.09-1.62c-0.26-0.61-0.39-1.27-0.39-1.97s0.13-1.36,0.39-1.97s0.62-1.15,1.09-1.62s1-0.83,1.62-1.09s1.27-0.39,1.97-0.39s1.36,0.13,1.97,0.39c0.61,0.26,1.15,0.62,1.62,1.09s0.83,1,1.09,1.62c0.26,0.61,0.39,1.27,0.39,1.97s-0.13,1.36-0.39,1.97c-0.26,0.61-0.63,1.15-1.09,1.62s-1,0.83-1.62,1.09C282.94,25.05,282.28,25.18,281.58,25.18z M281.58,24.78c0.86,0,1.65-0.21,2.35-0.63c0.71-0.42,1.27-0.98,1.69-1.69c0.42-0.71,0.63-1.49,0.63-2.35c0-0.86-0.21-1.65-0.63-2.35c-0.42-0.71-0.98-1.27-1.69-1.69c-0.71-0.42-1.49-0.63-2.35-0.63c-0.86,0-1.64,0.21-2.35,0.63c-0.71,0.42-1.27,0.98-1.69,1.69c-0.42,0.71-0.63,1.49-0.63,2.35c0,0.86,0.21,1.64,0.63,2.35c0.42,0.71,0.98,1.27,1.69,1.69C279.94,24.57,280.72,24.78,281.58,24.78z M279.97,22.39v-4.68h2c0.32,0,0.59,0.06,0.81,0.18c0.22,0.12,0.39,0.29,0.51,0.49s0.17,0.45,0.17,0.72s-0.06,0.51-0.17,0.73s-0.29,0.38-0.51,0.51c-0.22,0.12-0.49,0.19-0.81,0.19h-1.79v-0.41h1.78c0.37,0,0.64-0.09,0.83-0.28c0.18-0.18,0.28-0.43,0.28-0.74c0-0.31-0.09-0.56-0.28-0.73c-0.18-0.17-0.46-0.26-0.83-0.26h-1.58v4.27H279.97z M282.51,20.29l1.15,2.1h-0.47l-1.13-2.1H282.51z"/>
                    </g>
                </g>
            </g>
        </g>
        <g>
            <g>
                <rect x="313.82" y="0" class="st1" width="2" height="75.67"/>
            </g>
        </g>
    </svg>`;
    
    console.log('FORCING LOGO REPLACEMENT WITH HARDCODED SVG');
    html = html.replace(/\{\{\s*logo_url\s*\}\}/g, hardcodedSvg);
    console.log('Logo replacement result:', html.includes('{{ logo_url }}') ? 'FAILED' : 'SUCCESS');

    // 3. Replace ALL placeholders (logo is hardcoded, no logo_url processing needed)
    for (const [key, value] of Object.entries(req.body)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        const replacement = String(value ?? '');
        console.log(`Replacing ${key} with: ${replacement}`);
        html = html.replace(regex, replacement);
    }

    // 5. Handle fallbacks for missing values
    const defaultProgramColor = '#F6AE35';
    html = html.replace(/\{\{\s*program_color\s*\}\}/g, defaultProgramColor);

    console.log('Final HTML logo_url replacement:', html.includes('logo_url') ? 'FAILED' : 'SUCCESS');
    
    // Debug: Log the actual logo URL being used
    // Logo is hardcoded in template - no URL needed
    
    // Debug: Check if logo_url placeholder still exists
    const logoPlaceholderCount = (html.match(/\{\{\s*logo_url\s*\}\}/g) || []).length;
    console.log('Logo placeholder count after processing:', logoPlaceholderCount);
    
    // Debug: Check if the logo is actually in the HTML
    const logoInHtml = html.includes('data:image') || html.includes('https://');
    console.log('Logo URL found in HTML:', logoInHtml);
    
    // Debug: Log a snippet of the HTML around the logo
    const logoMatch = html.match(/<img[^>]*src="[^"]*"[^>]*>/i);
    console.log('Logo img tag in HTML:', logoMatch ? logoMatch[0] : 'NOT FOUND');
    
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