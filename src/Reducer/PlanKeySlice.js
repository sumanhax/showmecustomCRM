import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const planKeyList = createAsyncThunk(
    'planKeyList',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`admin/plan-key/get-plan-keys`, input);
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

export const paymentMethodList = createAsyncThunk(
    'paymentMethodList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/payment-method/list`);
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

export const addPlanKey = createAsyncThunk(
    'addPlanKey',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`admin/plan-key/add-plan-key`, input);
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

export const updatePlanKey = createAsyncThunk(
    'updatePlanKey',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`admin/plan-key/update-plan-key`, input);
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
    message: "",
    planKeys: [],
    paymentMethods: {},
    addloading: false,
    planKeyAdded: {},
    updateloading: false,
    planKeyUpdated: {},
};

const PlanKeySlice = createSlice(
    {
        name: "plankey",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder

                .addCase(planKeyList.pending, (state) => {
                    state.loading = true
                })
                .addCase(planKeyList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.planKeys = payload
                    state.error = false
                })
                .addCase(planKeyList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(paymentMethodList.pending, (state) => {
                    state.loading = true
                })
                .addCase(paymentMethodList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.paymentMethods = payload
                    state.error = false
                })
                .addCase(paymentMethodList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(addPlanKey.pending, (state) => {
                    state.addloading = true
                })
                .addCase(addPlanKey.fulfilled, (state, { payload }) => {
                    state.addloading = false
                    state.planKeyAdded = payload
                    state.error = false
                })
                .addCase(addPlanKey.rejected, (state, { payload }) => {
                    state.addloading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })

                .addCase(updatePlanKey.pending, (state) => {
                    state.updateloading = true
                })
                .addCase(updatePlanKey.fulfilled, (state, { payload }) => {
                    state.updateloading = false
                    state.planKeyUpdated = payload
                    state.error = false
                })
                .addCase(updatePlanKey.rejected, (state, { payload }) => {
                    state.updateloading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })


        }
    }
)
export default PlanKeySlice.reducer;