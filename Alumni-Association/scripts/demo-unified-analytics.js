#!/usr/bin/env node

/**
 * Demo Script for Unified Activity Analytics
 * 
 * This script demonstrates how to use the unified analytics feature
 * by making API calls to the backend endpoints.
 */

const https = require('https');

// Configuration
const BASE_URL = 'http://localhost:5003'; // Adjust to your backend URL
const API_ENDPOINT = '/api/analytics/activity';

/**
 * Make an API call to fetch analytics data
 * @param {string} type - 'alumni' or 'student'
 * @returns {Promise<Object>} - The response data
 */
async function fetchAnalyticsData(type) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${API_ENDPOINT}?type=${type}`;
    
    console.log(`Fetching ${type} analytics data from: ${url}`);
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
  });
}

/**
 * Display analytics data in a formatted way
 * @param {Object} data - The analytics data
 * @param {string} type - 'alumni' or 'student'
 */
function displayAnalyticsData(data, type) {
  if (!data.success) {
    console.error(`Failed to fetch ${type} data: ${data.message}`);
    return;
  }
  
  console.log(`\n=== ${type.charAt(0).toUpperCase() + type.slice(1)} Activity Analytics ===`);
  console.log(`Total ${type}: ${data.data.totalUsers}`);
  console.log(`Average Engagement: ${data.data.avgEngagement}/10`);
  
  if (data.data.topPerformer) {
    console.log(`\nTop Performer:`);
    console.log(`  Name: ${data.data.topPerformer.name}`);
    console.log(`  Department: ${data.data.topPerformer.department}`);
    console.log(`  Impact Score: ${data.data.topPerformer.impactScore}/10`);
  }
  
  console.log(`\n${type.charAt(0).toUpperCase() + type.slice(1)} List:`);
  data.data.list.slice(0, 5).forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.name} (${user.department}) - Impact: ${user.impactScore}/10`);
  });
  
  if (data.data.list.length > 5) {
    console.log(`  ... and ${data.data.list.length - 5} more`);
  }
}

/**
 * Main demo function
 */
async function runDemo() {
  console.log('🚀 Unified Activity Analytics Demo');
  console.log('=====================================');
  
  try {
    // Fetch alumni data
    console.log('\n1. Fetching Alumni Analytics...');
    const alumniData = await fetchAnalyticsData('alumni');
    displayAnalyticsData(alumniData, 'alumni');
    
    // Fetch student data
    console.log('\n2. Fetching Student Analytics...');
    const studentData = await fetchAnalyticsData('student');
    displayAnalyticsData(studentData, 'student');
    
    // Compare engagement
    console.log('\n3. Comparison:');
    if (alumniData.success && studentData.success) {
      const alumniEngagement = alumniData.data.avgEngagement;
      const studentEngagement = studentData.data.avgEngagement;
      
      console.log(`   Alumni Average Engagement: ${alumniEngagement}/10`);
      console.log(`   Student Average Engagement: ${studentEngagement}/10`);
      
      if (alumniEngagement > studentEngagement) {
        console.log(`   👉 Alumni have higher engagement by ${(alumniEngagement - studentEngagement).toFixed(2)} points`);
      } else if (studentEngagement > alumniEngagement) {
        console.log(`   👉 Students have higher engagement by ${(studentEngagement - alumniEngagement).toFixed(2)} points`);
      } else {
        console.log(`   👉 Alumni and Students have equal engagement`);
      }
    }
    
    console.log('\n✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Run the demo if this script is executed directly
if (require.main === module) {
  runDemo();
}

module.exports = {
  fetchAnalyticsData,
  displayAnalyticsData,
  runDemo
};