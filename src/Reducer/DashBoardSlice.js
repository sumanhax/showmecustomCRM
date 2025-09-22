import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const dashboardCards = createAsyncThunk(
    'cards',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/counts');
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
    error: null,
    dashboardData: []
}
const DashBoardSlice = createSlice(
    {
        name: 'dashboards',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(dashboardCards.pending, (state) => {
                state.loading = true;
            })
                .addCase(dashboardCards.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.dashboardData = payload
                    state.error = false
                })
                .addCase(dashboardCards.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';

                })
        }
    }
)
export default DashBoardSlice.reducer;