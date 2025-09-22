import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
export const getRoles = createAsyncThunk(
    'getRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/role/get-role-list');
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
    roleData: [],
    error: false
}
const RoleSlice = createSlice(
    {
        name: "roles",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getRoles.pending, (state) => {
                    state.loading = true
                })
            .addCase(getRoles.fulfilled, (state, { payload }) => {
                state.loading = false
                state.roleData = payload
                state.error = false
            })
            .addCase(getRoles.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
        }
    }
)
export default RoleSlice.reducer