import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../src/utils/feedSlice";
import Card from "../component/Card.jsx";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const REFRESH_THRESHOLD = 10; // Min number of users before refreshing
const REFRESH_INTERVAL = 10000; // 10 seconds
const ITEMS_PER_PAGE = 8; // 4 columns * 2 rows

const Feed = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getFeed = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/feed`, {
        withCredentials: true,
      });
      //console.log(res.data);
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    }
    setIsLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    getFeed();
  }, []);
  const feed = useSelector((store) => store.feed);

  // Periodic check and refresh if needed
  useEffect(() => {
    const interval = setInterval(() => {
      if (!feed || feed.length < REFRESH_THRESHOLD) {
        getFeed();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [feed]);

  // Pagination logic
  const totalPages = Math.ceil((feed?.length || 0) / ITEMS_PER_PAGE);
  const paginatedFeed = feed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-white/10 shadow-lg"
        >
          <Sparkles className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-purple-300 mb-2">
            Discover Developers
          </h1>
          <p className="text-purple-200">
            Connect with talented developers from around the world.
          </p>
        </motion.div>

        {paginatedFeed.length > 0 ? (
          <>
            {/* Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedFeed.map((user) => (
                <Card key={user._id} user={user} />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-purple-300 hover:bg-white/20 transition disabled:opacity-50 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <span className="text-purple-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-purple-300 hover:bg-white/20 transition disabled:opacity-50 flex items-center"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </>
        ) : (
          // Empty feed message
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center max-w-md mx-auto mt-16 shadow-lg"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white mb-4">
              All Caught Up!
            </h2>
            <p className="text-purple-200 mb-6">
              You've seen all available developers. Check back later for new
              profiles!
            </p>
            <button
              onClick={getFeed}
              className="px-6 py-2 rounded-lg bg-purple-400 hover:bg-purple-300 text-black font-semibold transition"
            >
              Refresh Feed
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;
