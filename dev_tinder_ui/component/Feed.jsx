import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../src/utils/feedSlice";
import Card from "./Card.jsx";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      if (feed && feed.length > 0) return; // Prevent unnecessary re-fetching
      const res = await axios.get(`${serverUrl}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data)); // Store feed data in Redux
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-6">
      <div className="flex flex-wrap justify-center gap-6">
        {feed && feed.length > 0 ? (
          feed.map((user) => <Card key={user._id} user={user} />)
        ) : (
          <p className="text-center text-lg text-purple-200">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
