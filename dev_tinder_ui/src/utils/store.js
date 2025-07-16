import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice.js";
import feedReducer from "../utils/feedSlice.js";
import connectionReducer from "./requestSlice.js";
export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    request: connectionReducer,
  },
});

export default store;
