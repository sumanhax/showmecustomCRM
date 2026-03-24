import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import newApi from "../store/NewApi";

export const dashboardCards = createAsyncThunk(
    'cards',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/counts');
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

export const bannerUpload = createAsyncThunk(
    'dashboard/bannerUpload',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await newApi.post('/api/banners/save', formData);
            if (response?.data?.status_code === 200 || response?.status === 200) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.errors || 'Something went wrong.');
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)


// POST /api/logo-placement/create
export const createLogoPlacement = createAsyncThunk(
    'dashboard/createLogoPlacement',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await newApi.post('/api/logo-placement/save', formData);
            if (response?.data?.status === true || response?.status === 201) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Something went wrong.');
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)


export const getOfflineOrderProfit = createAsyncThunk(
    'dashboard/getOfflineOrderProfit',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/offline-order/stage/4');
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch profit data.');
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong.');
        }
    }
);

export const getOnlineOrderSales = createAsyncThunk(
    'dashboard/getOnlineOrderSales',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/admin/sales/total-sales');
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch online sales data.');
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong.');
        }
    }
);

export const getOfflineTotalSales = createAsyncThunk(
    'dashboard/getOfflineTotalSales',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/offline-order/total-sales');
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch offline sales data.');
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong.');
        }
    }
);

export const getTotalLeads = createAsyncThunk(
    'dashboard/getTotalLeads',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/admin/leads/sales/all');
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch lead statistics.');
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong.');
        }
    }
);

export const getLeadDistribution = createAsyncThunk(
    'dashboard/getLeadDistribution',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/admin/leads/distribution/rep');
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch lead distribution.');
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong.');
        }
    }
);

