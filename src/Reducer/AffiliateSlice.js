import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

//get commission option
export const getCommissionOption = createAsyncThunk(
    'commissionOption/getCommissionOption',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-all-commission-option');
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

//get commission types
export const getCommissionTypes = createAsyncThunk(
    'commission type',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-all-commission-type');
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

//getAffiliatePaid Type
export const getAffiliatePaidType = createAsyncThunk(
    'affiliatePaidType/getAffiliatePaidType',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-all-affiliate-paid-type');
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

//create commission setup
export const createCommissionSetUp = createAsyncThunk(
    'commissionSetup/createCommissionSetUp',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/create-commission-setup', userInput);
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
//create affiliate option
export const createAffiliateOption = createAsyncThunk(
    'affiliateOption/createAffiliateOption',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/create-affiliate-option', userInput);
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
    error: null,
    message: "",
    commission: [],
    commission_type: [],
    affiliate_paid_type: [],
}
const AffiliateSlice = createSlice(
    {
        name: 'affiliate',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getCommissionOption.pending, (state) => {
                state.loading = true;
            })
                .addCase(getCommissionOption.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.commission = payload
                })
                .addCase(getCommissionOption.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getCommissionTypes.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCommissionTypes.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.commission_type = payload
                    state.error = null
                })
                .addCase(getCommissionTypes.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getAffiliatePaidType.pending, (state) => {
                    state.loading = true
                })
                .addCase(getAffiliatePaidType.fulfilled, (state, { payload }) => {

                    state.loading = false
                    state.affiliate_paid_type = payload
                    state.error = null
                })
                .addCase(getAffiliatePaidType.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(createCommissionSetUp.pending, (state) => {
                    state.loading = true
                })
                .addCase(createCommissionSetUp.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createCommissionSetUp.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(createAffiliateOption.pending, (state) => {
                    state.loading = true
                })
                .addCase(createAffiliateOption.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createAffiliateOption.rejected, (state, { payload }) => {
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
export default AffiliateSlice.reducer