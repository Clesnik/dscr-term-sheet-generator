import express from 'express';
import { PDFGenerator } from '../../scripts/generate-pdf.js';
import { z } from 'zod';

const router = express.Router();

// Validation schema for loan data
const LoanDataSchema = z.object({
  program: z.string(),
  borrower_name: z.string(),
  guarantor_name: z.string(),
  loan_amount: z.string(),
  interest_rate: z.string(),
  loan_term: z.string(),
  street_address: z.string(),
  city_state_zip: z.string(),
  property_type: z.string(),
  appraised_value: z.string(),
  ltv: z.string(),
  fico_score: z.string(),
  loan_purpose: z.string(),
  prepayment_penalty: z.string(),
  lender_fee: z.string(),
  title_fee: z.string(),
  recording_fee: z.string(),
  dscr: z.string(),
  loan_proceeds: z.string(),
  cash_to_close: z.string(),
  total_sources: z.string(),
  total_uses: z.string()
});

// POST endpoint to generate PDF
router.post('/generate-term-sheet', async (req, res) => {
  try {
    // Validate request body
    const validatedData = LoanDataSchema.parse(req.body);
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `term-sheet-${timestamp}.pdf`;
    const outputPath = `./public/generated/${filename}`;
    
    // Ensure output directory exists
    const fs = await import('fs/promises');
    const path = await import('path');
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate PDF
    const generator = new PDFGenerator();
    const pdfPath = await generator.generateTermSheet(validatedData, outputPath);
    
    // Return success response with file info
    res.json({
      success: true,
      message: 'PDF generated successfully',
      filename: filename,
      downloadUrl: `/generated/${filename}`,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET endpoint to download generated PDF
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `./public/generated/${filename}`;
    
    // Check if file exists
    const fs = await import('fs/promises');
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
    const { createReadStream } = await import('fs');
    const stream = createReadStream(filePath);
    stream.pipe(res);
    
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download PDF',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET endpoint to preview generated PDF (inline)
router.get('/preview/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `./public/generated/${filename}`;
    
    // Check if file exists
    const fs = await import('fs/promises');
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }
    
    // Set headers for PDF preview
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Stream the file
    const { createReadStream } = await import('fs');
    const stream = createReadStream(filePath);
    stream.pipe(res);
    
  } catch (error) {
    console.error('PDF preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to preview PDF',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 