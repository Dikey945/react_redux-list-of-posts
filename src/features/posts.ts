import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserPosts } from '../api/posts';
import { Post } from '../types/Post';

export const getAsyncPosts = createAsyncThunk(
  'posts/fetch',
  (userId: number) => {
    return getUserPosts(userId);
  },
);

export interface PostsState {
  allPosts: Post[];
  selectedPost: Post | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PostsState = {
  allPosts: [],
  selectedPost: null,
  status: 'idle',
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAsyncPosts.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getAsyncPosts.fulfilled, (state, action) => {
      state.status = 'idle';
      state.allPosts = action.payload;
    });
    builder.addCase(getAsyncPosts.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export default postsSlice.reducer;
export const { setPost } = postsSlice.actions;
