import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getMoodMaster = createAsyncThunk(
    'getMoodMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/mood-master/list`);
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
export const addMoodMaster = createAsyncThunk(
    'addMoodMaster',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/mood-master/create`, user_input);
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

export const changeStatus = createAsyncThunk(
    'moodMaster/changeStatus',
    async ({ id }, { rejectWithValue }) => {
        try {
            const encodedId = btoa(id);
            const response = await api.get(`/mood-master/status?id=${encodedId}`);

            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const getMoodMasterSingle = createAsyncThunk(
    'getMoodMasterSingle',
    async ({ user_input }, { rejectWithValue }) => {
        try {
            const id = user_input;
            const response = await api.get(`/mood-master/list?id=${id}`);
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

export const updateMoodMaster = createAsyncThunk(
    'updateMoodMaster',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/mood-master/update`, user_input);
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

export const changeAvatar = createAsyncThunk(
    'changeAvatar',
    async ({ id, formData }, { rejectWithValue }) => {

        try {
            const response = await api.patch(`/mood-master/image-update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // required for file upload
                },
            });
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
    moodsList: [],
    error: false,
    addMoodListData: [],
    singleMoodMaster: {},
    updateMoodMasterData: {},
    piChangeData: {}
}
const MoodMasterSlice = createSlice(
    {
        name: 'moodMasters',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getMoodMaster.pending, (state) => {
                state.loading = true
            })
                .addCase(getMoodMaster.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.moodsList = payload
                    state.error = false
                })
                .addCase(getMoodMaster.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addMoodMaster.pending, (state) => {
                    state.loading = true
                })
                .addCase(addMoodMaster.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addMoodListData = payload
                    state.error = false
                })
                .addCase(addMoodMaster.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getMoodMasterSingle.pending, (state) => {
                    state.loading = true
                })
                .addCase(getMoodMasterSingle.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleMoodMaster = payload
                    state.error = false
                })
                .addCase(getMoodMasterSingle.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateMoodMaster.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateMoodMaster.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.updateMoodMasterData = payload
                    state.error = false
                })
                .addCase(updateMoodMaster.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(changeAvatar.pending, (state) => {
                    state.loading = true
                })
                .addCase(changeAvatar.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.piChangeData = payload
                    state.error = false
                })
                .addCase(changeAvatar.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }
)
export default MoodMasterSlice.reducer;