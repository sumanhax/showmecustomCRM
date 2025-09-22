import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";

//get payment provider
export const getPaymentProvider = createAsyncThunk(
    'payment/getPaymentProvider',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-payment-providers');
            if (response?.data?.status_code === 200) {
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

//payment key setup
// export const paymentKeySetup = createAsyncThunk(
//     'payment/paymentKeySetup',
//     async (userInput, { rejectWithValue }) => {
//         try {
//             const response = await api.post('/payment/get-payment-key-setup', userInput);
//             if (response?.data?.status_code === 200) {
//                 return response?.data;
//             } else {
//                 let errors = errorHandler(response);
//                 return rejectWithValue(errors);
//             }
//         } catch (error) {
//             let errors = errorHandler(error);
//             return rejectWithValue(errors);
//         }
//     }
// )

//payment Key setup stripe

export const paymentKeySetupStripe = createAsyncThunk(
    'payment/paymentKeySetupStripe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payment/get-stripe-payment-key-setup');
            if (response?.data?.status_code === 200) {
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

//payment key setup paypal
export const paymentKeySetupPaypal = createAsyncThunk(
    'payment/paymentKeySetupPaypal',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payment/get-paypal-payment-key-setup');
            if (response?.data?.status_code === 200) {
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

//create paymanet provider
export const createPaymentProvider = createAsyncThunk(
    'payment/createPaymentProvider',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/payment/create-payment-gateway', userInput);
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

export const productOrder = createAsyncThunk(
    'product/productOrder',
    async (userInput, { rejectWithValue }) => {
        console.log("UerInput: ", userInput);

        try {
            const response = await api.post('/order/product-order', userInput);
            if (response?.data?.status_code === 200) {
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
    loading: false,
    error: null,
    provider: [],
    message: "",
    paymentKeysStripe: [],
    paymentKeysPaypal: [],

}
const PaymentProcessorSlice = createSlice(
    {
        name: 'payment',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getPaymentProvider.pending, (state) => {
                state.loading = true
            })
                .addCase(getPaymentProvider.fulfilled, (state, paylaod) => {
                    //console.log("payload: ", paylaod);

                    state.loading = false
                    state.provider = paylaod
                    state.error = null

                })
                .addCase(getPaymentProvider.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(createPaymentProvider.pending, (state) => {
                    state.loading = true
                })
                .addCase(createPaymentProvider.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createPaymentProvider.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';

                })
                .addCase(paymentKeySetupStripe.pending, (state) => {
                    state.loading = true
                })
                .addCase(paymentKeySetupStripe.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentKeysStripe = payload
                    state.error = null
                })
                .addCase(paymentKeySetupStripe.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(paymentKeySetupPaypal.pending, (state) => {
                    state.loading = true
                })
                .addCase(paymentKeySetupPaypal.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentKeysPaypal = payload
                    state.error = null
                })
                .addCase(paymentKeySetupPaypal.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(productOrder.pending, (state) => {
                    state.loading = true
                })
                .addCase(productOrder.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = false
                })
                .addCase(productOrder.rejected, (state, { payload }) => {
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
export default PaymentProcessorSlice.reducer;