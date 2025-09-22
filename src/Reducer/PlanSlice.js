import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const planList = createAsyncThunk(
    'planList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/plan/get-plans`);
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

export const planDetails = createAsyncThunk(
    'planDetails',
    async (planid, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan-details`, planid);
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
export const editPlan = createAsyncThunk(
    'eDitPlan',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan/edit-plan`, user_input);
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
export const updatePlan = createAsyncThunk(
    'updatePlan',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/update-subscripiton-plans`, input);
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

export const planStatus = createAsyncThunk(
    'planStatus',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan/status`, user_input);
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

export const createPlans = createAsyncThunk(
    'createPlans',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan/add-plan`, user_input);
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


export const updatePlans = createAsyncThunk(
    'updatePlans',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan/update-plan`, user_input);
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

export const getCountry = createAsyncThunk(
    'country',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/country/dropdown`);
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

export const addPlanDetails = createAsyncThunk(
    'addPlanDetails',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan-details/add-plan-details`, user_input);
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

export const getPlanDetails = createAsyncThunk(
    'getPlanDetails',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan-details/get-plan-details`, user_input);
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


export const editPlanDetails = createAsyncThunk(
    'editPlanDetails',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan-details/edit-plan-details`, user_input);
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

export const updateEditDetails = createAsyncThunk(
    'updateEditDetails',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/plan-details/update-plan-details`, user_input);
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

export const getCurrencyByCountry = createAsyncThunk(
    'getCurrencyByCountry',
    async (countryName, { rejectWithValue }) => {
        try {
            // Direct API call to REST Countries (no need for your api wrapper)
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

            if (response.ok) {
                const data = await response.json();
                return data; // This will be an array of country objects
            } else {
                return rejectWithValue({
                    status_code: response.status,
                    message: 'Failed to fetch currency data'
                });
            }
        } catch (error) {
            return rejectWithValue({
                status_code: 500,
                message: error.message || 'Network error occurred'
            });
        }
    }
)
const initialState = {
    loading: false,
    error: false,
    message: "",
    planListData: {},
    planDetailsData: {},
    loadingUpdatePlan: false,
    updatePlanData: {},
    planStatusData: "",
    addPlanData: "",
    updatePlanDatas: {},
    editPlanData: {},
    countryData: [],
    planDetailsData1: "",
    allPlans: [],
    editPlanDetailsData: {},
    updatePlanDetailsData: "",
    currencyData: ""
}

const PlanSlice = createSlice(
    {
        name: "plan",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder

                .addCase(planList.pending, (state) => {
                    state.loading = true
                })
                .addCase(planList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.planListData = payload
                })
                .addCase(planList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(planDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(planDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.error = false
                    state.planDetailsData = payload
                })
                .addCase(planDetails.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(planStatus.pending, (state, { payload }) => {
                    state.loading = true
                })
                .addCase(planStatus.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.planStatusData = payload
                    state.error = false
                })
                .addCase(planStatus.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(createPlans.pending, (state) => {
                    state.loading = true
                })
                .addCase(createPlans.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addPlanData = payload
                    state.error = false
                })
                .addCase(createPlans.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updatePlans?.pending, (state) => {
                    state.loading = true
                })
                .addCase(updatePlans?.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.updatePlanDatas = payload
                    state.error = false
                })
                .addCase(updatePlans.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(editPlan.pending, (state) => {
                    state.loading = true
                })
                .addCase(editPlan.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.editPlanData = payload
                    state.error = false
                })
                .addCase(editPlan.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getCountry.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCountry.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.countryData = payload
                    state.error = false
                })
                .addCase(getCountry.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addPlanDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(addPlanDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.planDetailsData1 = payload
                    state.error = false
                })
                .addCase(addPlanDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getPlanDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(getPlanDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allPlans = payload
                    state.error = false
                })
                .addCase(getPlanDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(editPlanDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(editPlanDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.editPlanDetailsData = payload
                    state.error = false
                })
                .addCase(editPlanDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateEditDetails.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateEditDetails.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.editPlanDetailsData = payload
                    state.error = false
                })
                .addCase(updateEditDetails.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getCurrencyByCountry.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCurrencyByCountry.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.currencyData = payload
                    state.error = false
                })
                .addCase(getCurrencyByCountry.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })


        }
    }
)
export default PlanSlice.reducer;