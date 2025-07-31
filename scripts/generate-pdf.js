import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFGenerator {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        try {
            console.log('🚀 Initializing Puppeteer browser...');
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });
            
            this.page = await this.browser.newPage();
            
            // Set viewport for consistent rendering
            await this.page.setViewport({
                width: 1200,
                height: 800,
                deviceScaleFactor: 1
            });
            
            console.log('✅ Browser initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize browser:', error);
            throw error;
        }
    }

    async loadTemplate(templatePath) {
        try {
            console.log(`📄 Loading template from: ${templatePath}`);
            const templateContent = await fs.readFile(templatePath, 'utf-8');
            return templateContent;
        } catch (error) {
            console.error('❌ Failed to load template:', error);
            throw error;
        }
    }

    compileTemplate(templateContent) {
        try {
            console.log('🔧 Compiling Handlebars template...');
            const template = Handlebars.compile(templateContent);
            console.log('✅ Template compiled successfully');
            return template;
        } catch (error) {
            console.error('❌ Failed to compile template:', error);
            throw error;
        }
    }

    async generateHTML(template, data) {
        try {
            console.log('📝 Generating HTML with data...');
            
            // Add generation date to the data
            const enrichedData = {
                ...data,
                generation_date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            };
            
            const html = template(enrichedData);
            console.log('✅ HTML generated successfully');
            return html;
        } catch (error) {
            console.error('❌ Failed to generate HTML:', error);
            throw error;
        }
    }

    async generatePDF(html, outputPath) {
        try {
            console.log('🖨️  Generating PDF...');
            
            // Set content and wait for network idle
            await this.page.setContent(html, {
                waitUntil: ['networkidle0', 'domcontentloaded']
            });
            
            // Generate PDF with optimized settings
            const pdfBuffer = await this.page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0.5in',
                    right: '0.5in',
                    bottom: '0.5in',
                    left: '0.5in'
                },
                displayHeaderFooter: false,
                preferCSSPageSize: true
            });
            
            // Write PDF to file
            await fs.writeFile(outputPath, pdfBuffer);
            console.log(`✅ PDF generated successfully: ${outputPath}`);
            
            return outputPath;
        } catch (error) {
            console.error('❌ Failed to generate PDF:', error);
            throw error;
        }
    }

    async cleanup() {
        try {
            if (this.browser) {
                await this.browser.close();
                console.log('🧹 Browser closed successfully');
            }
        } catch (error) {
            console.error('❌ Failed to cleanup browser:', error);
        }
    }

    async generateTermSheet(data, outputPath = 'term-sheet.pdf') {
        let generator = null;
        
        try {
            // Initialize the generator
            generator = new PDFGenerator();
            await generator.initialize();
            
            // Load and compile template
            const templatePath = path.join(__dirname, '..', 'templates', 'dscr-term-sheet.html');
            const templateContent = await generator.loadTemplate(templatePath);
            const template = generator.compileTemplate(templateContent);
            
            // Generate HTML with data
            const html = await generator.generateHTML(template, data);
            
            // Generate PDF
            const pdfPath = await generator.generatePDF(html, outputPath);
            
            return pdfPath;
            
        } catch (error) {
            console.error('❌ PDF generation failed:', error);
            throw error;
        } finally {
            if (generator) {
                await generator.cleanup();
            }
        }
    }
}

// Sample data for testing
const sampleData = {
    "program": "Program A",
    "borrower_name": "Chris Lesnik",
    "guarantor_name": "Brrrr Capital LLC",
    "loan_amount": "$235,000",
    "interest_rate": "8.25%",
    "loan_term": "30 Years",
    "property_address": "123 Someplace Ave, Philadelphia, PA 19103",
    "property_type": "SFR",
    "appraised_value": "$312,000",
    "ltv": "75%",
    "fico_score": "710",
    "loan_purpose": "Purchase",
    "prepayment_penalty": "3-year stepdown",
    "lender_fee": "$4,700",
    "title_fee": "$1,250",
    "recording_fee": "$95",
    "dscr": "1.21",
    "loan_proceeds": "$230,000",
    "cash_to_close": "$5,000",
    "total_sources": "$235,000",
    "total_uses": "$235,000"
};

// Main execution function
async function main() {
    const generator = new PDFGenerator();
    
    try {
        console.log('🎯 Starting PDF generation process...');
        
        // Check if custom data file is provided
        const args = process.argv.slice(2);
        let data;
        
        if (args.length > 0) {
            // Load data from file
            const dataPath = args[0];
            console.log(`📊 Loading data from: ${dataPath}`);
            const dataContent = await fs.readFile(dataPath, 'utf-8');
            data = JSON.parse(dataContent);
        } else {
            // Use sample data
            console.log('📊 Using sample data');
            data = sampleData;
        }
        
        // Generate PDF
        const outputPath = args.length > 1 ? args[1] : 'term-sheet.pdf';
        const pdfPath = await generator.generateTermSheet(data, outputPath);
        
        console.log(`🎉 PDF generation completed successfully!`);
        console.log(`📁 Output file: ${pdfPath}`);
        
    } catch (error) {
        console.error('💥 PDF generation failed:', error);
        process.exit(1);
    }
}

// Export for use as module
export { PDFGenerator, sampleData };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
} 