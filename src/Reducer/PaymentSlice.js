import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";

export const getStripeSecrate = createAsyncThunk(
    'getStripekey',
    async (userInput, { rejectWithValue }) => {
        console.log("UerInput: ", userInput);

        try {
            const response = await api.post('/stripe/client-secret', userInput);
            if (response?.data?.status_code === 201) {
                return response?.data;
            } else {
                let errors = errorHandler(response);
                return rejectWithValue(errors);
            }
        } catch (error) {
            let errors = errorHandler(error);
            return rejectWithValue(errors);
        }
    }
)
const initialState = {
    stripeKey: "",
    loading: false,
    error: false
}
const PaymentSlice = createSlice(
    {
        name: "payment",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getStripeSecrate.pending, (state) => {
                    state.loading = true
                })
                .addCase(getStripeSecrate.fulfilled, (state, { payload }) => {
                    state.stripeKey = payload
                    state.loading = false
                    state.error = false
                })
                .addCase(getStripeSecrate.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
        }
    }
)
export default PaymentSlice.reducer