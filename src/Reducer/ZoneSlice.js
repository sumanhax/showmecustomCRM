import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const getCounrtyForCoach = createAsyncThunk(
    'getCounrtyForCoach',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-country-list`);
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
export const getRMForCoach = createAsyncThunk(
    'getRMForCoach',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-rm-list`);
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
export const getLevel = createAsyncThunk(
    'getLevel',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-levels-list`);
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
export const getDays = createAsyncThunk(
    'getDays',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-days-list`);
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
export const addZone = createAsyncThunk(
    'addZone',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/zone/add-zone`, user_input);
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

export const updateZone = createAsyncThunk(
    'updateZone',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/zone/update-zone`, user_input);
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
export const geneatePass = createAsyncThunk(
    'geneatePass',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/generate-password`, user_input);
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

export const getZoneList = createAsyncThunk(
    'getZoneList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/zone/get-zone`);
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

export const getActiveDeactive = createAsyncThunk(
    'getActiveDeactive',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/zone/change-status`, user_input);
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

export const deleteZone = createAsyncThunk(
    'deleteZone',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/zone/delete`, user_input);
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




export const getZoneListSingle = createAsyncThunk(
    'getZoneListSingle',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/zone/get-zone`, user_input);
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

export const getCoachListOperationalHead = createAsyncThunk(
    'getCoachListOperationalHead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/operation-head/coach/get-coach-list`);
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

export const checkCoachBreakTimeDiff = createAsyncThunk(
    'checkCoachBreakTimeDiff',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/operation-head/coach/check-break-time-difference`, input);
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

export const checkCoachTimes = createAsyncThunk(
    'checkCoachTimes',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/operation-head/coach/check-coach-times`, input);
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
    error: false,
    coachCountryData: [],
    rmData: [],
    levelData: [],
    daysData: [],
    addZoneData: "",
    allZone: [],
    genPass: "",
    getCoachOHData: [],
    coachBreakTimeDiff: {},
    coachTimes: {},
    updateZoneData: {},
    singleZone: {},
    zoneDeleteData: {}
}
const ZoneSlice = createSlice(
    {
        name: 'coachs',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getCounrtyForCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCounrtyForCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachCountryData = payload
                    state.error = false
                })
                .addCase(getCounrtyForCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.coachCountryData = []
                    state.error = payload
                })
                .addCase(getRMForCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(getRMForCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.rmData = payload
                    state.error = false
                })
                .addCase(getRMForCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getLevel.pending, (state) => {
                    state.loading = true
                })
                .addCase(getLevel.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.levelData = payload
                    state.error = false
                })
                .addCase(getLevel.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getDays.pending, (state) => {
                    state.loading = true
                })
                .addCase(getDays.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.daysData = payload
                    state.error = false
                })
                .addCase(getDays.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addZone.pending, (state) => {
                    state.loading = true
                })
                .addCase(addZone.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addZoneData = payload
                    state.error = false
                })
                .addCase(addZone.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getZoneList.pending, (state) => {
                    state.loading = true
                })
                .addCase(getZoneList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allZone = payload
                    state.error = false
                })
                .addCase(getZoneList.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(geneatePass.pending, (state) => {
                    state.loading = true
                })
                .addCase(geneatePass.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.genPass = payload
                    state.error = false
                })
                .addCase(geneatePass.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getCoachListOperationalHead.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCoachListOperationalHead.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.getCoachOHData = payload
                    state.error = false
                })
                .addCase(getCoachListOperationalHead.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

                .addCase(checkCoachBreakTimeDiff.pending, (state) => {
                    state.loading = true
                })
                .addCase(checkCoachBreakTimeDiff.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachBreakTimeDiff = payload
                    state.error = false
                })
                .addCase(checkCoachBreakTimeDiff.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

                .addCase(checkCoachTimes.pending, (state) => {
                    state.loading = true
                })
                .addCase(checkCoachTimes.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachTimes = payload
                    state.error = false
                })
                .addCase(checkCoachTimes.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateZone.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateZone.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.updateZoneData = payload
                    state.error = false
                })
                .addCase(updateZone.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getZoneListSingle.pending, (state) => {
                    state.loading = true
                })
                .addCase(getZoneListSingle.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleZone = payload
                    state.error = false
                })
                .addCase(getZoneListSingle.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(deleteZone.pending, (state) => {
                    state.loading = true
                })
                .addCase(deleteZone.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.zoneDeleteData = payload
                    state.error = false
                })
                .addCase(deleteZone.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }
)
export default ZoneSlice.reducer;