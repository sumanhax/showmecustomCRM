import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";
import newApi from "../store/NewApi";

//get orderList
export const getOrderList = createAsyncThunk(
    'order/getOrderList',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.get(`/order/product-order-list?limit=${userInput?.limit}&&skip=${userInput?.page}`);
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


export const getCount = createAsyncThunk(
    'order/getCount',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.get('/order/product-order-count', userInput);
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


export const getOfflineOrderDetails = createAsyncThunk(
    'order/getOfflineOrderDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await newApi.get(`/api/orders/offline-details/${id}`);
            if (response?.status === 200 || response?.data?.status === true || response?.data?.status_code === 200) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch offline order details.');
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong.');
        }
    }
);

const initialState = {
    loading: false,
    error: false,
    orderList: [],
    count: {},
    offlineOrderDetailsLoading: false,
    offlineOrderDetailsError: null,
    offlineOrderDetailsData: null,
}
const OrderSlice = createSlice(
    {
        name: "ordersList",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getOrderList.pending, (state) => {
                    state.loading = true
                })
                .addCase(getOrderList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.orderList = payload
                })
                .addCase(getOrderList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(getCount.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCount.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.count = payload
                })
                .addCase(getCount.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                // Offline Order Details Cases
                .addCase(getOfflineOrderDetails.pending, (state) => {
                    state.offlineOrderDetailsLoading = true;
                    state.offlineOrderDetailsError = null;
                })
                .addCase(getOfflineOrderDetails.fulfilled, (state, { payload }) => {
                    state.offlineOrderDetailsLoading = false;
                    state.offlineOrderDetailsData = payload;
                    state.offlineOrderDetailsError = null;
                })
                .addCase(getOfflineOrderDetails.rejected, (state, { payload }) => {
                    state.offlineOrderDetailsLoading = false;
                    state.offlineOrderDetailsError = payload || 'Failed to fetch offline order details.';
                });
        }
    }
)
export default OrderSlice.reducer;