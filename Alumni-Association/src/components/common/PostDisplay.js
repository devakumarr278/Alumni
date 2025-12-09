import React, { useRef, useState } from 'react';
import { usePosts } from '../../context/PostContext';
import { Link } from 'react-router-dom';
import InstitutionPostCard from './InstitutionPostCard';

export default function PostDisplay() {
  const { posts } = usePosts();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  
  // Mock current user (in a real app, this would come from auth context)
  // For public home page, this would typically be null or a student/alumni
  const currentUser = null; // Not an institution, so no edit/delete options
  
  // Show only the 3 most recent posts
  const recentPosts = posts.slice(0, 3);

  if (recentPosts.length === 0) {
    return null;
  }

  // Transform posts to match the expected format
  const transformedPosts = recentPosts.map(post => ({
    id: post.id,
    institutionId: post.institutionId || "inst_default",
    createdById: post.createdById || "user_default",
    institution: post.author,
    avatar: post.avatar,
    media: post.media || [{ type: "image", url: "" }],
    caption: post.caption,
    likes: post.likes || [],
    comments: post.comments || [],
    analytics: {
      views: 0,
      comments: post.comments ? post.comments.length : 0,
      shares: 0,
    },
    visibility: "public"
  }));

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
      setCurrentIndex(prev => Math.min(prev + 1, transformedPosts.length - 2));
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Latest from Institutions
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Stay updated with the latest announcements and events from our partner institutions
        </p>
      </div>
      
      {/* Feed */}
      <div className="relative max-w-[800px] mx-auto">
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button 
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        
        {/* Posts Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden"
        >
          {transformedPosts.map((post) => (
            <InstitutionPostCard 
              key={post.id} 
              post={post} 
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              currentUser={currentUser}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {currentIndex < transformedPosts.length - 2 && (
          <button 
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>
      
      {/* View All Posts Button */}
      <div className="text-center mt-10">
        <Link 
          to="/posts" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
        >
          View All Posts
        </Link>
      </div>
    </div>
  );
}