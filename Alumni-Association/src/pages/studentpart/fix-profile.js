const fs = require('fs');
const path = require('path');

// Path to the problematic file
const filePath = path.join(__dirname, 'profile.jsx');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Check if the file ends with the incomplete className
if (content.endsWith('className="')) {
  // Append the missing content to properly close the JSX element
  content += 'text-gray-500 hover:text-gray-700"';
  content += '\n                    >';
  content += '\n                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">';
  content += '\n                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />';
  content += '\n                      </svg>';
  content += '\n                    </button>';
  content += '\n                  </div>';
  content += '\n                  <div className="mb-4">';
  content += '\n                    <p className="text-gray-600">';
  content += '\n                      Request verification for badges you\'ve earned through external activities or achievements.';
  content += '\n                      Our team will review your submission and award appropriate badges.';
  content += '\n                    </p>';
  content += '\n                  </div>';
  content += '\n                  <BadgeVerificationRequest />';
  content += '\n                </div>';
  content += '\n              </div>';
  content += '\n            </div>';
  content += '\n\n            {/* Test WebSocket Connection Button - Only visible in development */}';
  content += '\n            {process.env.NODE_ENV === \'development\' && (';
  content += '\n              <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">';
  content += '\n                <h3 className="font-medium mb-2">Development Tools</h3>';
  content += '\n                <button ';
  content += '\n                  onClick={handleTestMentorshipSession}';
  content += '\n                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"';
  content += '\n                >';
  content += '\n                  Test Mentorship Session';
  content += '\n                </button>';
  content += '\n              </div>';
  content += '\n            )}';
  content += '\n          </div>';
  content += '\n        </div>';
  content += '\n      </div>';
  content += '\n    </div>';
  content += '\n  );';
  content += '\n};';
  content += '\n\nexport default StudentProfile;';

  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('File fixed successfully!');
} else {
  console.log('File does not end with the expected incomplete className. No changes made.');
}