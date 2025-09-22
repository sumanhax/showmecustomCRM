import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getMoodMeter = createAsyncThunk(
    'getMoodMeter',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-meter/get-mood-meter`, user_input);
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

export const getSingleMoodMeter = createAsyncThunk(
    'getSingleMoodMeter',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-meter/get-mood-meter`, user_input);
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

export const addMoodMeter = createAsyncThunk(
    'addMoodMeter',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-meter/add`, user_input);


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

export const getActiveDeactiveMoodMeter = createAsyncThunk(
    'getActiveDeactiveMoodMeter',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-meter/change-status`, user_input);
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

export const uploadMoodAvatar = createAsyncThunk(
    'uploadMoodAvatar',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-meter/update-image`, user_input);
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

export const updateMoodMeter = createAsyncThunk(
    'updateMoodMeter',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-meter/update`, user_input);
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

export const deleteMoodMeter = createAsyncThunk(
    'deleteMoodMeter',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-meter/delete`, user_input);
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

const initialState = {
    loading: false,
    allMoodMeter: [],
    error: false,
    addMoodMeterData: "",
    singleMoodMeter: [],
    uploadAvatarData: {},
    updateMoodMeterData: {},
    deleteData: {}
}
const MoodMeterSlice = createSlice(
    {
        'name': 'levelsData',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getMoodMeter.pending, (state) => {
                    state.loading = true
                })
                .addCase(getMoodMeter.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allMoodMeter = payload
                    state.error = false
                })
                .addCase(getMoodMeter.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addMoodMeter.pending, (state) => {
                    state.loading = true
                })
                .addCase(addMoodMeter.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addMoodMeterData = payload
                    state.error = false
                })
                .addCase(addMoodMeter.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getSingleMoodMeter.pending, (state) => {
                    state.loading = true
                })
                .addCase(getSingleMoodMeter.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleMoodMeter = payload
                    state.error = false
                })
                .addCase(getSingleMoodMeter.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(uploadMoodAvatar.pending, (state) => {
                    state.loading = true
                })
                .addCase(uploadMoodAvatar.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.uploadAvatarData = payload
                    state.error = false
                })
                .addCase(uploadMoodAvatar.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateMoodMeter.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateMoodMeter.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.updateMoodMeterData = payload
                    state.error = false
                })
                .addCase(updateMoodMeter.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(deleteMoodMeter.pending, (state) => {
                    state.loading = true
                })
                .addCase(deleteMoodMeter.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.deleteData = payload
                    state.error = false
                })
                .addCase(deleteMoodMeter.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }

)
export default MoodMeterSlice.reducer;