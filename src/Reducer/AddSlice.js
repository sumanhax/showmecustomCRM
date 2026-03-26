import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import axios from "axios";
import newApi from "../store/NewApi";

// export const addRep = createAsyncThunk(
//     'add/addRep',
//     async (userInput, { rejectWithValue }) => {
//         try {
//             const response = await api.post('/api/admin/dashboard/add-rep', userInput);
//             if (response?.data?.status_code === 201) {
//                 return response.data;
//             } else {
//                 if (response?.data?.errors) {
//                     return rejectWithValue(response.data.errors);
//                 } else {
//                     return rejectWithValue('Something went wrong.');
//                 }
//             }
//         } catch (err) {
//             return rejectWithValue(err);
//         }
//     }
// )
export const addManager = createAsyncThunk(
    'add/addManager',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/admin/dashboard/add-manager', userInput);
            console.log("response", response)
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
// export const actionList = createAsyncThunk(
//     'add/actionList',
//     async (userInput, { rejectWithValue }) => {
//         try {
//             const response = await api.get('/api/admin/dashboard/actions/list');
//             console.log("response",response)
//             if (response?.data?.status_code === 200) {
//                 return response.data;
//             } else {
//                 if (response?.data?.errors) {
//                     return rejectWithValue(response.data.errors);
//                 } else {
//                     return rejectWithValue('Something went wrong.');
//                 }
//             }
//         } catch (err) {
//             return rejectWithValue(err);
//         }
//     }
// )
export const repDashboard = createAsyncThunk(
    'add/repDashboard',
    async (userInput, { rejectWithValue }) => {
        console.log("userInput", userInput);
        try {
            const response = await api.get(`/api/rep/dashboard/${userInput}/task-list`);
            console.log("action response", response)
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
        console.log("userInput", userInput);
        try {
            const response = await api.post(`/api/admin/dashboard/add-leadnote`, userInput);
            console.log("action response", response)
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
        console.log("userInput", userInput);
        try {
            const response = await api.post(`/api/rep/dashboard/list/lead-notes`, userInput);
            console.log("action response", response)
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
        console.log("userInput", userInput);
        try {
            const response = await api.get(`/api/admin/dashboard/all-notes`, userInput);
            console.log("action response", response)
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

//  lead
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
export const leadList = createAsyncThunk(
    'add/leadList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/postgresapi/admin/lead-manage/list');
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
export const leadListSearch = createAsyncThunk(
    'add/leadListSearch',
    async (searchInput, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/lead-manage/list?q=${searchInput}`);
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
export const leadSingle = createAsyncThunk(
    'add/leadSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/lead-manage/${id}`);
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
// rep
export const addRep = createAsyncThunk(
    'add/addRep',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/postgresapi/admin/reps-manage/add', userInput);
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
export const repList = createAsyncThunk(
    'add/repList',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/reps-manage/reps-list?page=${page}&limit=${limit}`);
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

// kanban
export const kanbanList = createAsyncThunk(
    'add/kanbanList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/lead-manage/kanban/list`);
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
export const kanbanDragnDrop = createAsyncThunk(
    'add/kanbanDragnDrop',
    async ({ lead_id, lead_status_id }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/postgresapi/admin/lead-manage/kanban/${lead_id}/change_status`, {
                lead_status_id
            });
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
// kanban bulkorder
export const kanbanAddProject = createAsyncThunk(
    'add/kanbanAddProject',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/postgresapi/admin/lead-manage/offline-orders/create`, userInput);
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
export const kanbanBulkOrderList = createAsyncThunk(
    'add/kanbanBulkOrderList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/lead-manage/order-manage/kanban/list`);
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
export const kanbanBulkOrderDragnDrop = createAsyncThunk(
    'add/kanbanBulkOrderDragnDrop',
    async ({ id, order_stage_id, source }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/postgresapi/admin/lead-manage/order-manage/kanban/${id}/change_stage`,
                { order_stage_id, source }
            );
            if (response?.data?.status_code === 200 || response?.data?.status_code === 201) {
                return response.data;
            } else {
                return rejectWithValue(
                    response?.data?.message || 'Something went wrong.'
                );
            }
        } catch (err) {
            return rejectWithValue(
                err?.response?.data?.message || err?.message || 'Something went wrong.'
            );
        }
    }
)


// action
export const addAction = createAsyncThunk(
    'add/addAction',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/postgresapi/admin/lead-manage/create-action', userInput);
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
export const actionList = createAsyncThunk(
    'add/actionList',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.get('/postgresapi/admin/lead-manage/actions/list?page=1&limit=20', userInput);
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
export const actionListSearch = createAsyncThunk(
    'add/actionList',
    async (searchInput, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/lead-manage/actions/list?q=${searchInput}`);
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
export const actionListPendingCall = createAsyncThunk(
    'add/actionList',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.get('/postgresapi/admin/lead-manage/actions/list?action_status=PENDING&action_type=CALL');
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
export const leadListbyRep = createAsyncThunk(
    'add/leadListbyRep',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/reps/dashboard/leads/list`);
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
export const actionStatusChange = createAsyncThunk(
    'add/actionStatusChange',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/postgresapi/reps/dashboard/action/change`, userInput);
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
export const actionListbyRep = createAsyncThunk(
    'add/actionListbyRep',
    async (token, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/reps/dashboard/actions/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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

export const leadListNew = createAsyncThunk(
    'add/leadListNew',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/leads/list');
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            } else {
                return rejectWithValue(
                    response?.data?.message || 'Failed to fetch leads'
                );
            }
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || 'Something went wrong'
            );
        }
    }
)

/* ================= UPDATE FROM ADMIN STAGES ================= */
export const updateFromAdminStages = createAsyncThunk(
    'add/updateFromAdminStages',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                'https://n8nnode.showmecustomapparel.com/webhook/update_from_admin_stages',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to update admin stages');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

/* ================= UPDATE LEAD STAGES ================= */
export const updateLeadStages = createAsyncThunk(
    'add/updateLeadStages',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                'https://n8nnode.showmecustomapparel.com/webhook/lead_status_update',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to update lead stages');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

/* ================= SEND OFFLINE ORDER EMAIL ================= */
export const sendOfflineOrderEmail = createAsyncThunk(
    'add/sendOfflineOrderEmail',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                'https://n8nnode.showmecustomapparel.com/webhook/offline_order_email',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to send offline order email');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

/* ================= SEND ADD PROJECT EMAIL ================= */
export const sendAddProjectEmail = createAsyncThunk(
    'add/sendAddProjectEmail',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'https://n8nnode.showmecustomapparel.com/webhook/add_project_email',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Failed to send add project email');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
        }
    }
);

// ── POST: Add Note (newApi) ──
export const addLeadNoteNew = createAsyncThunk(
    'add/addLeadNoteNew',
    async (userInput, { rejectWithValue }) => {
        // userInput: { leadId, repId, noteDescriptions, date }
        try {
            const response = await newApi.post('/api/admin/lead-manage/notes/add', userInput);
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to add note');
            }
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || 'Something went wrong'
            );
        }
    }
)

// ── GET: Notes by Lead ID (newApi) ──
export const getLeadNotesByIdNew = createAsyncThunk(
    'add/getLeadNotesByIdNew',
    async (leadId, { rejectWithValue }) => {
        try {
            const response = await newApi.get(`/api/admin/lead-manage/notes/list/${leadId}`);
            if (response?.status === 200 || response?.status === 201) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.message || 'Failed to fetch notes');
            }
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || 'Something went wrong'
            );
        }
    }
)

const initialState = {
    error: null,
    loading: false,
    repListData: {},
    ManagerDataResponse: {},
    actionListData: {},
    repDashboardData: {},
    addLeadNoteData: {},
    getLeadNoteData: {},
    getLeadNoteAdminData: {},
    updatePartnerClassificationResponse: {},
    kanbanListData: {},
    kanbanBulkOrderListData: {},
    leadListData: {},
    leadSingleData: {},
    leadListSearchData: {},
    actionListbyRepData: {},
    leadListbyRepData: {},

    leadListNewData: {},
    leadListNewLoading: false,
    leadListNewError: null,

    // ── Headwear Order Email ──
    headwearEmailLoading: false,
    headwearEmailSuccess: false,
    headwearEmailError: null,

    // ── Update Admin Stages ──
    updateAdminStagesLoading: false,
    updateAdminStagesSuccess: false,
    updateAdminStagesError: null,

    // ── Update Lead Stages ──
    updateLeadStagesLoading: false,
    updateLeadStagesSuccess: false,
    updateLeadStagesError: null,

    // ── Send Offline Order Email ──
    offlineOrderEmailLoading: false,
    offlineOrderEmailSuccess: false,
    offlineOrderEmailError: null,

    // ── Send Add Project Email ──
    addProjectEmailLoading: false,
    addProjectEmailSuccess: false,
    addProjectEmailError: null,

    // ── Add Lead Note New ──
    addLeadNoteNewLoading: false,
    addLeadNoteNewData: {},
    addLeadNoteNewError: null,

    // ── Get Lead Notes By Id New ──
    getLeadNotesByIdNewLoading: false,
    getLeadNotesByIdNewData: {},
    getLeadNotesByIdNewError: null,
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
                    state.ManagerDataResponse = payload
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
                    state.actionListData = payload
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
                    state.repDashboardData = payload
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
                    state.addLeadNoteData = payload
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
                    state.getLeadNoteData = payload
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
                    state.getLeadNoteAdminData = payload
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
                // lead
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
                .addCase(leadList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(leadList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.leadListData = payload
                })
                .addCase(leadList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(leadSingle.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(leadSingle.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.leadSingleData = payload
                })
                .addCase(leadSingle.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // rep
                .addCase(repList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(repList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.repListData = payload
                })
                .addCase(repList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // kanban
                .addCase(kanbanList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(kanbanList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.kanbanListData = payload
                })
                .addCase(kanbanList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(kanbanDragnDrop.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(kanbanDragnDrop.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(kanbanDragnDrop.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(leadListSearch.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(leadListSearch.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.leadListSearchData = payload
                })
                .addCase(leadListSearch.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(kanbanAddProject.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(kanbanAddProject.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(kanbanAddProject.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(kanbanBulkOrderList.pending, (state) => {
                    state.message = null;
                    state.loading = true;
                    state.error = null;
                })
                .addCase(kanbanBulkOrderList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.kanbanBulkOrderListData = payload;
                })
                .addCase(kanbanBulkOrderList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(kanbanBulkOrderDragnDrop.pending, (state) => {
                    state.message = null;
                    state.loading = true;
                    state.error = null;
                })
                .addCase(kanbanBulkOrderDragnDrop.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(kanbanBulkOrderDragnDrop.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // actions
                .addCase(actionListbyRep.pending, (state) => {
                    state.message = null;
                    state.loading = true;
                    state.error = null;
                })
                .addCase(actionListbyRep.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.actionListbyRepData = payload?.data
                    state.message = payload;
                })
                .addCase(actionListbyRep.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // repleads
                .addCase(leadListbyRep.pending, (state) => {
                    state.message = null;
                    state.loading = true;
                    state.error = null;
                })
                .addCase(leadListbyRep.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.leadListbyRepData = payload
                    state.message = payload;
                })
                .addCase(leadListbyRep.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })

                .addCase(leadListNew.pending, (state) => {
                    state.leadListNewLoading = true;
                    state.leadListNewError = null;
                })
                .addCase(leadListNew.fulfilled, (state, { payload }) => {
                    state.leadListNewLoading = false;
                    state.leadListNewData = payload;
                    state.leadListNewError = null;
                })
                .addCase(leadListNew.rejected, (state, { payload }) => {
                    state.leadListNewLoading = false;
                    state.leadListNewError = payload;
                })

                /* -------- UPDATE FROM ADMIN STAGES -------- */
                .addCase(updateFromAdminStages.pending, (state) => {
                    state.updateAdminStagesLoading = true;
                    state.updateAdminStagesSuccess = false;
                    state.updateAdminStagesError = null;
                })
                .addCase(updateFromAdminStages.fulfilled, (state) => {
                    state.updateAdminStagesLoading = false;
                    state.updateAdminStagesSuccess = true;
                })
                .addCase(updateFromAdminStages.rejected, (state, { payload }) => {
                    state.updateAdminStagesLoading = false;
                    state.updateAdminStagesSuccess = false;
                    state.updateAdminStagesError = payload;
                })

                /* -------- UPDATE LEAD STAGES -------- */
                .addCase(updateLeadStages.pending, (state) => {
                    state.updateLeadStagesLoading = true;
                    state.updateLeadStagesSuccess = false;
                    state.updateLeadStagesError = null;
                })
                .addCase(updateLeadStages.fulfilled, (state) => {
                    state.updateLeadStagesLoading = false;
                    state.updateLeadStagesSuccess = true;
                })
                .addCase(updateLeadStages.rejected, (state, { payload }) => {
                    state.updateLeadStagesLoading = false;
                    state.updateLeadStagesSuccess = false;
                    state.updateLeadStagesError = payload;
                })

                /* -------- SEND OFFLINE ORDER EMAIL -------- */
                .addCase(sendOfflineOrderEmail.pending, (state) => {
                    state.offlineOrderEmailLoading = true;
                    state.offlineOrderEmailSuccess = false;
                    state.offlineOrderEmailError = null;
                })
                .addCase(sendOfflineOrderEmail.fulfilled, (state) => {
                    state.offlineOrderEmailLoading = false;
                    state.offlineOrderEmailSuccess = true;
                })
                .addCase(sendOfflineOrderEmail.rejected, (state, { payload }) => {
                    state.offlineOrderEmailLoading = false;
                    state.offlineOrderEmailSuccess = false;
                    state.offlineOrderEmailError = payload;
                })

                /* -------- SEND ADD PROJECT EMAIL -------- */
                .addCase(sendAddProjectEmail.pending, (state) => {
                    state.addProjectEmailLoading = true;
                    state.addProjectEmailSuccess = false;
                    state.addProjectEmailError = null;
                })
                .addCase(sendAddProjectEmail.fulfilled, (state) => {
                    state.addProjectEmailLoading = false;
                    state.addProjectEmailSuccess = true;
                })
                .addCase(sendAddProjectEmail.rejected, (state, { payload }) => {
                    state.addProjectEmailLoading = false;
                    state.addProjectEmailSuccess = false;
                    state.addProjectEmailError = payload;
                })

                /* -------- ADD LEAD NOTE NEW -------- */
                .addCase(addLeadNoteNew.pending, (state) => {
                    state.addLeadNoteNewLoading = true;
                    state.addLeadNoteNewError = null;
                })
                .addCase(addLeadNoteNew.fulfilled, (state, { payload }) => {
                    state.addLeadNoteNewLoading = false;
                    state.addLeadNoteNewData = payload;
                    state.addLeadNoteNewError = null;
                })
                .addCase(addLeadNoteNew.rejected, (state, { payload }) => {
                    state.addLeadNoteNewLoading = false;
                    state.addLeadNoteNewError = payload;
                })

                /* -------- GET LEAD NOTES BY ID NEW -------- */
                .addCase(getLeadNotesByIdNew.pending, (state) => {
                    state.getLeadNotesByIdNewLoading = true;
                    state.getLeadNotesByIdNewError = null;
                })
                .addCase(getLeadNotesByIdNew.fulfilled, (state, { payload }) => {
                    state.getLeadNotesByIdNewLoading = false;
                    state.getLeadNotesByIdNewData = payload;
                    state.getLeadNotesByIdNewError = null;
                })
                .addCase(getLeadNotesByIdNew.rejected, (state, { payload }) => {
                    state.getLeadNotesByIdNewLoading = false;
                    state.getLeadNotesByIdNewError = payload;
                })

        }
    }
)


export default AddSlice.reducer