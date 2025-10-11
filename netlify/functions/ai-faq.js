import fetch from 'node-fetch';

export const handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ answer: 'Method Not Allowed' })
    };
  }

  try {
    // Parse input
    const body = JSON.parse(event.body);
    const userMessage = body.question || body.user;

    console.log('Received message:', userMessage);

    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ answer: 'No question provided' })
      };
    }

    // Check API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('Missing OPENROUTER_API_KEY');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ answer: 'Server configuration error' })
      };
    }

    console.log('Calling OpenRouter API...');

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ answer: `API error: ${errorText}` })
      };
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response';

    console.log('Returning answer:', answer);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ answer: `Error: ${error.message}` })
    };
  }
};
