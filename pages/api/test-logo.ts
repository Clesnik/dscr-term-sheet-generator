import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { logo_url } = req.body;
    
    if (!logo_url) {
      return res.status(400).json({ error: 'logo_url is required' });
    }

    // Test if the URL is accessible
    const response = await fetch(logo_url);
    
    if (!response.ok) {
      return res.status(400).json({ 
        error: 'Logo URL is not accessible', 
        status: response.status,
        statusText: response.statusText 
      });
    }

    const contentType = response.headers.get('content-type');
    
    return res.status(200).json({ 
      success: true, 
      url: logo_url,
      contentType,
      status: response.status
    });
  } catch (err) {
    console.error('Logo test error:', err);
    res.status(500).json({ 
      error: 'Failed to test logo URL', 
      details: err instanceof Error ? err.message : err 
    });
  }
}
