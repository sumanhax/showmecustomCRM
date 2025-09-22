import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";

//getAll Upsell Product
export const getUpSell = createAsyncThunk(
    'sell/getUpsell',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/sells-product/get-up-sells');
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



//create Upsell Product
export const createUpSellOption = createAsyncThunk(
    'sell/createUpsellOption',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/sells-product/create-up-sell', userInput);
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


//create upsell Pricing
export const createUpSellPricing = createAsyncThunk(
    'sell/createUpsellPricing',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/sells-price/add-sells-price-option', userInput);
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

//get single upsell
export const getSingleUpSell = createAsyncThunk(
    'upSell/getSingleUpSell',

    async (up_sell_id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/sells-product/get-up-sell/${up_sell_id}`, up_sell_id);
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

//update upsell
export const updateUpSell = createAsyncThunk(
    'upSell/updateUpSell',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/sells-product/edit-up-sell', userInput);
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
    upSellList: [],
    message: " ",
    singleUpSell: {}
}
const UpSellSlice = createSlice(
    {
        name: 'upSells',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getUpSell.pending, (state) => {
                state.loading = true
            })
                .addCase(getUpSell.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.upSellList = payload
                    state.error = null
                })
                .addCase(getUpSell.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(createUpSellOption.pending, (state) => {
                    state.loading = true
                })
                .addCase(createUpSellOption.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createUpSellOption.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(createUpSellPricing.pending, (state) => {
                    state.loading = true
                })
                .addCase(createUpSellPricing.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createUpSellPricing.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getSingleUpSell.pending, (state) => {
                    state.loading = true
                })
                .addCase(getSingleUpSell.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleUpSell = payload
                    state.error = null
                })
                .addCase(getSingleUpSell.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(updateUpSell.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateUpSell.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = false
                })
                .addCase(updateUpSell.rejected, (state, { payload }) => {
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
export default UpSellSlice.reducer;