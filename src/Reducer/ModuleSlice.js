import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getModules = createAsyncThunk(
    'getModules',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/module/list`);
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

export const addModule = createAsyncThunk(
    'addModule',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`admin/module/add`, input);
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

export const moduleDetails = createAsyncThunk(
    'moduleDetails',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/module/details/${input}`);
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

export const updateModule = createAsyncThunk(
    'updateModule',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.patch(`admin/module/update`, input);
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
    allModules: [],
    addloading: false,
    moduleAdded: {},
    detailsloading: false,
    moduleDetailsData: {},
    updateloading: false,
    moduleUpdated: {},
    error: false
}
const ModuleSlice = createSlice(
    {
        'name': 'modulesData',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getModules.pending, (state) => {
                    state.loading = true
                })
                .addCase(getModules.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allModules = payload
                    state.error = false
                })
                .addCase(getModules.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

                .addCase(addModule.pending, (state) => {
                    state.addloading = true
                })
                .addCase(addModule.fulfilled, (state, { payload }) => {
                    state.addloading = false
                    state.moduleAdded = payload
                    state.error = false
                })
                .addCase(addModule.rejected, (state, { payload }) => {
                    state.addloading = false
                    state.error = payload
                })

                .addCase(moduleDetails.pending, (state) => {
                    state.detailsloading = true
                })
                .addCase(moduleDetails.fulfilled, (state, { payload }) => {
                    state.detailsloading = false
                    state.moduleDetailsData = payload
                    state.error = false
                })
                .addCase(moduleDetails.rejected, (state, { payload }) => {
                    state.detailsloading = false
                    state.error = payload
                })

                .addCase(updateModule.pending, (state) => {
                    state.updateloading = true
                })
                .addCase(updateModule.fulfilled, (state, { payload }) => {
                    state.updateloading = false
                    state.moduleUpdated = payload
                    state.error = false
                })
                .addCase(updateModule.rejected, (state, { payload }) => {
                    state.updateloading = false
                    state.error = payload
                })
        }
    }

)
export default ModuleSlice.reducer;