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
            const response = await newApi.post('api/banners/create', formData);
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

export const updateBannerUpload = createAsyncThunk(
    'dashboard/updateBannerUpload',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await newApi.put(`api/banners/update/${id}`, formData);
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
            const response = await newApi.post('/api/logo-placement/create', formData);
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

// PUT /api/logo-placement/update/:id
export const updateLogoPlacement = createAsyncThunk(
    'dashboard/updateLogoPlacement',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await newApi.put(`/api/logo-placement/update/${id}`, formData);
            if (response?.data?.status === true || response?.status === 200) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Something went wrong.');
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

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

                // Update Banner Upload
                .addCase(updateBannerUpload.pending, (state) => {
                    state.bannerLoading = true;
                    state.bannerError = null;
                })
                .addCase(updateBannerUpload.fulfilled, (state, { payload }) => {
                    state.bannerLoading = false;
                    state.bannerData = payload;
                    state.bannerError = null;
                })
                .addCase(updateBannerUpload.rejected, (state, { payload }) => {
                    state.bannerLoading = false;
                    state.bannerError = payload?.message || 'Banner update failed.';
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

                // Update Logo Placement
                .addCase(updateLogoPlacement.pending, (state) => {
                    state.logoPlacementLoading = true;
                    state.logoPlacementError = null;
                })
                .addCase(updateLogoPlacement.fulfilled, (state, { payload }) => {
                    state.logoPlacementLoading = false;
                    state.logoPlacementData = payload?.data;
                    state.logoPlacementError = null;
                })
                .addCase(updateLogoPlacement.rejected, (state, { payload }) => {
                    state.logoPlacementLoading = false;
                    state.logoPlacementError = payload || 'Logo placement update failed.';
                })
        }
    }
)
export default DashBoardSlice.reducer;