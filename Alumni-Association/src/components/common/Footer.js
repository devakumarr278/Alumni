import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png'


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Alumni', path: '/alumni' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook-f', url: '#' },
    { icon: 'fab fa-twitter', url: '#' },
    { icon: 'fab fa-linkedin-in', url: '#' },
    { icon: 'fab fa-instagram', url: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <Link to="/" className="flex items-center mb-6">
              <img
                src={Logo}
                alt="Alumni Association"
                className="h-10"
              />
              <span className="ml-3 text-xl font-bold">Alumni Network</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Connecting alumni worldwide to foster lifelong relationships and
              support the growth of our institution.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerLinks.map((column, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>Back2Bond</p>
              <p>Alumni Center, Suite 100</p>
              <p>Avinashi, Coimbatore - 610119</p>
              <p>Email: alumni@university.edu</p>
              <p>Phone: +91 8956796562</p>
            </address>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm mb-4 md:mb-0"
          >
            &copy; {currentYear} Alumni Association. All rights reserved.
          </motion.p>
          <div className="flex space-x-6">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="text-gray-500 hover:text-white text-sm"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="text-gray-500 hover:text-white text-sm"
            >
              Terms of Service
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;