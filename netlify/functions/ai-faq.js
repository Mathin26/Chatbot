// const fetch = require('node-fetch');

// exports.handler = async (event, context) => {
//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'Content-Type',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS',
//     'Content-Type': 'application/json'
//   };

//   if (event.httpMethod === 'OPTIONS') {
//     return { statusCode: 200, headers, body: '' };
//   }

//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       headers,
//       body: JSON.stringify({ answer: 'Method Not Allowed' })
//     };
//   }

//   try {
//     console.log('Function invoked');
    
//     const body = JSON.parse(event.body);
//     const userMessage = body.question || body.user;

//     console.log('User message:', userMessage);

//     if (!userMessage) {
//       return {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ answer: 'No question provided' })
//       };
//     }

//     const apiKey = process.env.OPENROUTER_API_KEY;
    
//     // DEBUG: Log key info (first/last 5 chars only for security)
//     if (apiKey) {
//       console.log('API Key exists, length:', apiKey.length);
//       console.log('API Key prefix:', apiKey.substring(0, 5));
//       console.log('API Key suffix:', apiKey.substring(apiKey.length - 5));
//     } else {
//       console.error('OPENROUTER_API_KEY is undefined or empty');
//       return {
//         statusCode: 500,
//         headers,
//         body: JSON.stringify({ answer: 'API key not configured' })
//       };
//     }

//     console.log('Calling OpenRouter API...');

//     const requestBody = {
//       model: 'meituan/longcat-flash-chat:free',
//       messages: [
//         { role: 'system', content: 'You are a helpful assistant.' },
//         { role: 'user', content: userMessage }
//       ]
//     };

//     console.log('Request body:', JSON.stringify(requestBody));

//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//         'HTTP-Referer': 'https://chat.leblesy.com',
//         'X-Title': 'Chatbot'
//       },
//       body: JSON.stringify(requestBody)
//     });

//     console.log('OpenRouter status:', response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('OpenRouter error:', errorText);
      
//       // Also log response headers
//       console.error('Response headers:', JSON.stringify([...response.headers.entries()]));
      
//       return {
//         statusCode: response.status,
//         headers,
//         body: JSON.stringify({ answer: `API Error: ${response.status} - ${errorText}` })
//       };
//     }

//     const data = await response.json();
//     const answer = data.choices?.[0]?.message?.content || 'No response received';

//     console.log('Success! Answer length:', answer.length);

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({ answer })
//     };

//   } catch (error) {
//     console.error('Function error:', error.message);
//     console.error('Stack:', error.stack);
//     return {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ answer: `Server error: ${error.message}` })
//     };
//   }
// };

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ answer: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Function invoked');
    
    const body = JSON.parse(event.body);
    const userMessage = body.question || body.user;
    const selectedModel = body.model || 'google/gemma-2-9b-it:free'; // Default model

    console.log('User message:', userMessage);
    console.log('Selected model:', selectedModel);

    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ answer: 'No question provided' })
      };
    }

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

    const requestBody = {
      model: selectedModel,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage }
      ]
    };

    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://chat.leblesy.com',
        'X-Title': 'Chatbot'
      },
      body: JSON.stringify(requestBody),
      timeout: 25000
    });

    console.log('OpenRouter status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ answer: `API Error (${response.status}): Model may be temporarily unavailable. Try selecting a different model.` })
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

