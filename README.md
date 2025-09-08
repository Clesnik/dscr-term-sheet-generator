# DSCR Term Sheet PDF Generator

A Node.js/Express API for generating professional DSCR (Debt Service Coverage Ratio) term sheet PDFs using Puppeteer and Handlebars templating. Updated for improved deployment.

## 🚀 Features

- **PDF Generation**: Convert HTML templates to PDF using Puppeteer
- **Dynamic Data Injection**: Use Handlebars templating to inject JSON data into HTML templates
- **RESTful API**: Generate, download, and preview PDFs via HTTP endpoints
- **Production Ready**: Error handling, validation, and proper file management
- **Customizable Templates**: Easy to modify HTML/CSS templates
- **Equal Column Layout**: Balanced two-column design for loan summary and closing statement

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dscr-term-sheet-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev:server
   ```

## 🎯 Usage

### Command Line Usage

Generate a PDF using the command line script:
```bash
npm run generate-pdf
```

### API Usage

#### Generate Term Sheet PDF
```bash
curl -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d @sample-data.json
```

#### Download Generated PDF
```bash
curl -O http://localhost:3000/api/pdf/download/<filename>
```

#### Preview PDF in Browser
```
http://localhost:3000/api/pdf/preview/<filename>
```

### Sample JSON Data Structure

```json
{
  "program": "Program A",
  "borrower_name": "Chris Lesnik",
  "guarantor_name": "Brrrr Capital LLC",
  "loan_amount": "$235,000",
  "interest_rate": "8.25%",
  "loan_term": "30 Years",
  "street_address": "123 Someplace Ave",
  "city_state_zip": "Philadelphia, PA 19103",
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

## 📁 Project Structure

```
├── server/
│   ├── index.ts              # Main Express server
│   ├── routes/
│   │   └── pdf.ts            # PDF generation API routes
│   └── node-build.ts         # Server build configuration
├── templates/
│   └── dscr-term-sheet.html  # HTML template for term sheets
├── scripts/
│   └── generate-pdf.js       # Command line PDF generator
├── public/
│   └── generated/            # Generated PDF storage
├── sample-data.json          # Sample data for testing
└── package.json              # Dependencies and scripts
```

## 🔧 API Endpoints

### POST `/api/pdf/generate-term-sheet`
Generates a new term sheet PDF from JSON data.

**Request Body:**
- Content-Type: `application/json`
- Body: JSON object with loan data

**Response:**
```json
{
  "success": true,
  "message": "PDF generated successfully",
  "filename": "term-sheet-2025-07-31T21-35-27-734Z.pdf",
  "downloadUrl": "/generated/term-sheet-2025-07-31T21-35-27-734Z.pdf",
  "generatedAt": "2025-07-31T21:35:31.302Z"
}
```

### GET `/api/pdf/download/:filename`
Downloads a generated PDF file.

### GET `/api/pdf/preview/:filename`
Previews a generated PDF in the browser.

## 🎨 Template Customization

The HTML template (`templates/dscr-term-sheet.html`) can be customized to match your branding and requirements:

- **Styling**: Modify CSS in the `<style>` section
- **Layout**: Adjust the two-column structure
- **Fields**: Add or remove data fields as needed
- **Placeholders**: Use `{{ field_name }}` syntax for dynamic data

## 🚀 Deployment

### Local Development
```bash
npm run dev:server
```

### Production Build
```bash
npm run build
npm start
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub. 