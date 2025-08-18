import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  connections: [],
};
const connectionSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    addConnection: (state, action) => {
      state.connections = action.payload;
    },
    removeConnection: () => {
      return null;
    },
  },
});

export const { addConnection, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
