import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUsers } from '../api/users';
import { User } from '../types/User';

export const initUsers = createAsyncThunk('users/fetch', () => {
  return getUsers();
});

export interface UserState {
  users: User[];
  selectedUser: User | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  status: 'idle',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initUsers.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(initUsers.fulfilled, (state, action) => {
      state.status = 'idle';
      state.users = action.payload;
    });
    builder.addCase(initUsers.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
