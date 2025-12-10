import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePosts } from "../../context/PostContext";
import InstitutionPostCard from "../common/InstitutionPostCard";
import { useAuth } from "../../context/AuthContext";

// Define mock events data
const mockEvents = [
  {
    id: 1,
    title: "Hackathon 2025",
    description: "Annual coding competition for students and alumni",
    date: "2025-08-12",
    time: "09:00",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Alumni Networking Night",
    description: "Connect with fellow alumni and industry professionals",
    date: "2025-07-20",
    time: "18:30",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Alumni Meet 2024",
    description: "Annual alumni gathering",
    date: "2024-01-10",
    time: "14:00",
    status: "past"
  }
];

export default function PostFeed() {
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "events"
  const [openModal, setOpenModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Store actual file objects
  const [caption, setCaption] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const { posts, createPost, loading, error, fetchPosts } = usePosts();
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Current user (from auth context)
  const currentUser = {
    role: "institution",
    id: user?.id,
    institutionId: user?.id
  };

  // Fetch posts when component mounts
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files); // Store actual file objects
    
    // Create preview URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(imageUrls);
  };

  const handlePostSubmit = async () => {
    try {
      if (editingPost) {
        // For now, we'll just show an alert since editing isn't fully implemented
        alert("Edit functionality would be implemented here");
      } else {
        // Create new post
        const postData = {
          author: user.firstName + " " + user.lastName,
          caption,
          visibility: "public"
        };
        
        await createPost(postData, imageFiles);
      }

      setOpenModal(false);
      setImages([]);
      setImageFiles([]);
      setCaption('');
      setEditingPost(null);
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post. Please try again.");
    }
  };
  const handleLike = (id) => {
    // This will be handled by the PostCard component now
  };

  const handleComment = (postId) => {
    // This will be handled by the PostCard component now
  };

  const handleShare = (id) => {
    // This will be handled by the PostCard component now
  };

  const handleCreateEvent = () => {
    // Event creation logic would go here
    alert("Event created successfully!");
  };

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
      <div className="bg-gray-50 min-h-screen pt-[72px] pb-20 flex items-center justify-center">
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
      <div className="bg-gray-50 min-h-screen pt-[72px] pb-20 flex items-center justify-center">
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
    <div className="bg-gray-50 min-h-screen pt-[72px] pb-20">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold">Institution Engagement</h2>
        <p className="text-gray-500 mt-1">
          Manage posts, announcements, and events
        </p>

        <div className="flex gap-4 mt-6">
          <button 
            className={`px-6 py-2 rounded-full ${activeTab === "posts" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("posts")}
          >
            Your Posts
          </button>
          <button 
            className={`px-6 py-2 rounded-full ${activeTab === "events" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("events")}
          >
            Your Events
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "posts" ? (
        /* YOUR POSTS VIEW */
        <div>
          {/* Posts Feed */}
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
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InstitutionPostCard 
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
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      setEditingPost={(postToEdit) => {
                        setEditingPost(postToEdit);
                        setImages(postToEdit.media.map(m => m.url));
                        setCaption(postToEdit.caption);
                        setOpenModal(true);
                      }}
                      onDelete={(id) => {
                        // Handle delete logic here
                      }}
                      currentUser={currentUser}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
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
      ) : (
        /* YOUR EVENTS VIEW */
        <div className="max-w-4xl mx-auto">
          {/* Create Event Card */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create Event</h3>

            <input
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Event Title"
            />

            <textarea
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Event Description"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input 
                type="date" 
                className="border p-3 rounded-lg" 
              />
              <input 
                type="time" 
                className="border p-3 rounded-lg" 
              />
            </div>

            <button 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              onClick={handleCreateEvent}
            >
              Publish Event
            </button>
          </div>

          {/* Events Sections */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex gap-4 mb-4">
              <button className="px-4 py-2 rounded bg-green-100 text-green-700">
                Upcoming Events
              </button>
              <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
                Past Events
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="grid grid-cols-2 gap-6">
              {mockEvents.filter(event => event.status === "upcoming").map(event => (
                <div key={event.id} className="bg-white rounded-xl p-5 shadow border border-gray-100">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                  <button className="mt-3 text-purple-600 font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Past Events */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-700 mb-3">Past Events</h4>
              <div className="space-y-3">
                {mockEvents.filter(event => event.status === "past").map(event => (
                  <div key={event.id} className="bg-gray-50 border rounded-xl p-5">
                    <h4 className="font-semibold text-gray-600">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Completed • {event.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Post Button */}
      {activeTab === "posts" && (
        <button
          onClick={() => setOpenModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full 
                     bg-purple-600 text-white text-3xl shadow-lg hover:scale-110 transition-transform"
        >
          +
        </button>
      )}

      {/* Post Creation/Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-xl p-5 relative">
            <h2 className="text-lg font-bold mb-3">
              {editingPost ? "Edit Post" : "Create Post"}
            </h2>

            {/* IMAGE UPLOAD */}
            <label className="border-dashed border-2 rounded-lg h-48 
                              flex items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <span className="text-gray-500">
                Click to upload images
              </span>
            </label>

            {/* IMAGE PREVIEW */}
            {images.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-24 w-24 object-cover rounded"
                    alt="Preview"
                  />
                ))}
              </div>
            )}

            {/* CAPTION */}
            <textarea
              placeholder="Write a caption..."
              className="w-full border rounded-lg p-3 mt-3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => {
                  setOpenModal(false);
                  setImages([]);
                  setImageFiles([]);
                  setCaption('');
                  setEditingPost(null);
                }}
              >
                Cancel
              </button>

              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                onClick={handlePostSubmit}
              >
                {editingPost ? "Update" : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}