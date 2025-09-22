import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";


export const addBatch = createAsyncThunk(
    'addBatch',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/add-batch', userInput);
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

export const courseListForBatch = createAsyncThunk(
    'courseListForBatch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/oparational-head/batch/list');
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

export const ohBatchList = createAsyncThunk(
    'batchList',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/oh-batch-list', user_input);
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

export const eligibleCoach = createAsyncThunk(
    'eligibleCoach',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/eligible-coaches', user_input);
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

export const batchValidation = createAsyncThunk(
    'batchValidation',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/validate-batch', user_input);
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


export const getCoachDetails = createAsyncThunk(
    'getCoachDetails',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/get-coach-details', user_input);
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

export const uploadBannerImage = createAsyncThunk(
    'uploadBannerImage',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/add-batch-banner', user_input);
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

export const getDaysCoach = createAsyncThunk(
    'getDaysCoach',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/coach/availability', user_input);
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

export const getStudentList = createAsyncThunk(
    'getStudentList',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/student/students/list', user_input);
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

export const addStudent = createAsyncThunk(
    'addStudent',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/add-student', user_input);
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
    addBatchLoading: false,
    loading: false,
    batchData: {},
    error: false,
    courseData: [],
    batchList: [],
    coachesData: [],
    validateData: [],
    coachDetailsData: [],
    bannerImageData: {},
    daysData: [],
    studentData: [],
    addStudentData: {}

};

const BatchSlice = createSlice(
    {
        name: 'batch',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(addBatch.pending, (state) => {
                    state.addBatchLoading = true
                })
                .addCase(addBatch.fulfilled, (state, { payload }) => {
                    state.addBatchLoading = false
                    state.batchData = payload
                    state.error = false
                })
                .addCase(addBatch.rejected, (state, { payload }) => {
                    state.addBatchLoading = false
                    state.error = payload
                })
                .addCase(courseListForBatch.pending, (state) => {
                    state.loading = true
                })
                .addCase(courseListForBatch.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.courseData = payload
                    state.error = false
                })
                .addCase(courseListForBatch.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(ohBatchList.pending, (state) => {
                    state.loading = true
                })
                .addCase(ohBatchList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.batchList = payload
                    state.error = false
                })
                .addCase(ohBatchList.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(eligibleCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(eligibleCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachesData = payload
                })
                .addCase(eligibleCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(batchValidation.pending, (state) => {
                    state.addBatchLoading = true
                })
                .addCase(batchValidation.fulfilled, (state, { payload }) => {
                    state.addBatchLoading = false
                    state.validateData = payload
                    state.error = false
                })
                .addCase(batchValidation.rejected, (state, { payload }) => {
                    state.addBatchLoading = false
                    state.error = payload
                })
                .addCase(getCoachDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCoachDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachDetailsData = payload
                    state.error = false
                })
                .addCase(getCoachDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(uploadBannerImage.pending, (state) => {
                    state.addBatchLoading = true
                })
                .addCase(uploadBannerImage.fulfilled, (state, { payload }) => {
                    state.addBatchLoading = false
                    state.bannerImageData = payload
                    state.error = false
                })
                .addCase(uploadBannerImage.rejected, (state, { payload }) => {
                    state.addBatchLoading = false
                    state.error = payload
                })
                .addCase(getDaysCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(getDaysCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.daysData = payload
                    state.error = false
                })
                .addCase(getDaysCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getStudentList.pending, (state) => {
                    state.loading = true
                })
                .addCase(getStudentList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.studentData = payload
                    state.error = false
                })
                .addCase(getStudentList.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addStudent.pending, (state) => {
                    state.loading = true
                })
                .addCase(addStudent.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addStudentData = payload
                    state.error = false
                })
                .addCase(addStudent.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

        }
    }
)
export default BatchSlice.reducer;