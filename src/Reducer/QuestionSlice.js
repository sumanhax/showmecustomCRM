import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getQuestion = createAsyncThunk(
    'getQuestion',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin-question-manage/list`);
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
export const addQuestions = createAsyncThunk(
    'addQuestions',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin-question-manage/add`, user_input);
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

export const changeStatusQuestion = createAsyncThunk(
    'changeStatusQuestion',
    async (user_input, { rejectWithValue }) => {
        try {

            const response = await api.patch(`/admin-question-manage/activation`, user_input);

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


export const getQuestionDetails = createAsyncThunk(
    'getMoodMasterSingle',
    async ({ user_input }, { rejectWithValue }) => {
        try {
            const id = user_input;
            const response = await api.get(`/admin-question-manage/details/${id}`);
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

export const updateQuestionDetails = createAsyncThunk(
    'updateQuestionDetails',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin-question-manage/edit`, user_input);
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

export const deleteQuestion = createAsyncThunk(
    'deleteQuestion',
    async (user_input, { rejectWithValue }) => {

        try {
            const response = await api.delete(`/admin-question-manage/remove`, { data: user_input });
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
    questionList: [],
    error: false,
    addQuestionListData: [],
    singleQuestion: {},
    updateQuestionData: {},
    deleteQueData: {}
}
const QuestionSlice = createSlice(
    {
        name: 'que',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getQuestion.pending, (state) => {
                state.loading = true
            })
                .addCase(getQuestion.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.questionList = payload
                    state.error = false
                })
                .addCase(getQuestion.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addQuestions.pending, (state) => {
                    state.loading = true
                })
                .addCase(addQuestions.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addQuestionListData = payload
                    state.error = false
                })
                .addCase(addQuestions.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getQuestionDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(getQuestionDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleQuestion = payload
                    state.error = false
                })
                .addCase(getQuestionDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateQuestionDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateQuestionDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.updateQuestionData = payload
                    state.error = false
                })
                .addCase(updateQuestionDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(deleteQuestion.pending, (state) => {
                    state.loading = true
                })
                .addCase(deleteQuestion.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.deleteQueData = payload
                    state.error = false
                })
                .addCase(deleteQuestion.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }
)
export default QuestionSlice.reducer;