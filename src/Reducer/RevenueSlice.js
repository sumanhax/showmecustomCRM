import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const getRevenue = createAsyncThunk(
    'revenue/getRevenue',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('adminRevenue/get-revenue', userInput);
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
    revenueData: [],
    loading: false,
    error: false
}
const RevenueSlice = createSlice(
    {
        name: 'revenue',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getRevenue.pending, (state) => {
                state.loading = true
            })
                .addCase(getRevenue.fulfilled, (state, { payload }) => {
                    state.revenueData = payload
                    state.loading = false
                    state.error = false
                })
                .addCase(getRevenue.rejected, (state, { payload }) => {
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
export default RevenueSlice.reducer;