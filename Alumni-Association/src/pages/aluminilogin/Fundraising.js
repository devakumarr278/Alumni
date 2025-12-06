import React from 'react';

const Fundraising = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fundraising & Giving Back</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="border border-gray-200 rounded-lg p-5 text-center">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-800 mb-2">Donate</h3>
          <p className="text-sm text-gray-600 mb-4">Make a one-time contribution</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Donate Now
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-5 text-center">
          <div className="text-3xl mb-3">📜</div>
          <h3 className="font-semibold text-gray-800 mb-2">Pledge</h3>
          <p className="text-sm text-gray-600 mb-4">Commit to future giving</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Make Pledge
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-5 text-center">
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="font-semibold text-gray-800 mb-2">Sponsor</h3>
          <p className="text-sm text-gray-600 mb-4">Fund events or programs</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Sponsor Now
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-5 text-center">
          <div className="text-3xl mb-3">📦</div>
          <h3 className="font-semibold text-gray-800 mb-2">Contribute</h3>
          <p className="text-sm text-gray-600 mb-4">Provide resources or expertise</p>
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Contribute
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Impact Tracker</h2>
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">₹25,000</div>
              <div className="text-gray-600">Donated</div>
              <div className="text-sm text-gray-500 mt-1">Supporting 3 students</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">2</div>
              <div className="text-gray-600">Scholarships Funded</div>
              <div className="text-sm text-gray-500 mt-1">Batch of 2020</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">1</div>
              <div className="text-gray-600">Lab Equipment</div>
              <div className="text-sm text-gray-500 mt-1">Computer Lab Upgrade</div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personalized Giving Suggestions</h2>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start">
            <div className="text-blue-600 text-xl mr-3">🤖</div>
            <div>
              <h3 className="font-medium text-gray-800">AI Recommendation</h3>
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Batch of 2010:</span> Your batch hasn't sponsored any student yet. 
                Consider contributing ₹1000 to support the Computer Science department's lab upgrade project. 
                Your contribution would help 50+ students gain hands-on experience.
              </p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Contribute Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fundraising;