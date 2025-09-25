import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import axios from "axios";

export const addRep = createAsyncThunk(
    'add/addRep',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/admin/dashboard/add-rep', userInput);
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
export const addManager = createAsyncThunk(
    'add/addManager',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/admin/dashboard/add-manager', userInput);
            console.log("response",response)
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
export const actionList = createAsyncThunk(
    'add/actionList',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/admin/dashboard/actions/list');
            console.log("response",response)
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
export const repDashboard = createAsyncThunk(
    'add/repDashboard',
    async (userInput, { rejectWithValue }) => {
        console.log("userInput",userInput);
        try {
            const response = await api.get(`/api/rep/dashboard/${userInput}/task-list`);
            console.log("action response",response)
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

const initialState = {
    error: null,
    loading: false, 
    repDataResponse:{},
    ManagerDataResponse:{},
    actionListData:{},
    repDashboardData:{}
}

//slice part
const AddSlice = createSlice(
    {
        name: 'add',
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(addRep.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(addRep.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.repDataResponse=payload
                })
                .addCase(addRep.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(addManager.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(addManager.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.ManagerDataResponse=payload
                })
                .addCase(addManager.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(actionList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(actionList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.actionListData=payload
                })
                .addCase(actionList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(repDashboard.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(repDashboard.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.repDashboardData=payload
                })
                .addCase(repDashboard.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                
        }
    }
)


export default AddSlice.reducer