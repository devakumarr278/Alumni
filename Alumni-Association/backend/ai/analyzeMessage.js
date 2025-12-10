const { groq } = require('../groqClient');

async function analyzeMessage(message) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI that analyzes student messages. Detect emotion, topic, difficulty level, and understanding.'
      },
      { role: 'user', content: message }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = { analyzeMessage };