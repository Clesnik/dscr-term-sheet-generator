# DSCR Term Sheet PDF Generator

This project includes a production-ready PDF generation system that creates professional DSCR (Debt Service Coverage Ratio) term sheets from JSON data using HTML templates and Puppeteer.

## Features

- 🎨 Professional HTML/CSS template with responsive design
- 📊 JSON data injection using Handlebars templating
- 🖨️ High-quality PDF generation with Puppeteer
- ✅ Input validation using Zod
- 🚀 Production-ready error handling
- 📱 Print-optimized CSS
- 🔄 Express API integration
- 📁 File management and cleanup

## Installation

1. Install dependencies:
```bash
npm install
```

2. The following dependencies will be added:
- `puppeteer`: For PDF generation
- `handlebars`: For HTML templating

## Usage

### 1. Command Line Usage

Generate PDF using sample data:
```bash
npm run generate-pdf
```

Generate PDF using custom JSON file:
```bash
npm run generate-pdf sample-data.json
```

Generate PDF with custom output filename:
```bash
npm run generate-pdf sample-data.json my-term-sheet.pdf
```

### 2. Programmatic Usage

```javascript
import { PDFGenerator } from './scripts/generate-pdf.js';

const generator = new PDFGenerator();
const data = {
  "program": "Program A",
  "borrower_name": "John Doe",
  // ... other loan data
};

try {
  const pdfPath = await generator.generateTermSheet(data, 'output.pdf');
  console.log(`PDF generated: ${pdfPath}`);
} catch (error) {
  console.error('Generation failed:', error);
}
```

### 3. API Usage

The PDF generation is integrated into the Express server with the following endpoints:

#### Generate PDF
```bash
POST /api/pdf/generate-term-sheet
Content-Type: application/json

{
  "program": "Program A",
  "borrower_name": "John Doe",
  "guarantor_name": "ABC Capital LLC",
  "loan_amount": "$235,000",
  "interest_rate": "8.25%",
  "loan_term": "30 Years",
  "property_address": "123 Main St, Philadelphia, PA 19103",
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
}
```

Response:
```json
{
  "success": true,
  "message": "PDF generated successfully",
  "filename": "term-sheet-2024-01-15T10-30-45-123Z.pdf",
  "downloadUrl": "/generated/term-sheet-2024-01-15T10-30-45-123Z.pdf",
  "generatedAt": "2024-01-15T10:30:45.123Z"
}
```

#### Download PDF
```bash
GET /api/pdf/download/{filename}
```

#### Preview PDF
```bash
GET /api/pdf/preview/{filename}
```

## Data Schema

The JSON payload must include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `program` | string | Loan program name |
| `borrower_name` | string | Primary borrower name |
| `guarantor_name` | string | Guarantor entity name |
| `loan_amount` | string | Total loan amount (formatted) |
| `interest_rate` | string | Interest rate (formatted) |
| `loan_term` | string | Loan term duration |
| `property_address` | string | Property address |
| `property_type` | string | Property type (SFR, Multi-family, etc.) |
| `appraised_value` | string | Appraised property value |
| `ltv` | string | Loan-to-value ratio |
| `fico_score` | string | Borrower FICO score |
| `loan_purpose` | string | Purpose of loan |
| `prepayment_penalty` | string | Prepayment penalty terms |
| `lender_fee` | string | Lender origination fee |
| `title_fee` | string | Title insurance fee |
| `recording_fee` | string | Recording fee |
| `dscr` | string | Debt service coverage ratio |
| `loan_proceeds` | string | Net loan proceeds |
| `cash_to_close` | string | Cash required to close |
| `total_sources` | string | Total funding sources |
| `total_uses` | string | Total funding uses |

## Template Customization

The HTML template is located at `templates/dscr-term-sheet.html`. You can customize:

- **Styling**: Modify the CSS in the `<style>` section
- **Layout**: Adjust the HTML structure and grid layout
- **Fields**: Add or remove data fields by updating both the template and validation schema
- **Branding**: Update colors, fonts, and company information

### Adding New Fields

1. Add the field to the HTML template:
```html
<div class="data-item">
  <span class="data-label">New Field:</span>
  <span class="data-value">{{ new_field }}</span>
</div>
```

2. Update the validation schema in `server/routes/pdf.ts`:
```javascript
const LoanDataSchema = z.object({
  // ... existing fields
  new_field: z.string(),
});
```

3. Include the field in your JSON payload.

## Error Handling

The system includes comprehensive error handling for:

- **Invalid JSON data**: Returns 400 with validation errors
- **Template loading failures**: Logs and returns 500
- **PDF generation failures**: Logs and returns 500
- **File system errors**: Handles missing directories and permissions
- **Browser initialization failures**: Graceful cleanup and retry logic

## Performance Considerations

- **Browser reuse**: The PDFGenerator class manages browser instances efficiently
- **Memory management**: Proper cleanup of browser resources
- **File streaming**: Large PDFs are streamed rather than loaded into memory
- **Concurrent requests**: Each request gets its own browser instance

## Security

- **Input validation**: All data is validated using Zod schemas
- **File path sanitization**: Prevents directory traversal attacks
- **Content-Type headers**: Proper MIME type handling
- **Error message sanitization**: No sensitive information in error responses

## Troubleshooting

### Common Issues

1. **Puppeteer installation fails**:
   ```bash
   npm install puppeteer --unsafe-perm=true
   ```

2. **PDF generation fails on Linux**:
   - Ensure required dependencies are installed
   - Use Docker or containerized environment

3. **Template not found**:
   - Verify `templates/dscr-term-sheet.html` exists
   - Check file permissions

4. **Output directory issues**:
   - Ensure write permissions to `public/generated/`
   - Create directory if it doesn't exist

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=pdf-generator npm run generate-pdf
```

## Production Deployment

For production deployment:

1. **Docker**: Use the provided Dockerfile for containerized deployment
2. **Memory limits**: Monitor memory usage with concurrent PDF generation
3. **File cleanup**: Implement scheduled cleanup of old PDF files
4. **Monitoring**: Add logging and monitoring for PDF generation metrics
5. **CDN**: Serve generated PDFs through a CDN for better performance

## License

This project is part of the Spark Hub application. See the main project license for details. 