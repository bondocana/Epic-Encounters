import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAdmin: null,
  posts: [],
  posts2: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAdmin = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setFriendRequests: (state, action) => {
      if (state.user) {
        state.user.setFriendRequests = action.payload.setFriendRequests;
      } else {
        console.error("user friend requests non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post_id) return action.payload.post;
        return post;
      });
      state.posts2 = updatedPosts;
    },
    setPosts2: (state, action) => {
      state.posts2 = action.payload.posts2;
    },
    setPost2: (state, action) => {
      const updatedPosts = state.posts2.map((post) => {
        if (post._id === action.payload.post_id) return action.payload.post2;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setFriends,
  setFriendRequests,
  setPosts,
  setPost,
  setPosts2,
  setPost2,
} = authSlice.actions;

export default authSlice.reducer;
