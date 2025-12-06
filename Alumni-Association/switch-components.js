const fs = require('fs');
const path = require('path');

const institutionDir = path.join(__dirname, 'src', 'pages', 'institution');
const realComponent = path.join(institutionDir, 'AlumniVerification.js');
const mockComponent = path.join(institutionDir, 'MockAlumniVerification.js');
const backupComponent = path.join(institutionDir, 'AlumniVerification.backup.js');

function switchToMock() {
  try {
    // Check if files exist
    if (!fs.existsSync(realComponent)) {
      console.log('❌ Real AlumniVerification component not found');
      return;
    }
    
    // Backup the real component
    if (!fs.existsSync(backupComponent)) {
      fs.renameSync(realComponent, backupComponent);
      console.log('✅ Backed up real AlumniVerification component');
    }
    
    // Move mock component to real component name
    if (fs.existsSync(mockComponent)) {
      fs.renameSync(mockComponent, realComponent);
      console.log('✅ Switched to mock AlumniVerification component');
      console.log('\nNow the institution dashboard will use the mock system!');
      console.log('Make sure the mock API server is running on port 3001');
    } else {
      console.log('❌ Mock AlumniVerification component not found');
    }
  } catch (error) {
    console.error('Error switching to mock component:', error.message);
  }
}

function switchToReal() {
  try {
    // Check if files exist
    if (!fs.existsSync(backupComponent)) {
      console.log('❌ Backup of real AlumniVerification component not found');
      return;
    }
    
    // Restore the real component
    if (fs.existsSync(realComponent)) {
      fs.unlinkSync(realComponent);
      console.log('✅ Removed mock AlumniVerification component');
    }
    
    fs.renameSync(backupComponent, realComponent);
    console.log('✅ Switched back to real AlumniVerification component');
    console.log('\nNow the institution dashboard will use the real system!');
  } catch (error) {
    console.error('Error switching to real component:', error.message);
  }
}

// Get command line argument
const args = process.argv.slice(2);
const command = args[0];

if (command === 'mock') {
  console.log('Switching to mock component...');
  switchToMock();
} else if (command === 'real') {
  console.log('Switching to real component...');
  switchToReal();
} else {
  console.log('Usage:');
  console.log('  node switch-components.js mock  - Switch to mock component');
  console.log('  node switch-components.js real  - Switch back to real component');
}