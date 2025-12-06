import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 bg-white"
    >
      <div className="container mx-auto px-4 mt-[50px]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out for any questions or feedback.
          </p>
        </motion.div>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
          <div className="info-grid">
            <section aria-labelledby="basic-contact" className="mb-8">
              <h2 id="basic-contact" className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <ul className="contact-list space-y-3">
                <li className="flex items-center group">
                  <span className="contact-icon bg-blue-900 text-blue-300 w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-200 group-hover:text-white transition-colors">Alumni Network Headquarters</span>
                </li>
                <li className="flex items-center group">
                  <span className="contact-icon bg-blue-900 text-blue-300 w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-200 group-hover:text-white transition-colors">123 Alumni Plaza, Main City, Country</span>
                </li>
                <li className="flex items-center group">
                  <span className="contact-icon bg-blue-900 text-blue-300 w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </span>
                  <span className="text-gray-200 group-hover:text-white transition-colors">+1-234-567-8900 (Help Desk)</span>
                </li>
                <li className="flex items-center group">
                  <span className="contact-icon bg-blue-900 text-blue-300 w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <span className="text-gray-200 group-hover:text-white transition-colors">alumni123@gmail.com</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Connect with Us</h3>
                <div className="flex space-x-4">
                  <a href="https://linkedin.com/company/global-alumni" target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com/global-alumni" target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com/global_alumni" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-14 h-14 rounded-full flex items-center justify-center hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.948 0-3.204.013-3.583.07-4.849zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/global_alumni" target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-400/30">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Emergency Contacts</h3>
                <ul className="space-y-3">
                  <li className="flex items-center group">
                    <span className="contact-icon bg-red-900 text-red-300 w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-700 transition-all duration-300 transform group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    <span className="text-gray-200 group-hover:text-white transition-colors">Technical Support: <a href="mailto:support@alumni123.com" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">support@alumni123.com</a></span>
                  </li>
                  <li className="flex items-center group">
                    <span className="contact-icon bg-red-900 text-red-300 w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-700 transition-all duration-300 transform group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-200 group-hover:text-white transition-colors">Event Coordinator: <a href="mailto:event@alumni123.com" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">event@alumni123.com</a></span>
                  </li>
                </ul>
              </div>
            </section>
            
            <section aria-labelledby="feedback-title" className="bg-gray-700 rounded-lg p-6">
              <h2 id="feedback-title" className="text-2xl font-bold text-white mb-4">Send us a message</h2>
              <form className="feedback-form space-y-4" aria-label="Feedback form for alumni network" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    required 
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="example@mail.com" 
                    required 
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    placeholder="Write your message here..." 
                    required 
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-400"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/30"
                >
                  Send Message
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;