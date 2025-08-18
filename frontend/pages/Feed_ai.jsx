import React, { useState, useEffect } from "react";
import { Developer, Connection, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DeveloperCard from "../components/DeveloperCard";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../src/utils/feedSlice";

export default function Feed() {
  const [allDevelopers, setAllDevelopers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 4 columns * 2 rows
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));

      setAllDevelopers(res.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleConnectionRequest = async (developer) => {
    if (!currentUser) return;
    try {
      await Connection.create({
        requester_id: currentUser.id,
        receiver_id: developer.created_by,
      });
      // Optimistically remove the developer from the feed
      setAllDevelopers((prev) => prev.filter((d) => d.id !== developer.id));
    } catch (error) {
      console.error("Error creating connection:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allDevelopers.length / itemsPerPage);
  const paginatedDevelopers = allDevelopers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-[var(--surface)]"
        >
          <Sparkles className="w-8 h-8 text-[var(--primary)]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold purple-text mb-2">
            Discover Developers
          </h1>
          <p className="text-[var(--text-muted)]">
            Connect with talented developers from around the world.
          </p>
        </motion.div>

        {paginatedDevelopers.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedDevelopers.map((developer) => (
                <DeveloperCard
                  key={developer.id}
                  developer={developer}
                  onConnect={handleConnectionRequest}
                />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="glass-morphism"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-[var(--text-muted)]">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="glass-morphism"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-3xl p-8 text-center max-w-md mx-auto mt-16"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-[var(--primary)]" />
            <h2 className="text-2xl font-bold text-white mb-4">
              All Caught Up!
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              You've seen all available developers. Check back later for new
              profiles!
            </p>
            <Button
              onClick={loadData}
              className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black"
            >
              Refresh Feed
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
