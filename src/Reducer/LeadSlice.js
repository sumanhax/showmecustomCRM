import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newApi from "../store/NewApi";

/* ================= SAVE LEAD ================= */
export const saveLead = createAsyncThunk(
    'lead/saveLead',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await newApi.post('/api/admin/leads/save', payload);
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to save lead');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

/* ================= UPLOAD LEAD IMAGE ================= */
export const uploadLeadImage = createAsyncThunk(
    'lead/uploadLeadImage',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await newApi.post('/api/admin/leads/image-upload', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to upload image');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

/* ================= GET LEAD LIST ================= */
export const getLeadList = createAsyncThunk(
    'lead/getLeadList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/admin/leads/list');
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to fetch lead list');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

/* ================= GET HAT LIST ================= */
export const getHatList = createAsyncThunk(
    'lead/getHatList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/hat/list');
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to fetch hat list');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

const initialState = {
    // ── Save Lead ──
    saveLeadLoading: false,
    saveLeadSuccess: false,
    saveLeadError: null,
    saveLeadData: {},

    // ── Upload Lead Image ──
    uploadLeadImageLoading: false,
    uploadLeadImageSuccess: false,
    uploadLeadImageError: null,
    uploadLeadImageData: {},

    // ── Lead List ──
    leadListLoading: false,
    leadListSuccess: false,
    leadListError: null,
    leadListData: {},

    // ── Hat List ──
    hatListLoading: false,
    hatListSuccess: false,
    hatListError: null,
    hatListData: {},
};

const LeadSlice = createSlice({
    name: 'lead',
    initialState,
    extraReducers: (builder) => {
        builder
            /* -------- SAVE LEAD -------- */
            .addCase(saveLead.pending, (state) => {
                state.saveLeadLoading = true;
                state.saveLeadSuccess = false;
                state.saveLeadError = null;
            })
            .addCase(saveLead.fulfilled, (state, { payload }) => {
                state.saveLeadLoading = false;
                state.saveLeadSuccess = true;
                state.saveLeadData = payload;
            })
            .addCase(saveLead.rejected, (state, { payload }) => {
                state.saveLeadLoading = false;
                state.saveLeadSuccess = false;
                state.saveLeadError = payload;
            })

            /* -------- UPLOAD LEAD IMAGE -------- */
            .addCase(uploadLeadImage.pending, (state) => {
                state.uploadLeadImageLoading = true;
                state.uploadLeadImageSuccess = false;
                state.uploadLeadImageError = null;
            })
            .addCase(uploadLeadImage.fulfilled, (state, { payload }) => {
                state.uploadLeadImageLoading = false;
                state.uploadLeadImageSuccess = true;
                state.uploadLeadImageData = payload;
            })
            .addCase(uploadLeadImage.rejected, (state, { payload }) => {
                state.uploadLeadImageLoading = false;
                state.uploadLeadImageSuccess = false;
                state.uploadLeadImageError = payload;
            })

            /* -------- LEAD LIST -------- */
            .addCase(getLeadList.pending, (state) => {
                state.leadListLoading = true;
                state.leadListSuccess = false;
                state.leadListError = null;
            })
            .addCase(getLeadList.fulfilled, (state, { payload }) => {
                state.leadListLoading = false;
                state.leadListSuccess = true;
                state.leadListData = payload;
            })
            .addCase(getLeadList.rejected, (state, { payload }) => {
                state.leadListLoading = false;
                state.leadListSuccess = false;
                state.leadListError = payload;
            })

            /* -------- HAT LIST -------- */
            .addCase(getHatList.pending, (state) => {
                state.hatListLoading = true;
                state.hatListSuccess = false;
                state.hatListError = null;
            })
            .addCase(getHatList.fulfilled, (state, { payload }) => {
                state.hatListLoading = false;
                state.hatListSuccess = true;
                state.hatListData = payload;
            })
            .addCase(getHatList.rejected, (state, { payload }) => {
                state.hatListLoading = false;
                state.hatListSuccess = false;
                state.hatListError = payload;
            })
    }
});

export default LeadSlice.reducer;