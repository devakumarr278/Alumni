const { groq } = require('../groqClient');

async function summarizeChat(chatHistory) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'user',
        content: `Summarize this mentorship conversation: ${chatHistory}`
      }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = { summarizeChat };