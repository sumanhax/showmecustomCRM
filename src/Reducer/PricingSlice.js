import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const getCurrency = createAsyncThunk(
    'get-currency',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-all-cuurency');
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
export const getPaymentType = createAsyncThunk(
    'payment-provider',

    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-payment-type');
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

export const addPricing = createAsyncThunk(
    'add-pricing',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/price/add-price-option', userInput);
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
export const addProductQuantity = createAsyncThunk(
    'add-product-quantity',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/add-product-quantity', userInput);
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
    error: "",
    currency: [],
    paymentType: [],
    message: ""
}
const PricingSlice = createSlice(
    {
        'name': 'currencies',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getCurrency.pending, (state) => {
                state.loading = true
            })
                .addCase(getCurrency.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.currency = payload
                    state.error = null
                })
                .addCase(getCurrency.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getPaymentType.pending, (state) => {
                    state.loading = true
                })
                .addCase(getPaymentType.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentType = payload
                    state.error = null
                })
                .addCase(getPaymentType.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(addPricing.pending, (state) => {
                    state.loading = true
                })
                .addCase(addPricing.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = ""
                })
                .addCase(addPricing.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(addProductQuantity.pending, (state) => {
                    state.loading = true
                })
                .addCase(addProductQuantity.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = ""
                })
                .addCase(addProductQuantity.rejected, (state, { payload }) => {
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
export default PricingSlice.reducer;