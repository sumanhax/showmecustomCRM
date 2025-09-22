import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const createInvoice = createAsyncThunk(
    'invoice',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/order/product-invoice', userInput);
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

export const addInvoiceData = createAsyncThunk(
    'addInvoiceData',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/order/add-invoice-data', userInput);
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
    invo: [],
    invoData: [],
    loadingInvo: false,
    loading: false,
    error: false
}
const InvoiceSlice = createSlice(
    {
        name: 'invoiceData',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(createInvoice.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createInvoice.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.invo = payload
                    state.error = false
                })
                .addCase(createInvoice.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';

                })

                .addCase(addInvoiceData.pending, (state) => {
                    state.loadingInvo = true;
                })
                .addCase(addInvoiceData.fulfilled, (state, { payload }) => {
                    state.loadingInvo = false
                    state.invoData = payload
                    state.error = false
                })
                .addCase(addInvoiceData.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loadingInvo = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';

                })
        }
    }
)
export default InvoiceSlice.reducer;