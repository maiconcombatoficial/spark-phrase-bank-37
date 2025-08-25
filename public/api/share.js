// Simple serverless function to handle share logging
// This runs on the edge and logs sharing events

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const shareEvent = {
      phraseId: req.body.phraseId,
      method: req.body.method, // 'native', 'clipboard', 'whatsapp', etc.
      source: req.body.source, // 'card', 'detail', 'favorite'
      timestamp: req.body.timestamp,
      userAgent: req.body.userAgent,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    };

    // Log the share event (in production, save to database or analytics service)
    console.log('📤 Share Event:', JSON.stringify(shareEvent, null, 2));

    // Here you would typically:
    // - Save to database
    // - Send to analytics service (Google Analytics, Mixpanel, etc.)
    // - Update share counters
    // await saveShareEvent(shareEvent);

    return res.status(200).json({ 
      success: true, 
      message: 'Share event logged successfully',
      eventId: `share_${Date.now()}_${shareEvent.phraseId}`
    });

  } catch (error) {
    console.error('❌ Error logging share event:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to log share event' 
    });
  }
}