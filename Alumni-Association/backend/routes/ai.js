import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Recommendations Endpoint
router.post('/recommend-projects', async (req, res) => {
  try {
    const { skills, preferences, projects } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills array is required' });
    }

    const systemPrompt = `You are a senior software engineer and career mentor. Analyze the user's skills and suggest relevant projects that match their skill level and help them grow. Return a JSON array of project IDs with match scores and reasoning.`;

    const userPrompt = `Given the following user skills: ${skills.join(", ")}
User preferences: ${JSON.stringify(preferences || {})}

Available projects: ${JSON.stringify(projects || [], null, 2)}

Analyze the user's skills and recommend 5-8 projects that:
1. Match their current skill level
2. Help them learn new technologies in related domains
3. Have appropriate difficulty progression
4. Build on their existing skills

Return JSON format:
{
  "recommendations": [
    {
      "projectId": "string",
      "matchScore": number (0-100),
      "reasoning": "string",
      "skillsToLearn": ["string"],
      "skillsToApply": ["string"]
    }
  ],
  "summary": "string",
  "nextSteps": ["string"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json(response);

  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI recommendations',
      details: error.message 
    });
  }
});

// Skill Analysis Endpoint
router.post('/analyze-skills', async (req, res) => {
  try {
    const { skills } = req.body;
    
    const prompt = `Analyze these programming skills: ${skills.join(", ")}
    
Provide a JSON response with:
1. Primary expertise areas
2. Missing foundational skills
3. Recommended learning path
4. Market demand score (1-10)
5. Salary potential (entry, mid, senior)

Format:
{
  "analysis": {
    "expertiseAreas": ["string"],
    "skillLevel": "beginner|intermediate|advanced",
    "missingSkills": ["string"],
    "strengths": ["string"]
  },
  "recommendations": {
    "learningPath": ["string"],
    "nextTechnologies": ["string"],
    "projectTypes": ["string"]
  },
  "marketInsights": {
    "demandScore": number,
    "salaryRange": {
      "entry": "string",
      "mid": "string",
      "senior": "string"
    },
    "growthAreas": ["string"]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a tech career advisor with deep knowledge of software engineering job markets and learning paths." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.json(analysis);

  } catch (error) {
    console.error('Skill analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

export default router;