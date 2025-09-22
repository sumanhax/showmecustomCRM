import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

//connect funnel with product
export const createFunnelProduct = createAsyncThunk(
    'funnel/createFunnelProduct',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/funnel/create-funnel-product', userInput);
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

export const saveFunnelTemplate = createAsyncThunk(
    'funnel/saveFunnelTemplate',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/funnel/save-funnel-template', userInput);
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

// create funnel
export const createFunnel = createAsyncThunk(
    'funnel/createFunnel',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/funnel/create-funnel', userInput);
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

//get connected product
export const getConnectedProduct = createAsyncThunk(
    'funnel/getConnectedProduct',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/get-connected-item', userInput);
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

export const getJsonfunnel = createAsyncThunk(
    'funnel/getJsonfunnel',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/funnel/get-all-json-funnel-template');
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

export const getHtmlfunnel = createAsyncThunk(
    'funnel/getHtmlfunnel',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(' /funnel/get-all-html-funnel-template');
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


//get upsell product by product id

export const getProductList = createAsyncThunk(
    'product/getProductList',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/get-product-List', id);
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

export const getProductSells = createAsyncThunk(
    'product/getProductSells',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.post('/funnel/get-product-specific-sells', id);
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

export const deleteFunnelProduct = createAsyncThunk(
    'product/deleteFunnelProduct',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.post('/funnel/delete-funnel-product', id);
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
    loading: false,
    error: false,
    message: " ",
    connectedProductList: [],
    singleProduct: [],
    productSells: {},
    deleteFunnel: {},
}
const FunnelSlice = createSlice(
    {
        name: 'funnel',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(createFunnelProduct.pending, (state) => {
                    state.loading = true
                })
                .addCase(createFunnelProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = false
                })
                .addCase(createFunnelProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(saveFunnelTemplate.pending, (state) => {
                    state.loading = true
                })
                .addCase(saveFunnelTemplate.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = false
                })
                .addCase(saveFunnelTemplate.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(createFunnel.pending, (state) => {
                    state.loading = true
                })
                .addCase(createFunnel.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = false
                })
                .addCase(createFunnel.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getConnectedProduct.pending, (state) => {
                    state.loading = true
                })
                .addCase(getConnectedProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.connectedProductList = payload
                    state.error = false
                })
                .addCase(getConnectedProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(getJsonfunnel.pending, (state) => {
                    state.loading = true
                })
                .addCase(getJsonfunnel.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.connectedProductList = payload
                    state.error = false
                })
                .addCase(getJsonfunnel.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(getHtmlfunnel.pending, (state) => {
                    state.loading = true
                })
                .addCase(getHtmlfunnel.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.connectedProductList = payload
                    state.error = false
                })
                .addCase(getHtmlfunnel.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(getProductList.pending, (state) => {
                    state.loading = true
                })
                .addCase(getProductList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleProduct = payload
                    state.error = false
                })
                .addCase(getProductList.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(getProductSells.pending, (state) => {
                    state.loading = true
                })
                .addCase(getProductSells.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.productSells = payload
                    state.error = false
                })
                .addCase(getProductSells.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(deleteFunnelProduct.pending, (state) => {
                    state.loading = true
                })
                .addCase(deleteFunnelProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.deleteFunnel = payload
                    state.error = false
                })
                .addCase(deleteFunnelProduct.rejected, (state, { payload }) => {
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
export default FunnelSlice.reducer;