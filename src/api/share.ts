// Simple API endpoint to log sharing events for analytics
// This would typically connect to a database or analytics service

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const shareEvent = {
      phraseId: body.phraseId,
      method: body.method, // 'native', 'clipboard', 'whatsapp', etc.
      source: body.source, // 'card', 'detail', 'favorite'
      timestamp: body.timestamp,
      userAgent: body.userAgent,
    };

    // Log to console for now (in production, this would go to a database/analytics service)
    console.log('Share Event:', shareEvent);

    // You could also log to a file or send to an analytics service
    // Example: await analytics.track('phrase_shared', shareEvent);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Share event logged successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error logging share event:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to log share event' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}