import React from 'react';
import { FollowRequests } from '../../components/FollowRequests/index';

const ComponentTest = () => {
  console.log('ComponentTest page loaded - checking if enhanced components work');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#e0e0e0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '30px', textAlign: 'center' }}>
        COMPONENT TEST PAGE - ENHANCED VERSION
      </h1>
      <p style={{ textAlign: 'center', fontSize: '18px', color: 'blue' }}>
        This page directly uses the enhanced FollowRequests component
      </p>
      
      <div style={{ 
        border: '5px solid green', 
        padding: '20px', 
        margin: '20px', 
        backgroundColor: 'white',
        borderRadius: '10px'
      }}>
        <h2 style={{ color: 'purple', fontSize: '24px' }}>Enhanced Follow Requests Component:</h2>
        <div style={{ border: '3px solid orange', padding: '15px', marginTop: '15px' }}>
          <FollowRequests />
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: 'yellow',
        border: '2px solid black'
      }}>
        <h3>Instructions:</h3>
        <p>1. Open browser console (F12) to see console.log messages</p>
        <p>2. Look for distinctive visual elements (red borders, colored banners, etc.)</p>
        <p>3. If you see these elements, the enhanced components are working</p>
      </div>
    </div>
  );
};

export default ComponentTest;