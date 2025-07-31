import { PDFGenerator } from './scripts/generate-pdf.js';
import fs from 'fs/promises';

// Test data
const testData = {
  "program": "Premium DSCR Program",
  "borrower_name": "Sarah Johnson",
  "guarantor_name": "Johnson Investment Group LLC",
  "loan_amount": "$450,000",
  "interest_rate": "7.85%",
  "loan_term": "30 Years",
  "property_address": "456 Oak Street, Miami, FL 33101",
  "property_type": "Multi-Family",
  "appraised_value": "$600,000",
  "ltv": "75%",
  "fico_score": "745",
  "loan_purpose": "Refinance",
  "prepayment_penalty": "5-year stepdown",
  "lender_fee": "$9,000",
  "title_fee": "$2,100",
  "recording_fee": "$150",
  "dscr": "1.35",
  "loan_proceeds": "$438,750",
  "cash_to_close": "$11,250",
  "total_sources": "$450,000",
  "total_uses": "$450,000"
};

async function testPDFGeneration() {
  console.log('🧪 Testing PDF Generation API...\n');
  
  try {
    // Test 1: Basic PDF generation
    console.log('📋 Test 1: Basic PDF Generation');
    const generator = new PDFGenerator();
    const pdfPath = await generator.generateTermSheet(testData, 'test-output.pdf');
    console.log(`✅ Success: ${pdfPath}\n`);
    
    // Test 2: Check file exists and get file size
    console.log('📁 Test 2: File Verification');
    const stats = await fs.stat(pdfPath);
    console.log(`✅ File size: ${(stats.size / 1024).toFixed(2)} KB\n`);
    
    // Test 3: Generate with different data
    console.log('🔄 Test 3: Different Data Set');
    const differentData = {
      ...testData,
      borrower_name: "Michael Chen",
      property_address: "789 Pine Avenue, San Francisco, CA 94102",
      loan_amount: "$325,000",
      interest_rate: "8.50%"
    };
    
    const pdfPath2 = await generator.generateTermSheet(differentData, 'test-output-2.pdf');
    console.log(`✅ Success: ${pdfPath2}\n`);
    
    // Test 4: Error handling with invalid data
    console.log('❌ Test 4: Error Handling');
    try {
      const invalidData = { ...testData };
      delete invalidData.borrower_name; // Remove required field
      await generator.generateTermSheet(invalidData, 'test-error.pdf');
    } catch (error) {
      console.log(`✅ Error caught: ${error.message}\n`);
    }
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run the test
testPDFGeneration(); 