import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";

//get All DownSell Product
export const getDownsellProduct = createAsyncThunk(
    'downsell/getDownsellProduct',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/sells-product/get-down-sells');
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

//create Downsell Product
export const createDownsellProduct = createAsyncThunk(
    'downsell/createDownsellProduct',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/sells-product/create-down-sell', userInput);
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

//craete Downsell Pricing
export const createDownSellPricing = createAsyncThunk(
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

//get single downsell foer edit
export const getSingleDownSell = createAsyncThunk(
    'downsell/getSingleDownSell',

    async (down_sell_id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/sells-product/get-down-sells/${down_sell_id}`, down_sell_id);
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
// update downsell product

export const updateDownSell = createAsyncThunk(
    'downsell/updateDownSell',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/sells-product/edit-down-sell', userInput);
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
    downSellList: [],
    message: "",
    singleDownSell: {}
}
const DownSellSlice = createSlice(
    {
        name: 'downSells',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getDownsellProduct.pending, (state) => {
                state.loading = true;
            })
                .addCase(getDownsellProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.downSellList = payload
                    state.error = null
                })
                .addCase(getDownsellProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(createDownsellProduct.pending, (state) => {
                    state.loading = true
                })
                .addCase(createDownsellProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createDownsellProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(createDownSellPricing.pending, (state) => {
                    state.loading = true
                })
                .addCase(createDownSellPricing.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createDownSellPricing.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getSingleDownSell.pending, (state) => {
                    state.loading = true
                })
                .addCase(getSingleDownSell.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleDownSell = payload
                    state.error = false
                })
                .addCase(getSingleDownSell.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';

                })
                .addCase(updateDownSell.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateDownSell.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = false
                })
                .addCase(updateDownSell.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.'
                })
        }
    }
)
export default DownSellSlice.reducer;