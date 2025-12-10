// Test script for AI integration
const { analyzeMessage } = require('./ai/analyzeMessage');
const { recommendMentor } = require('./ai/recommendMentor');
const { summarizeChat } = require('./ai/summarizeChat');

async function testAIIntegration() {
  console.log('Testing AI Integration...');
  
  // Test message analysis
  try {
    console.log('\n1. Testing Message Analysis:');
    const testMessage = "I'm having trouble understanding the concept of asynchronous programming in JavaScript. Can someone explain it to me?";
    const analysis = await analyzeMessage(testMessage);
    console.log('Message:', testMessage);
    console.log('Analysis:', analysis);
  } catch (error) {
    console.error('Error in message analysis:', error.message);
  }
  
  // Test mentor recommendation
  try {
    console.log('\n2. Testing Mentor Recommendation:');
    const student = {
      name: "John Doe",
      interests: ["JavaScript", "React", "Frontend Development"],
      skillLevel: "Intermediate"
    };
    
    const mentors = [
      {
        name: "Jane Smith",
        expertise: ["JavaScript", "Node.js", "Backend Development"],
        experience: "5 years"
      },
      {
        name: "Mike Johnson",
        expertise: ["React", "Frontend Development", "CSS"],
        experience: "3 years"
      },
      {
        name: "Sarah Wilson",
        expertise: ["Full Stack Development", "JavaScript", "Database Design"],
        experience: "7 years"
      }
    ];
    
    const recommendation = await recommendMentor(student, mentors);
    console.log('Student:', student);
    console.log('Mentors:', mentors);
    console.log('Recommendation:', recommendation);
  } catch (error) {
    console.error('Error in mentor recommendation:', error.message);
  }
  
  // Test chat summarization
  try {
    console.log('\n3. Testing Chat Summarization:');
    const chatHistory = "Student: Hi, I need help with React hooks. Mentor: Sure, I can help you with that. What specifically are you struggling with? Student: I don't understand useState and useEffect properly. Mentor: Okay, let me explain useState first. It's used to add state to functional components...";
    const summary = await summarizeChat(chatHistory);
    console.log('Chat History:', chatHistory);
    console.log('Summary:', summary);
  } catch (error) {
    console.error('Error in chat summarization:', error.message);
  }
}

// Run the test
testAIIntegration();