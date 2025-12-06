import React from 'react';
// Removed StudentNavigation import as it's handled by the shared layout

const StudentPledges = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Micropledges & Donations</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Active Campaigns */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-6">Active Campaigns</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      id: 1,
                      title: "New Computer Lab Equipment",
                      description: "Help fund new computers and software for the student computer lab.",
                      goal: 25000,
                      raised: 18750,
                      backers: 156,
                      timeLeft: "12 days left",
                      category: "Technology"
                    },
                    {
                      id: 2,
                      title: "Student Scholarship Fund",
                      description: "Support need-based scholarships for current students.",
                      goal: 50000,
                      raised: 32500,
                      backers: 89,
                      timeLeft: "25 days left",
                      category: "Education"
                    },
                    {
                      id: 3,
                      title: "Campus Green Initiative",
                      description: "Fund sustainable energy projects and campus beautification.",
                      goal: 15000,
                      raised: 8900,
                      backers: 67,
                      timeLeft: "18 days left",
                      category: "Environment"
                    }
                  ].map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {campaign.title}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {campaign.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{campaign.timeLeft}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{campaign.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold">
                            ${campaign.raised.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600">
                            of ${campaign.goal.toLocaleString()} goal
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-600 h-3 rounded-full" 
                            style={{width: `${(campaign.raised / campaign.goal) * 100}%`}}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {campaign.backers} backers • {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                          Pledge Now
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Quick Pledge Options */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Pledge</h3>
                  <p className="text-gray-600 mb-4">
                    Support any campaign with a quick micro-donation:
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['$5', '$10', '$25', '$50'].map((amount) => (
                      <button 
                        key={amount}
                        className="border border-green-600 text-green-600 py-2 rounded-md hover:bg-green-50 font-medium"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <input 
                      type="number" 
                      placeholder="Custom amount"
                      className="flex-1 border border-gray-300 rounded-md p-2"
                    />
                    <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                      Pledge
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* My Pledges */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">My Pledges</h3>
                  
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-sm">Computer Lab Equipment</h4>
                      <p className="text-xs text-gray-600">$25 pledged • 5 days ago</p>
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-sm">Student Scholarship Fund</h4>
                      <p className="text-xs text-gray-600">$50 pledged • 2 weeks ago</p>
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-sm">Library Renovation</h4>
                      <p className="text-xs text-gray-600">$15 pledged • 1 month ago</p>
                      <div className="mt-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total pledged</span>
                      <span className="font-semibold text-green-600">$90</span>
                    </div>
                  </div>
                </div>
                
                {/* Impact Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
                  
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-gray-600">Campaigns Supported</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">$90</div>
                      <div className="text-sm text-gray-600">Total Contributed</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">#12</div>
                      <div className="text-sm text-gray-600">Donor Rank</div>
                    </div>
                  </div>
                </div>
                
                {/* Donation Recognition */}
                <div className="bg-gradient-to-r from-gold-100 to-yellow-100 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-800">Recognition</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full mr-3 flex items-center justify-center">
                        <svg className="w-4 h-4 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-yellow-800">Supporter Badge</h4>
                        <p className="text-xs text-yellow-700">For backing 3+ campaigns</p>
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-white bg-opacity-50 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        Your name will be featured on the donor wall in the student center!
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Create Campaign CTA */}
                <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300">
                  <h3 className="text-lg font-semibold mb-2">Have an Idea?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Start your own fundraising campaign for campus improvements.
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Propose Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPledges;