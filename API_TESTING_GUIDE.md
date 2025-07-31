# PDF Generation API Testing Guide

## 🚀 Server Setup

### 1. Start the Development Server
```bash
# Start the server in development mode with auto-reload
npm run dev:server

# Or start in production mode (after building)
npm run build && npm start
```

The server will start on `http://localhost:3000`

### 2. Verify Server is Running
```bash
curl http://localhost:3000/api/ping
```
Expected response: `{"message":"ping pong"}`

## 📊 API Endpoints

### 1. Generate PDF Term Sheet

**Endpoint:** `POST /api/pdf/generate-term-sheet`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "program": "Premium DSCR Program",
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
}
```

**CURL Command:**
```bash
curl -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d @test-curl-data.json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "PDF generated successfully",
  "filename": "term-sheet-2025-07-31T20-33-57-230Z.pdf",
  "downloadUrl": "/generated/term-sheet-2025-07-31T20-33-57-230Z.pdf",
  "generatedAt": "2025-07-31T20:34:00.295Z"
}
```

### 2. Download Generated PDF

**Endpoint:** `GET /api/pdf/download/{filename}`

**CURL Command:**
```bash
# Download with attachment header (forces download)
curl -O http://localhost:3000/api/pdf/download/term-sheet-2025-07-31T20-33-57-230Z.pdf

# Or download with custom filename
curl -o my-term-sheet.pdf http://localhost:3000/api/pdf/download/term-sheet-2025-07-31T20-33-57-230Z.pdf
```

### 3. Preview Generated PDF

**Endpoint:** `GET /api/pdf/preview/{filename}`

**CURL Command:**
```bash
# Preview in browser (inline)
curl http://localhost:3000/api/pdf/preview/term-sheet-2025-07-31T20-33-57-230Z.pdf
```

### 4. Direct Static File Access

**Endpoint:** `GET /generated/{filename}`

**CURL Command:**
```bash
# Direct access to generated file
curl -O http://localhost:3000/generated/term-sheet-2025-07-31T20-33-57-230Z.pdf
```

## 🧪 Complete Testing Workflow

### Step 1: Create Test Data File
```bash
# Create test-curl-data.json with your loan data
cat > test-curl-data.json << 'EOF'
{
  "program": "Premium DSCR Program",
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
}
EOF
```

### Step 2: Generate PDF
```bash
curl -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d @test-curl-data.json
```

### Step 3: Extract Filename and Download
```bash
# Extract filename from response and download
FILENAME=$(curl -s -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d @test-curl-data.json | jq -r '.filename')

echo "Generated PDF: $FILENAME"

# Download the generated PDF
curl -O http://localhost:3000/api/pdf/download/$FILENAME
```

## 🔧 Advanced Testing

### Test with Different Data
```bash
# Test with different borrower
curl -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d '{
    "program": "Standard DSCR",
    "borrower_name": "Jane Smith",
    "guarantor_name": "Smith Investments LLC",
    "loan_amount": "$500,000",
    "interest_rate": "7.50%",
    "loan_term": "30 Years",
    "property_address": "456 Oak Street, Miami, FL 33101",
    "property_type": "Multi-Family",
    "appraised_value": "$650,000",
    "ltv": "77%",
    "fico_score": "720",
    "loan_purpose": "Refinance",
    "prepayment_penalty": "5-year stepdown",
    "lender_fee": "$10,000",
    "title_fee": "$2,500",
    "recording_fee": "$200",
    "dscr": "1.30",
    "loan_proceeds": "$487,300",
    "cash_to_close": "$12,700",
    "total_sources": "$500,000",
    "total_uses": "$500,000"
  }'
```

### Test Error Handling
```bash
# Test with missing required field
curl -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d '{
    "program": "Test Program"
  }'
```

### Test Invalid Filename
```bash
# Test downloading non-existent file
curl http://localhost:3000/api/pdf/download/nonexistent.pdf
```

## 📁 File Management

### Check Generated Files
```bash
# List all generated PDFs
ls -la public/generated/

# Check file sizes
du -h public/generated/*.pdf
```

### Clean Up Generated Files
```bash
# Remove all generated PDFs (be careful!)
rm public/generated/*.pdf

# Or remove files older than 7 days
find public/generated/ -name "*.pdf" -mtime +7 -delete
```

## 🐛 Troubleshooting

### Common Issues

1. **Server not starting:**
   ```bash
   # Check if port 3000 is in use
   lsof -i :3000
   
   # Kill process if needed
   kill -9 $(lsof -t -i:3000)
   ```

2. **PDF generation fails:**
   ```bash
   # Check server logs
   # Look for Puppeteer/browser errors
   # Ensure public/generated directory exists
   mkdir -p public/generated
   ```

3. **File not found errors:**
   ```bash
   # Check if file exists
   ls -la public/generated/
   
   # Check file permissions
   chmod 755 public/generated/
   ```

### Debug Mode
```bash
# Enable verbose CURL output
curl -v -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d @test-curl-data.json
```

## 📊 Performance Testing

### Load Testing
```bash
# Generate multiple PDFs concurrently
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/pdf/generate-term-sheet \
    -H "Content-Type: application/json" \
    -d @test-curl-data.json &
done
wait
```

### Response Time Testing
```bash
# Test response time
time curl -X POST http://localhost:3000/api/pdf/generate-term-sheet \
  -H "Content-Type: application/json" \
  -d @test-curl-data.json
```

## 🎯 Integration Examples

### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3000/api/pdf/generate-term-sheet', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loanData)
});

const result = await response.json();
console.log('PDF generated:', result.downloadUrl);
```

### Python/Requests
```python
import requests

response = requests.post(
    'http://localhost:3000/api/pdf/generate-term-sheet',
    json=loan_data,
    headers={'Content-Type': 'application/json'}
)

result = response.json()
print(f"PDF generated: {result['downloadUrl']}")
```

This guide provides everything you need to test the PDF generation API thoroughly! 