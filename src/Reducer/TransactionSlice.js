import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const userList = createAsyncThunk(
    'userList',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/user/list`, userInput);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                // let errors = errorHandler(response);
                return rejectWithValue(response);
            }
        } catch (error) {
            // let errors = errorHandler(error);
            return rejectWithValue(error);
        }
    }
)

export const userStatus = createAsyncThunk(
    'userStatus',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/user/status`, userInput);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                // let errors = errorHandler(response);
                return rejectWithValue(response);
            }
        } catch (error) {
            // let errors = errorHandler(error);
            return rejectWithValue(error);
        }
    }
)

export const loginToUser = createAsyncThunk(
    'loginToUser',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/user-direct-login`, userInput);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                // let errors = errorHandler(response);
                return rejectWithValue(response);
            }
        } catch (error) {
            // let errors = errorHandler(error);
            return rejectWithValue(error);
        }
    }

)

export const searchUser = createAsyncThunk(
    'searchUser',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin-dashboard/search-user`, userInput);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                // let errors = errorHandler(response);
                return rejectWithValue(response);
            }
        } catch (error) {
            // let errors = errorHandler(error);
            return rejectWithValue(error);
        }
    }
)

export const addUser = createAsyncThunk(
    'add-user',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin-dashboard/add-user-manually`, userInput);
            if (response?.data?.status_code === 201) {
                return response?.data;
            } else {
                // let errors = errorHandler(response);
                return rejectWithValue(response);
            }
        } catch (error) {
            // let errors = errorHandler(error);
            return rejectWithValue(error);
        }
    }
)
const initialState = {
    loading: false,
    error: false,
    message: "",
    userListData: {},
    userStatusData: {},
    userLoginData: {},
    userSearchData: {}
}

const TransactionSlice = createSlice(
    {
        name: "transaction",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(userList.pending, (state) => {
                    state.loading = true
                })
                .addCase(userList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.userListData = payload
                })
                .addCase(userList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(userStatus.pending, (state) => {
                    state.loading = true
                })
                .addCase(userStatus.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.userStatusData = payload
                })
                .addCase(userStatus.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(loginToUser.pending, (state) => {
                    state.loading = true
                })
                .addCase(loginToUser.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.userLoginData = payload
                })
                .addCase(loginToUser.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(searchUser.pending, (state) => {
                    state.loading = true
                })
                .addCase(searchUser.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.userSearchData = payload
                })
                .addCase(searchUser.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(addUser.pending, (state) => {
                    state.loading = true
                })
                .addCase(addUser.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.message = payload

                })
                .addCase(addUser.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

        }
    }
)
export default TransactionSlice.reducer;