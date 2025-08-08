import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('=== MINIMAL TEST START ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    
    const { logo_url } = req.body;
    
    if (!logo_url) {
      return res.status(400).json({ 
        error: 'No logo_url provided',
        receivedKeys: Object.keys(req.body)
      });
    }

    console.log('Logo URL received:', logo_url);

    // Test 1: Try to fetch the logo
    let fetchResult = { success: false, error: '', status: 0, contentType: '', size: 0 };
    try {
      const response = await fetch(logo_url);
      fetchResult = {
        success: response.ok,
        error: '',
        status: response.status,
        contentType: response.headers.get('content-type') || '',
        size: 0
      };
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fetchResult.size = buffer.byteLength;
        console.log('Logo fetched successfully, size:', buffer.byteLength);
        
        // Convert to base64
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${fetchResult.contentType};base64,${base64}`;
        
        console.log('Base64 conversion successful, length:', base64.length);
        console.log('Data URL prefix:', dataUrl.substring(0, 100) + '...');
        
        return res.status(200).json({
          success: true,
          originalUrl: logo_url,
          fetchResult,
          base64Length: base64.length,
          dataUrlPrefix: dataUrl.substring(0, 100) + '...',
          message: 'Logo successfully converted to base64'
        });
      } else {
        fetchResult.error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      fetchResult.error = error instanceof Error ? error.message : 'Unknown error';
    }

    console.log('Fetch failed:', fetchResult);
    
    return res.status(400).json({
      success: false,
      originalUrl: logo_url,
      fetchResult,
      message: 'Failed to fetch or convert logo'
    });

  } catch (err) {
    console.error('Minimal test error:', err);
    res.status(500).json({ 
      error: 'Test failed', 
      details: err instanceof Error ? err.message : err 
    });
  }
}
