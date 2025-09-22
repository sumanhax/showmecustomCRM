import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getProductCategory = createAsyncThunk(
    'productCategory/getProductCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-product-types');
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

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/create-product', userInput);
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

export const getProductMode = createAsyncThunk(
    'product/getProductMode',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/get-product-modes');
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

export const getProductList = createAsyncThunk(
    'product/getProductList',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/get-product-List', userId);
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

export const checkOutUrl = createAsyncThunk(
    'product/checkOutUrl',
    async (check_out_url, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/find-checkout-url', check_out_url);
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

export const addProductImage = createAsyncThunk(
    'product/addProductImage',

    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/add-product-images', userInput);
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

export const activeDeactiveProduct = createAsyncThunk(
    'active_deactive',
    async (product_id, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/active-deactive', product_id);
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

export const editProduct = createAsyncThunk(
    'product/editProduct',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/get-edit-product', userInput);
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

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/product/update-product', userInput);
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
    productCategory: [],
    loading: false,
    error: '',
    message: "",
    productMode: [],
    productList: [],
    existCheckOutUrls: "",
    active_deactive: {},
    productDetail: {},
    productLoad: false,
}
const ProductSlice = createSlice(
    {
        name: 'productCategory',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getProductCategory.pending, (state) => {
                    state.loading = true
                })
                .addCase(getProductCategory.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.productCategory = payload
                    state.error = ""
                })
                .addCase(getProductCategory.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(addProduct.pending, (state) => {
                    state.loading = true
                })
                .addCase(addProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = ""
                })
                .addCase(addProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getProductMode.pending, (state) => {
                    state.loading = true
                })
                .addCase(getProductMode.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.productMode = payload
                    state.error = ""
                })
                .addCase(getProductMode.rejected, (state, { payload }) => {
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
                    state.productList = payload
                    state.error = ""
                })
                .addCase(getProductList.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(checkOutUrl.pending, (state) => {
                    state.loading = true
                })
                .addCase(checkOutUrl.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.existCheckOutUrls = payload
                    state.error = null
                })
                .addCase(checkOutUrl.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(addProductImage.pending, (state) => {
                    state.loading = true
                })
                .addCase(addProductImage.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(addProductImage.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(activeDeactiveProduct.pending, (state) => {
                    state.loading = true
                })
                .addCase(activeDeactiveProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.active_deactive = payload
                    state.error = false
                })
                .addCase(activeDeactiveProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(editProduct.pending, (state) => {
                    state.loading = true
                })
                .addCase(editProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.productDetail = payload
                    state.error = ""
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(editProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(updateProduct.pending, (state) => {
                    state.productLoad = true
                })
                .addCase(updateProduct.fulfilled, (state, { payload }) => {
                    state.productLoad = false
                    state.message = payload
                    state.error = ""
                })
                .addCase(updateProduct.rejected, (state, { payload }) => {
                    state.error = true;
                    state.productLoad = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
        }
    }
)
export default ProductSlice.reducer;