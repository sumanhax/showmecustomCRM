import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";

export const getPaymentMethods = createAsyncThunk(
    'getPaymentMethods',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('admin/payment-method/list');
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const addPaymentMethod = createAsyncThunk(
    'addPaymentMethod',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('admin/payment-method/create', userInput);
            if (response?.data?.status_code === 201) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const paymentMethodDetail = createAsyncThunk(
    'paymentMethodDetail',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('admin/payment-method/detail', userInput);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const updatePaymentMethod = createAsyncThunk(
    'updatePaymentMethod',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.put('admin/payment-method/update', userInput);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const paymentMethodCountryDropdown = createAsyncThunk(
    'paymentMethodCountryDropdown',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('admin/payment-method/country-dropdown', userInput);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const paymentMethodDropdown = createAsyncThunk(
    'paymentMethodDropdown',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('admin/payment-method/dropdown');
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const countryMapAdd = createAsyncThunk(
    'countryMapAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('admin/payment-method/country-map/create', userInput);
            if (response?.data?.status_code === 201) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const getPaymentMethodKeys = createAsyncThunk(
    'getPaymentMethodKeys',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`admin/payment-method-key/list`, input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const updatePaymentMethodKey = createAsyncThunk(
    'updatePaymentMethodKey',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('admin/payment-method-key/add', userInput);
            if (response?.data?.status_code === 200 || response?.data?.status_code === 201) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const initialState = {
    loading: false,
    error: false,
    paymentMethods: {},
    addloading: false,
    paymentMethodAdded: {},
    paymentMethodDetails: {},
    updateloading: false,
    paymentMethodUpdated: {},
    paymentMethodCountry: [],
    countries: {},
    countryMapAdded: {},
    paymentMethodKeys: {},
    paymentMethodKeyUpdated: {},

}

const PaymentMethodSlice = createSlice(
    {
        name: "paymentMethod",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getPaymentMethods.pending, (state) => {
                    state.loading = true
                })
                .addCase(getPaymentMethods.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentMethods = payload
                    state.error = false
                })
                .addCase(getPaymentMethods.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(addPaymentMethod.pending, (state) => {
                    state.addloading = true
                })
                .addCase(addPaymentMethod.fulfilled, (state, { payload }) => {
                    state.addloading = false
                    state.paymentMethodAdded = payload
                    state.error = false
                })
                .addCase(addPaymentMethod.rejected, (state, { payload }) => {
                    state.addloading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(paymentMethodDetail.pending, (state) => {
                    state.loading = true
                })
                .addCase(paymentMethodDetail.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentMethodDetails = payload
                    state.error = false
                })
                .addCase(paymentMethodDetail.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(updatePaymentMethod.pending, (state) => {
                    state.updateloading = true
                })
                .addCase(updatePaymentMethod.fulfilled, (state, { payload }) => {
                    state.updateloading = false
                    state.paymentMethodUpdated = payload
                    state.error = false
                })
                .addCase(updatePaymentMethod.rejected, (state, { payload }) => {
                    state.updateloading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(paymentMethodCountryDropdown.pending, (state) => {
                    state.loading = true
                })
                .addCase(paymentMethodCountryDropdown.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentMethodCountry = payload
                    state.error = false
                })
                .addCase(paymentMethodCountryDropdown.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(paymentMethodDropdown.pending, (state) => {
                    state.loading = true
                })
                .addCase(paymentMethodDropdown.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.countries = payload
                    state.error = false
                })
                .addCase(paymentMethodDropdown.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(countryMapAdd.pending, (state) => {
                    state.addloading = true
                })
                .addCase(countryMapAdd.fulfilled, (state, { payload }) => {
                    state.addloading = false
                    state.countryMapAdded = payload
                    state.error = false
                })
                .addCase(countryMapAdd.rejected, (state, { payload }) => {
                    state.addloading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(getPaymentMethodKeys.pending, (state) => {
                    state.loading = true
                })
                .addCase(getPaymentMethodKeys.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentMethodKeys = payload
                    state.error = false
                })
                .addCase(getPaymentMethodKeys.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(updatePaymentMethodKey.pending, (state) => {
                    state.updateloading = true
                })
                .addCase(updatePaymentMethodKey.fulfilled, (state, { payload }) => {
                    state.updateloading = false
                    state.paymentMethodKeyUpdated = payload
                    state.error = false
                })
                .addCase(updatePaymentMethodKey.rejected, (state, { payload }) => {
                    state.updateloading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

        }
    }
)
export default PaymentMethodSlice.reducer;