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
export const addLeadNote = createAsyncThunk(
    'add/addLeadNote',
    async (userInput, { rejectWithValue }) => {
        console.log("userInput",userInput);
        try {
            const response = await api.post(`/api/admin/dashboard/add-leadnote`, userInput);
            console.log("action response",response)
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
export const getLeadNote = createAsyncThunk(
    'add/getLeadNote',
    async (userInput, { rejectWithValue }) => {
        console.log("userInput",userInput);
        try {
            const response = await api.post(`/api/rep/dashboard/list/lead-notes`, userInput);
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
export const getLeadNoteAdmin = createAsyncThunk(
    'add/getLeadNoteAdmin',
    async (userInput, { rejectWithValue }) => {
        console.log("userInput",userInput);
        try {
            const response = await api.get(`/api/admin/dashboard/all-notes`, userInput);
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

// Update Partner Classification for a lead
export const updatePartnerClassification = createAsyncThunk(
    'add/updatePartnerClassification',
    async (userInput, { rejectWithValue }) => {
        // userInput should be: { lead_id: string, partner_option: 'Whale' | 'Tuna' | 'Shrimp' }
        try {
            const response = await api.post('/api/admin/dashboard/lead/partner-classification', userInput);
            if (response?.data?.status_code === 200 || response?.data?.status_code === 201) {
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
// Add lead to 
export const addLead = createAsyncThunk(
    'add/addLead',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/postgresapi/admin/lead-manage/add', userInput);
            if (response?.data?.status_code === 200 || response?.data?.status_code === 201) {
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
    repDashboardData:{},
    addLeadNoteData:{},
    getLeadNoteData:{},
    getLeadNoteAdminData:{},
    updatePartnerClassificationResponse:{},
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
                    .addCase(addLeadNote.pending, (state) => {
                        state.message = null
                        state.loading = true;
                        state.error = null
                    })
                    .addCase(addLeadNote.fulfilled, (state, { payload }) => {
                        state.loading = false;
                        state.message = payload;
                        state.addLeadNoteData=payload
                    })
                    .addCase(addLeadNote.rejected, (state, { payload }) => {
                        state.loading = false;
                        state.error = payload;
                    })
                    .addCase(getLeadNote.pending, (state) => {
                        state.message = null
                        state.loading = true;
                        state.error = null
                    })
                    .addCase(getLeadNote.fulfilled, (state, { payload }) => {
                        state.loading = false;
                        state.message = payload;
                        state.getLeadNoteData=payload
                    })
                    .addCase(getLeadNote.rejected, (state, { payload }) => {
                        state.loading = false;
                        state.error = payload;
                    })
                    .addCase(getLeadNoteAdmin.pending, (state) => {
                        state.message = null
                        state.loading = true;
                        state.error = null
                    })
                    .addCase(getLeadNoteAdmin.fulfilled, (state, { payload }) => {
                        state.loading = false;
                        state.message = payload;
                        state.getLeadNoteAdminData=payload
                    })
                    .addCase(getLeadNoteAdmin.rejected, (state, { payload }) => {
                        state.loading = false;
                        state.error = payload;
                    })
                    .addCase(updatePartnerClassification.pending, (state) => {
                        state.message = null
                        state.loading = true;
                        state.error = null
                    })
                    .addCase(updatePartnerClassification.fulfilled, (state, { payload }) => {
                        state.loading = false;
                        state.message = payload;
                        state.updatePartnerClassificationResponse = payload;
                    })
                    .addCase(updatePartnerClassification.rejected, (state, { payload }) => {
                        state.loading = false;
                        state.error = payload;
                    })
                    .addCase(addLead.pending, (state) => {
                        state.message = null
                        state.loading = true;
                        state.error = null
                    })
                    .addCase(addLead.fulfilled, (state, { payload }) => {
                        state.loading = false;
                        state.message = payload;
                    })
                    .addCase(addLead.rejected, (state, { payload }) => {
                        state.loading = false;
                        state.error = payload;
                    })
        }
    }
)


export default AddSlice.reducer