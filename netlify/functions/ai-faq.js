const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ answer: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Function invoked');
    
    // Parse request
    const body = JSON.parse(event.body);
    const userMessage = body.question || body.user;

    console.log('User message:', userMessage);

    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ answer: 'No question provided' })
      };
    }

    // Check API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ answer: 'API key not configured' })
      };
    }

    console.log('Calling OpenRouter API...');

    // Call OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://chat.leblesy.com',
        'X-Title': 'Chatbot'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage }
        ]
      }),
      timeout: 9000  // 9 second timeout (before Netlify's 10s limit)
    });

    console.log('OpenRouter status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ answer: `API Error: ${response.status}` })
      };
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response received';

    console.log('Success! Answer length:', answer.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer })
    };

  } catch (error) {
    console.error('Function error:', error.message);
    console.error('Stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ answer: `Server error: ${error.message}` })
    };
  }
};
