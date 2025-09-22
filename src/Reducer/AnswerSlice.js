import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getAnswer = createAsyncThunk(
    'getAnswer',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin-answer-manage/list`);
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
export const addAnswer = createAsyncThunk(
    'addAnswer',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin-answer-manage/add`, user_input);
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
export const changeStatusAnswer = createAsyncThunk(
    'changeStatusAnswer',
    async (user_input, { rejectWithValue }) => {
        try {

            const response = await api.patch(`/admin-answer-manage/activation`, user_input);

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

export const getAnswerDetails = createAsyncThunk(
    'getAnswerDetails',
    async ({ user_input }, { rejectWithValue }) => {
        try {
            const id = user_input;
            const response = await api.get(`/admin-answer-manage/details/${id}`);
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
export const updateAnswerDetails = createAsyncThunk(
    'updateAnswerDetails',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin-answer-manage/edit`, user_input);
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
export const deleteAnswer = createAsyncThunk(
    'deleteAnswer',
    async (user_input, { rejectWithValue }) => {

        try {
            const response = await api.delete(`/admin-answer-manage/remove`, { data: user_input });
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

export const questionAnswerMap = createAsyncThunk(
    'questionAnswerMap',
    async (user_input, { rejectWithValue }) => {

        try {
            const response = await api.post(`/admin-answer-manage/question-answer-map`, user_input);
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

const initialState = {
    loading: false,
    answerList: [],
    error: false,
    addAnswerListData: [],
    singleAnswer: {},
    updateAnswerData: {},
    deleteAnswerData: {},
    mappeedData: {}
}
const AnswerSlice = createSlice(
    {
        name: 'ans',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getAnswer.pending, (state) => {
                state.loading = true
            })
                .addCase(getAnswer.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.answerList = payload
                    state.error = false
                })
                .addCase(getAnswer.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addAnswer.pending, (state) => {
                    state.loading = true
                })
                .addCase(addAnswer.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addAnswerListData = payload
                    state.error = false
                })
                .addCase(addAnswer.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getAnswerDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(getAnswerDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleAnswer = payload
                    state.error = false
                })
                .addCase(getAnswerDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateAnswerDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateAnswerDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.updateAnswerData = payload
                    state.error = false
                })
                .addCase(updateAnswerDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(deleteAnswer.pending, (state) => {
                    state.loading = true
                })
                .addCase(deleteAnswer.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.deleteAnswerData = payload
                    state.error = false
                })
                .addCase(deleteAnswer.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(questionAnswerMap.pending, (state) => {
                    state.loading = true
                })
                .addCase(questionAnswerMap.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.mappeedData = payload
                    state.error = false
                })
                .addCase(questionAnswerMap.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }
)
export default AnswerSlice.reducer;