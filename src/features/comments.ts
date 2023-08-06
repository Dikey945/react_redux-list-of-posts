import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createComment, deleteComment, getPostComments } from '../api/comments';
import { Comment } from '../types/Comment';

export interface CommentsState {
  allComments: Comment[] | null
  commentsStatus: 'idle' | 'loading' | 'failed';
  newCommentStatus: 'idle' | 'loading' | 'failed';
}

const initialState: CommentsState = {
  allComments: null,
  commentsStatus: 'idle',
  newCommentStatus: 'idle',
};

export const createCommentAsync = createAsyncThunk(
  'comments/postComment',
  async (data: Omit<Comment, 'id'>) => {
    const newComment = await createComment(data);

    return newComment;
  },
);

export const deleteCommentAsync = createAsyncThunk(
  'comments/deleteComment',
  async (commentID: number) => {
    await deleteComment(commentID);

    return commentID;
  },
);

export const getCommentsAsync = createAsyncThunk(
  'comments/fetchComments',
  async (postID: number) => {
    const comments = await getPostComments(postID);

    return comments;
  },
);
export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    delCommentFromState: (state, action) => {
      if (state.allComments && state.allComments.length) {
        state.allComments = state.allComments
          .filter((comment) => comment.id !== action.payload);
      } else {
        state.allComments = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCommentsAsync.pending, (state) => {
      state.commentsStatus = 'loading';
    });
    builder.addCase(getCommentsAsync.fulfilled, (state, action) => {
      state.commentsStatus = 'idle';
      state.allComments = action.payload;
    });
    builder.addCase(getCommentsAsync.rejected, (state) => {
      state.commentsStatus = 'failed';
    });
    builder.addCase(createCommentAsync.pending, (state) => {
      state.newCommentStatus = 'loading';
    });
    builder.addCase(createCommentAsync.fulfilled, (state, action) => {
      state.newCommentStatus = 'idle';
      if (state.allComments) {
        state.allComments.push(action.payload);
      }
    });
    builder.addCase(createCommentAsync.rejected, (state) => {
      state.newCommentStatus = 'failed';
    });
    builder.addCase(deleteCommentAsync.pending, (state) => {
      state.newCommentStatus = 'loading';
    });
    builder.addCase(deleteCommentAsync.fulfilled, (state, action) => {
      state.newCommentStatus = 'idle';
      if (state.allComments) {
        state.allComments = state.allComments
          .filter((comment) => comment.id !== action.payload);
      }
    });
    builder.addCase(deleteCommentAsync.rejected, (state) => {
      state.newCommentStatus = 'failed';
    });
  },
});

export default commentsSlice.reducer;
export const { delCommentFromState } = commentsSlice.actions;
