/**
 * Test file for AI Mentor Matching Algorithm
 * Run this to validate the matching logic works correctly
 */

import { matchMentors, getRecommendationsWithDiversity } from '../utils/mentorMatching.js';
import { sampleAlumniData, sampleStudentProfiles } from '../data/mentorData.js';

// Test the matching algorithm
function testMentorMatching() {
  console.log('🧪 Testing AI Mentor Matching Algorithm...');
  console.log('=' .repeat(50));
  
  // Test with sample student profiles
  sampleStudentProfiles.forEach((student, index) => {
    console.log(`\n👨‍🎓 Testing Student ${index + 1}: ${student.name}`);
    console.log(`Skills: ${student.skills.join(', ')}`);
    console.log(`Domain: ${student.domain}`);
    console.log(`Graduation Year: ${student.graduationYear}`);
    console.log(`Time Zone: ${student.timeZone}`);
    
    const matches = matchMentors(student, sampleAlumniData);
    
    console.log(`\n🎯 Top ${matches.length} AI Recommendations:`);
    matches.forEach((mentor, idx) => {
      console.log(`\n${idx + 1}. ${mentor.name} (Score: ${mentor.score})`);
      console.log(`   Company: ${mentor.company}`);
      console.log(`   Skills: ${mentor.skills.slice(0, 3).join(', ')}`);
      console.log(`   Why Matched: ${mentor.whyMatched}`);
      console.log(`   Score Breakdown:`, mentor.scoreBreakdown);
    });
    
    console.log('\n' + '-'.repeat(40));
  });
  
  // Test diversity recommendations
  console.log('\n🌈 Testing Diversity Recommendations...');
  const diverseMatches = getRecommendationsWithDiversity(
    sampleStudentProfiles[0], 
    sampleAlumniData,
    { maxFromSameDomain: 1, prioritizeNewMentors: true }
  );
  
  console.log('Diverse matches (max 1 per domain):');
  diverseMatches.forEach((mentor, idx) => {
    console.log(`${idx + 1}. ${mentor.name} - ${mentor.domain} (Score: ${mentor.score})`);
  });
  
  // Test fairness guardrails
  console.log('\n⚖️ Testing Fairness Guardrails...');
  const overloadedMentors = sampleAlumniData.filter(m => m.menteeCount >= 3);
  console.log(`Mentors with 3+ mentees (should get penalty): ${overloadedMentors.map(m => m.name).join(', ')}`);
  
  const unavailableMentors = sampleAlumniData.filter(m => !m.availability);
  console.log(`Unavailable mentors (should be excluded): ${unavailableMentors.map(m => m.name).join(', ')}`);
  
  console.log('\n✅ AI Mentor Matching Test Complete!');
}

// Test scoring edge cases
function testScoringEdgeCases() {
  console.log('\n🔬 Testing Scoring Edge Cases...');
  
  // Perfect match scenario
  const perfectStudent = {
    id: 'perfect',
    name: 'Perfect Match Student',
    skills: ['React', 'Node.js', 'JavaScript'],
    graduationYear: 2024,
    domain: 'Software',
    timeZone: 'Asia/Kolkata'
  };
  
  const perfectMatches = matchMentors(perfectStudent, sampleAlumniData);
  console.log(`\nPerfect match test - Top match: ${perfectMatches[0]?.name} (Score: ${perfectMatches[0]?.score})`);
  
  // No skills match scenario
  const noSkillsStudent = {
    id: 'noskills',
    name: 'No Skills Student',
    skills: ['Underwater Basketweaving'],
    graduationYear: 2024,
    domain: 'Other',
    timeZone: 'Mars/Olympus'
  };
  
  const noSkillsMatches = matchMentors(noSkillsStudent, sampleAlumniData);
  console.log(`\nNo skills match test - Top match: ${noSkillsMatches[0]?.name} (Score: ${noSkillsMatches[0]?.score})`);
  
  console.log('\n✅ Edge Cases Test Complete!');
}

// Export for use in React components
export { testMentorMatching, testScoringEdgeCases };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  testMentorMatching();
  testScoringEdgeCases();
}