export const getLeadDistributionState = createAsyncThunk(
    'dashboard/getLeadDistributionState',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/admin/leads/distribution/state');
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch lead distribution.');
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong.');
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    dashboardData: [],
    bannerLoading: false,
    bannerError: null,
    bannerData: null,
    logoPlacementLoading: false,
    logoPlacementError: null,
    logoPlacementData: null,
    offlineProfitLoading: false,
    offlineProfitError: null,
    offlineProfitData: null,

    onlineTotalSalesLoading: false,
    onlineTotalSalesError: null,
    onlineTotalSalesData: null,
    offlineTotalSalesLoading: false,
    offlineTotalSalesError: null,
    offlineTotalSalesData: null,

    totalLeadsLoading: false,
    totalLeadsError: null,
    totalLeadsData: null,

    leadDistributionLoading: false,
    leadDistributionError: null,
    leadDistributionData: null,

    leadDistributionStateLoading: false,
    leadDistributionStateError: null,
    leadDistributionStateData: null,
}
const DashBoardSlice = createSlice(
    {
        name: 'dashboards',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(dashboardCards.pending, (state) => {
                state.loading = true;
            })
                .addCase(dashboardCards.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.dashboardData = payload
                    state.error = false
                })
                .addCase(dashboardCards.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';

                })
                // Banner Upload
                .addCase(bannerUpload.pending, (state) => {
                    state.bannerLoading = true;
                    state.bannerError = null;
                })
                .addCase(bannerUpload.fulfilled, (state, { payload }) => {
                    state.bannerLoading = false;
                    state.bannerData = payload;
                    state.bannerError = null;
                })
                .addCase(bannerUpload.rejected, (state, { payload }) => {
                    state.bannerLoading = false;
                    state.bannerError = payload?.message || 'Banner upload failed.';
                })

                // Create Logo Placement
                .addCase(createLogoPlacement.pending, (state) => {
                    state.logoPlacementLoading = true;
                    state.logoPlacementError = null;
                })
                .addCase(createLogoPlacement.fulfilled, (state, { payload }) => {
                    state.logoPlacementLoading = false;
                    state.logoPlacementData = payload?.data;
                    state.logoPlacementError = null;
                })
                .addCase(createLogoPlacement.rejected, (state, { payload }) => {
                    state.logoPlacementLoading = false;
                    state.logoPlacementError = payload || 'Logo placement creation failed.';
                })

                .addCase(getOfflineOrderProfit.pending, (state) => {
                    state.offlineProfitLoading = true;
                    state.offlineProfitError = null;
                })
                .addCase(getOfflineOrderProfit.fulfilled, (state, { payload }) => {
                    state.offlineProfitLoading = false;
                    state.offlineProfitData = payload;
                    state.offlineProfitError = null;
                })
                .addCase(getOfflineOrderProfit.rejected, (state, { payload }) => {
                    state.offlineProfitLoading = false;
                    state.offlineProfitError = payload || 'Failed to fetch profit details.';
                })

                // Online Order Sales
                .addCase(getOnlineOrderSales.pending, (state) => {
                    state.onlineTotalSalesLoading = true;
                    state.onlineTotalSalesError = null;
                })
                .addCase(getOnlineOrderSales.fulfilled, (state, { payload }) => {
                    state.onlineTotalSalesLoading = false;
                    state.onlineTotalSalesData = payload;
                    state.onlineTotalSalesError = null;
                })
                .addCase(getOnlineOrderSales.rejected, (state, { payload }) => {
                    state.onlineTotalSalesLoading = false;
                    state.onlineTotalSalesError = payload || 'Failed to fetch online sales details.';
                })

                // Offline Total Sales
                .addCase(getOfflineTotalSales.pending, (state) => {
                    state.offlineTotalSalesLoading = true;
                    state.offlineTotalSalesError = null;
                })
                .addCase(getOfflineTotalSales.fulfilled, (state, { payload }) => {
                    state.offlineTotalSalesLoading = false;
                    state.offlineTotalSalesData = payload;
                    state.offlineTotalSalesError = null;
                })
                .addCase(getOfflineTotalSales.rejected, (state, { payload }) => {
                    state.offlineTotalSalesLoading = false;
                    state.offlineTotalSalesError = payload || 'Failed to fetch offline sales details.';
                })

                // Total Leads Statistics
                .addCase(getTotalLeads.pending, (state) => {
                    state.totalLeadsLoading = true;
                    state.totalLeadsError = null;
                })
                .addCase(getTotalLeads.fulfilled, (state, { payload }) => {
                    state.totalLeadsLoading = false;
                    state.totalLeadsData = payload;
                    state.totalLeadsError = null;
                })
                .addCase(getTotalLeads.rejected, (state, { payload }) => {
                    state.totalLeadsLoading = false;
                    state.totalLeadsError = payload || 'Failed to fetch lead statistics.';
                })

                .addCase(getLeadDistribution.pending, (state) => {
                    state.leadDistributionLoading = true;
                    state.leadDistributionError = null;
                })
                .addCase(getLeadDistribution.fulfilled, (state, { payload }) => {
                    state.leadDistributionLoading = false;
                    state.leadDistributionData = payload;
                    state.leadDistributionError = null;
                })
                .addCase(getLeadDistribution.rejected, (state, { payload }) => {
                    state.leadDistributionLoading = false;
                    state.leadDistributionError = payload || 'Failed to fetch lead distribution.';
                })

                .addCase(getLeadDistributionState.pending, (state) => {
                    state.leadDistributionStateLoading = true;
                    state.leadDistributionStateError = null;
                })
                .addCase(getLeadDistributionState.fulfilled, (state, { payload }) => {
                    state.leadDistributionStateLoading = false;
                    state.leadDistributionStateData = payload;
                    state.leadDistributionStateError = null;
                })
                .addCase(getLeadDistributionState.rejected, (state, { payload }) => {
                    state.leadDistributionStateLoading = false;
                    state.leadDistributionStateError = payload || 'Failed to fetch lead distribution.';
                })

        }
    }
)
export default DashBoardSlice.reducer;