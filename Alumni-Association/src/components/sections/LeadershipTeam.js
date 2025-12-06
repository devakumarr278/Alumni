import React from 'react';
import { motion } from 'framer-motion';
import Priya from '../../assets/images/priya.png';
import Sofia from '../../assets/images/sofia.png';
import Vaishu from '../../assets/images/vaishu.png';
import Sandy from '../../assets/images/sandy.JPG';
import Venky from '../../assets/images/venky.JPG';

const teamMembers = [
  {
    id: 1,
    name: "Dr.Johnson",
    position: "President",
    bio: "Alumni of 2005, Professor of Computer Science with 15+ years of leadership experience.",
    image: `${Sandy}`,
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    }
  },
  {
    id: 2,
    name: "Sofia chaen",
    position: "Vice President",
    bio: "Class of 2010, Marketing Director at Fortune 500 company specializing in alumni engagement.",
    image: `${Vaishu}`,
    social: {
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    id: 3,
    name: "Santhosh Patel",
    position: "Secretary",
    bio: "Graduated in 2015, non-profit organizer with expertise in community building.",
    image: `${Venky}`,
    social: {
      linkedin: "#",
      email: "#"
    }
  },
  {
    id: 4,
    name: "Vaishu prithi",
    position: "Treasurer",
    bio: "Alumni of 2008, Financial Analyst with MBA in Institutional Management.",
    image: `${Sofia}`,
    social: {
      linkedin: "#"
    }
  }
];

const LeadershipTeam = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Leadership Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated alumni who guide our association's vision
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col"
            >
              <div className="relative group overflow-hidden rounded-lg shadow-lg h-80">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-white text-sm mb-2">{member.bio}</p>
                  <div className="flex space-x-3 mt-2">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="text-white hover:text-blue-400 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="text-white hover:text-blue-400 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`} className="text-white hover:text-red-400 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-purple-600 font-medium">{member.position}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam;