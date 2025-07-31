import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>DSCR Term Sheet Generator</title>
        <meta name="description" content="Generate DSCR term sheet PDFs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            color: '#333',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            DSCR Term Sheet Generator
          </h1>
          
          <p style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#666'
          }}>
            Welcome to the DSCR Term Sheet Generator API
          </p>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0 }}>API Endpoints:</h3>
            <ul>
              <li><strong>Health Check:</strong> <code>GET /api/health</code></li>
              <li><strong>Generate PDF:</strong> <code>POST /api/generate-pdf</code></li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#e7f3ff',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0 }}>Test the API:</h3>
            <p>Use the following curl command to test PDF generation:</p>
            <pre style={{
              backgroundColor: '#f1f1f1',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
{`curl -X POST https://dscr-term-sheet-generator.vercel.app/api/generate-pdf \\
  -H "Content-Type: application/json" \\
  -d '{"program":"Program A","borrower_name":"Test User"}' \\
  -o test.pdf`}
            </pre>
          </div>

          <div style={{
            backgroundColor: '#fff3cd',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0 }}>Status:</h3>
            <p style={{ margin: 0 }}>
              ✅ API is running and ready to generate PDFs
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home; 