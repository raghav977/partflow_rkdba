import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../apis/authApi';

// Get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const user = localStorage.getItem('user');
  
  return {
    token: token || null,
    role: role || null,
    user: user ? JSON.parse(user) : null,
    loading: false,
    error: null,
    isAuthenticated: !!token,
  };
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login fulfilled
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = {
          id: action.payload.userId,
          name: action.payload.name,
          email: action.payload.email,
        };
        state.isAuthenticated = true;
        state.error = null;

        // Persist to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('userId', action.payload.userId);
      })
      // Login rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
        state.token = null;
        state.role = null;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
