import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const courseTagsDropdown = createAsyncThunk(
    'courseTagsDropdown',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/course/course-tags-dropdown`);
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

export const courseLevelDropdown = createAsyncThunk(
    'courseLevelDropdown',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/course/course-level-dropdown`);
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

export const addCourseStep1 = createAsyncThunk(
    'addCourseStep1',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/course/add-course-step-one`, input);
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
export const searchModule = createAsyncThunk(
    'searchModule',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/course/search-modules`, input);
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

export const searchLession = createAsyncThunk(
    'searchLession',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/course/search-lession`, input);
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

export const addCourseStep2 = createAsyncThunk(
    'addCourseStep2',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/course/add-course-step-two`, input);
            // console.log("redux res",response)
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

export const getAllCourse = createAsyncThunk(
    'getAllCourse',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/course/get-course-list`);
            if (response?.data?.status_code === 200) {
                return response?.data?.res;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)
export const courseDetails = createAsyncThunk(
    'courseDetails',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/course/get-course-list`, input);
            if (response?.data?.status_code === 200) {
                return response?.data?.res[0];
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
    error: false,
    courseTagsDropdownloading: false,
    courseTagsDropdownData: {},
    courseLevelDropdownloading: false,
    courseLevelDropdownData: {},
    addCourseStep1loading: false,
    addCourseStep2loading: false,
    addCourseStep1Data: {},
    searchModulesData: {},
    searchLessionData: {},
    addCourseStep2Data: {},
    allCourseData: [],
    courseDetailsData: {}

}

const CourseSlice = createSlice(
    {
        name: 'courses',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder

                .addCase(courseTagsDropdown.pending, (state) => {
                    state.courseTagsDropdownloading = true
                })
                .addCase(courseTagsDropdown.fulfilled, (state, { payload }) => {
                    state.courseTagsDropdownloading = false
                    state.courseTagsDropdownData = payload
                    state.error = false
                })
                .addCase(courseTagsDropdown.rejected, (state, { payload }) => {
                    state.courseTagsDropdownloading = false
                    state.error = payload
                })

                .addCase(courseLevelDropdown.pending, (state) => {
                    state.courseLevelDropdownloading = true
                })
                .addCase(courseLevelDropdown.fulfilled, (state, { payload }) => {
                    state.courseLevelDropdownloading = false
                    state.courseLevelDropdownData = payload
                    state.error = false
                })
                .addCase(courseLevelDropdown.rejected, (state, { payload }) => {
                    state.courseLevelDropdownloading = false
                    state.error = payload
                })

                .addCase(addCourseStep1.pending, (state) => {
                    state.addCourseStep1loading = true
                })
                .addCase(addCourseStep1.fulfilled, (state, { payload }) => {
                    state.addCourseStep1loading = false
                    state.addCourseStep1Data = payload
                    state.error = false
                })
                .addCase(addCourseStep1.rejected, (state, { payload }) => {
                    state.addCourseStep1loading = false
                    state.error = payload
                })
                .addCase(searchModule.pending, (state) => {
                    state.loading = true
                })
                .addCase(searchModule.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.searchModulesData = payload
                    state.error = false
                })
                .addCase(searchModule.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(searchLession.pending, (state) => {
                    state.loading = true
                })
                .addCase(searchLession.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.searchLessionData = payload
                    state.error = false
                })
                .addCase(searchLession.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addCourseStep2.pending, (state) => {
                    state.addCourseStep2loading = true
                })
                .addCase(addCourseStep2.fulfilled, (state, { payload }) => {
                    state.addCourseStep2loading = false
                    state.addCourseStep2Data = payload
                    state.error = false
                })
                .addCase(addCourseStep2.rejected, (state, { payload }) => {
                    state.addCourseStep2loading = false
                    state.error = payload
                })
                .addCase(getAllCourse.pending, (state) => {
                    state.loading = true
                })
                .addCase(getAllCourse.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allCourseData = payload
                    state.error = false
                })
                .addCase(getAllCourse.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(courseDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(courseDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.courseDetailsData = payload
                    state.error = false
                })
                .addCase(courseDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

        }
    }
)
export default CourseSlice.reducer;