import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getTopics = createAsyncThunk(
    'getTopics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/topic/list`);
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

export const getlevelList = createAsyncThunk(
    'getlevelList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/topic/level-dropdown-list`);
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

export const addTopic = createAsyncThunk(
    'addTopic',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`admin/topic/add`, input);
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

export const topicDetails = createAsyncThunk(
    'topicDetails',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/topic/details/${input}`);
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

export const updateTopic = createAsyncThunk(
    'updateTopic',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.patch(`admin/topic/update`, input);
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
    allTopics: [],
    levelList: {},
    addloading: false,
    topicAdded: {},
    detailsloading: false,
    topicDetailsData: {},
    updateloading: false,
    topicUpdated: {},
    error: false
}
const TopicSlice = createSlice(
    {
        'name': 'topicsData',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getTopics.pending, (state) => {
                    state.loading = true
                })
                .addCase(getTopics.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allTopics = payload
                    state.error = false
                })
                .addCase(getTopics.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

                .addCase(getlevelList.pending, (state) => {
                    state.loading = true
                })
                .addCase(getlevelList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.levelList = payload
                    state.error = false
                })
                .addCase(getlevelList.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

                .addCase(addTopic.pending, (state) => {
                    state.addloading = true
                })
                .addCase(addTopic.fulfilled, (state, { payload }) => {
                    state.addloading = false
                    state.topicAdded = payload
                    state.error = false
                })
                .addCase(addTopic.rejected, (state, { payload }) => {
                    state.addloading = false
                    state.error = payload
                })

                .addCase(topicDetails.pending, (state) => {
                    state.detailsloading = true
                })
                .addCase(topicDetails.fulfilled, (state, { payload }) => {
                    state.detailsloading = false
                    state.topicDetailsData = payload
                    state.error = false
                })
                .addCase(topicDetails.rejected, (state, { payload }) => {
                    state.detailsloading = false
                    state.error = payload
                })

                .addCase(updateTopic.pending, (state) => {
                    state.updateloading = true
                })
                .addCase(updateTopic.fulfilled, (state, { payload }) => {
                    state.updateloading = false
                    state.topicUpdated = payload
                    state.error = false
                })
                .addCase(updateTopic.rejected, (state, { payload }) => {
                    state.updateloading = false
                    state.error = payload
                })
        }
    }

)
export default TopicSlice.reducer;