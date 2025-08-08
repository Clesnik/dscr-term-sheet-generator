import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { logo_url } = req.body;
    
    console.log('Test endpoint - logo_url received:', logo_url);
    
    if (!logo_url) {
      return res.status(400).json({ error: 'No logo_url provided' });
    }

    // Test if the URL is accessible
    const response = await fetch(logo_url);
    
    if (!response.ok) {
      return res.status(400).json({ 
        error: 'Logo URL is not accessible', 
        status: response.status,
        statusText: response.statusText,
        url: logo_url
      });
    }

    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    return res.status(200).json({ 
      success: true, 
      url: logo_url,
      contentType,
      contentLength,
      status: response.status,
      message: 'Logo URL is accessible and valid'
    });
  } catch (err) {
    console.error('Test endpoint error:', err);
    res.status(500).json({ 
      error: 'Failed to test logo URL', 
      details: err instanceof Error ? err.message : err,
      url: req.body.logo_url
    });
  }
}
