import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const paymentSetUpkey = createAsyncThunk(
    'payment/paymentSetUpkey',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/payment/create-user-key', userInput);
            if (response?.data?.status_code === 201) {
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
    error: false,
    nessage: ""
}
const PaymentSetupSlice = createSlice(
    {
        name: 'setupkeys',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(paymentSetUpkey.pending, (state) => {
                state.loading = true
            })
                .addCase(paymentSetUpkey.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.nessage = payload
                    state.error = false
                })
                .addCase(paymentSetUpkey.rejected, (state, { payload }) => {
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
export default PaymentSetupSlice.reducer;