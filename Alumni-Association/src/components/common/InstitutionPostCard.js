import React, { useState, useRef, useEffect } from "react";
import { usePosts } from "../../context/PostContext";

export default function InstitutionPostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare,
  menuOpen,
  setMenuOpen,
  setEditingPost,
  onDelete,
  currentUser
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [showShare, setShowShare] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(0);
  const intervalRef = useRef(null);
  const { likePost, addComment } = usePosts();

  // Check if current user is the post owner (institution)
  const isInstitution = currentUser?.role === "institution";
  const isOwner = currentUser?.id === post.createdById || 
                  currentUser?.institutionId === post.institutionId;

  const handleLike = async () => {
    try {
      // Toggle like status
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      
      // Update likes count
      const newLikes = newIsLiked ? likes + 1 : likes - 1;
      setLikes(newLikes);
      
      // Call backend API to like the post
      await likePost(post._id);
      
      // Call parent handler
      if (onLike) {
        onLike(post._id);
      }
    } catch (err) {
      // Revert changes if API call fails
      setIsLiked(!isLiked);
      setLikes(likes);
      console.error("Failed to like post:", err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      const newComment = {
        user: "You",
        text: commentText
      };
      
      const updatedComments = [...localComments, newComment];
      setLocalComments(updatedComments);
      setCommentText('');
      
      // Call backend API to add comment
      await addComment(post._id, commentText);
      
      // Call parent handler
      if (onComment) {
        onComment(post._id);
      }
    } catch (err) {
      // Revert changes if API call fails
      setLocalComments(localComments);
      setCommentText(commentText);
      console.error("Failed to add comment:", err);
    }
  };

  const handleShareAction = () => {
    setShowShare(!showShare);
    
    // Call parent handler
    if (onShare) {
      onShare(post._id);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`);
    alert("Link copied to clipboard!");
  };

  // Handle hover for image slideshow
  const handleMouseEnter = () => {
    if (post.media && post.media.length > 1) {
      intervalRef.current = setInterval(() => {
        setHoverIndex(prev => (prev + 1) % post.media.length);
      }, 800);
    }
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setHoverIndex(0);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get avatar URL - prioritize institution's profile picture, fallback to default
  const getAvatarUrl = () => {
    // If post has an avatar field and it's not null, use it
    if (post.avatar && typeof post.avatar === 'string' && !post.avatar.startsWith('blob:')) {
      // If it's a relative URL, prepend the API base URL (without /api)
      if (post.avatar.startsWith('/')) {
        return `http://localhost:5003${post.avatar}`;
      }
      return post.avatar;
    }
    
    // If institution has a profile picture, use it
    if (post.institutionId?.profilePicture && typeof post.institutionId.profilePicture === 'string' && !post.institutionId.profilePicture.startsWith('blob:')) {
      // If it's a relative URL, prepend the API base URL (without /api)
      if (post.institutionId.profilePicture.startsWith('/')) {
        return `http://localhost:5003${post.institutionId.profilePicture}`;
      }
      return post.institutionId.profilePicture;
    }
    
    // Fallback to a default avatar
    return "https://placehold.co/40x40/6366f1/white?text=" + 
           (getInstitutionName().charAt(0) || "I");
  };

  // Get institution name
  const getInstitutionName = () => {
    if (post.author) return post.author;
    if (post.institutionId?.firstName || post.institutionId?.lastName) {
      return `${post.institutionId.firstName || ''} ${post.institutionId.lastName || ''}`.trim();
    }
    return "Institution";
  };

  // Get media URL with proper base URL
  const getMediaUrl = (mediaItem) => {
    if (!mediaItem || !mediaItem.url) return '';
    
    // Skip blob URLs as they're temporary
    if (typeof mediaItem.url === 'string' && mediaItem.url.startsWith('blob:')) {
      return '';
    }
    
    // If it's a relative URL, prepend the API base URL
    if (typeof mediaItem.url === 'string' && mediaItem.url.startsWith('/')) {
      // Use the same base URL as the API
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5003';
      return `${baseUrl}${mediaItem.url}`;
    // If it's a relative URL, prepend the API base URL (without /api)
    if (typeof mediaItem.url === 'string' && mediaItem.url.startsWith('/')) {
      return `http://localhost:5003${mediaItem.url}`;
    }
    
    return mediaItem.url;
  };

  return (
    <div className="w-[360px] h-[520px] bg-white rounded-xl shadow-sm flex-shrink-0 flex flex-col hover:shadow-lg transition-all">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <img
            src={getAvatarUrl()}
            className="w-8 h-8 rounded-full"
            alt="logo"
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              e.target.src = "https://placehold.co/40x40/6366f1/white?text=" + 
                             (getInstitutionName().charAt(0) || "I");
            }}
          />
          <span className="font-semibold">
            {getInstitutionName()} <span className="text-blue-500">✓</span>
          </span>
        </div>
        
        {/* 3 Dot Menu - Only visible to post owner (institution) */}
        {isInstitution && isOwner && (
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(menuOpen === post._id ? null : post._id)}
              className="text-2xl"
            >
              ⋮
            </button>
            
            {menuOpen === post._id && (
              <div className="absolute right-0 mt-2 bg-white shadow rounded w-32 z-20">
                <button
                  onClick={() => {
                    setEditingPost(post);
                    setMenuOpen(null);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => {
                    onDelete(post._id);
                    setMenuOpen(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image with hover slideshow */}
      <div 
        className="flex-1 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {post.media && post.media.length > 0 && (
          <>
            <img
              src={getMediaUrl(post.media[hoverIndex]) || getMediaUrl(post.media[0])}
              className="w-full h-full object-cover"
              alt="post"
              onError={(e) => {
                // Fallback to a default image if the image fails to load
                e.target.src = "https://placehold.co/600x400/gray/white?text=Image+Not+Found";
              }}
            />
            
            {/* Dot Indicators */}
            {post.media.length > 1 && (
              <div className="absolute bottom-2 left-1/2 flex gap-1 -translate-x-1/2">
                {post.media.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === hoverIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Icons - Visible to everyone */}
      <div className="flex gap-4 px-4 py-2">
        <button onClick={handleLike}>
          <svg 
            className={`w-6 h-6 transition ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-700'}`}
            viewBox="0 0 24 24" 
            fill={isLiked ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        
        <button onClick={() => setShowComments(!showComments)}>
          <svg 
            className="w-6 h-6 text-gray-700" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <button onClick={handleShareAction}>
          <svg 
            className="w-6 h-6 text-gray-700" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
        
        {/* Share Options */}
        {showShare && (
          <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-xl p-4 flex gap-4 z-10">
            <button 
              onClick={copyLink} 
              className="text-gray-700 hover:text-gray-900"
            >
              Copy Link
            </button>
            
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                W
              </div>
            </a>
            
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                f
              </div>
            </a>
            
            <a 
              href={`https://www.instagram.com/`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                I
              </div>
            </a>
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="px-4 text-sm text-gray-700 line-clamp-2 mt-1">
        <span className="font-semibold">{getInstitutionName()}</span>{" "}
        {post.caption}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 px-4 flex-1 overflow-y-auto border-t pt-3">
          {[...localComments].map((c, idx) => (
            <p key={idx} className="text-sm mb-1">
              <span className="font-semibold">{c.user}</span> {c.text}
            </p>
          ))}
          
          <div className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="border rounded-lg w-full px-3 py-2 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              className="text-blue-600 font-semibold text-sm"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Analytics - Visible only to institution owner */}
      {isInstitution && isOwner && post.analytics && (
        <div className="grid grid-cols-4 gap-4 text-xs text-gray-600 mt-2 px-4 pt-3 border-t">
          <span>👁 {post.analytics.views}</span>
          <span>❤️ {likes}</span>
          <span>💬 {post.analytics.comments}</span>
          <span>🔗 {post.analytics.shares}</span>
        </div>
      )}

      {/* Custom styles for line clamping */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}