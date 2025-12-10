const { groq } = require('../groqClient');

async function recommendMentor(student, mentors) {
  const prompt = `
Match the student to the best mentors.

Student: ${JSON.stringify(student)}
Mentors: ${JSON.stringify(mentors)}

Return the top 3 mentors with reasoning.
  `;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content;
}

module.exports = { recommendMentor };