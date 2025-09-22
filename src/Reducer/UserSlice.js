import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const getUsers = createAsyncThunk(
    'getUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/list');
            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                if (response?.data?.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    return rejectWithValue('Something went wrong.');
                }
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)
export const userActiveDeactive = createAsyncThunk(
    'userActiveDeactive',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/status/${user_input}`);
            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                if (response?.data?.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    return rejectWithValue('Something went wrong.');
                }
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)
const initialState = {
    loading: false,
    userData: [],
    error: false
}
const UserSlice = createSlice(
    {
        name: 'users',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getUsers.pending, (state) => {
                    state.loading = true
                })
                .addCase(getUsers.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.userData = payload
                    state.error = false
                })
                .addCase(getUsers.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }
)
export default UserSlice.reducer