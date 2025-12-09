import React, { useRef, useState, useEffect } from "react";
import InstitutionPostCard from '../components/common/InstitutionPostCard';
import { usePosts } from '../context/PostContext';

// ... existing dummy posts data ...

export default function Posts() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const { posts, loading, error, fetchPosts } = usePosts();
  
  // Mock current user (in a real app, this would come from auth context)
  // For public posts page, this would typically be null or a student/alumni
  const currentUser = null; // Not an institution, so no edit/delete options
  
  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
      setCurrentIndex(prev => Math.min(prev + 1, posts.length - 2));
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="pt-[72px] bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="pt-[72px] bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-2">⚠️</div>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchPosts}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] bg-gray-50 min-h-screen">
      
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Institution Posts</h1>
        <p className="text-gray-500 mt-2">
          Latest announcements and events from institutions
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
          {posts.map(post => (
            <InstitutionPostCard 
              key={post._id} 
              post={{ 
                ...post,
                id: post._id,
                institution: post.author,
                analytics: {
                  views: post.analytics?.views || 0,
                  comments: post.comments?.length || 0,
                  shares: post.analytics?.shares || 0,
                }
              }} 
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              currentUser={currentUser}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {currentIndex < posts.length - 2 && (
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
    </div>
  );
}