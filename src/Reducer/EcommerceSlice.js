import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import axios from "axios";

export const addSupplier = createAsyncThunk(
    'supplier/addSupplier',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/admin/supplier/add', userInput);
            if (response?.data?.status_code === 201 || response?.data?.status_code === 200) {
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
export const supplierList = createAsyncThunk(
    'supplier/supplierList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/admin/supplier/list');
            if (response?.data?.status_code === 201 || response?.data?.status_code === 200) {
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
export const supplierDetails = createAsyncThunk(
    'supplier/supplierDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/admin/supplier/get/${id}`);
            if (response?.data?.status_code === 201 || response?.data?.status_code === 200) {
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
export const supplierEdit = createAsyncThunk(
    'supplier/supplierEdit',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/admin/supplier/edit/${id}`);
            if (response?.data?.status_code === 201 || response?.data?.status_code === 200) {
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
export const supplierDelete = createAsyncThunk(
    'supplier/supplierDelete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/api/admin/supplier/del/${id}`);
            if (response?.data?.status_code === 201 || response?.data?.status_code === 200) {
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
    message: null,
    addSupplierData:{},
    supplierListData:{},
    supplierDetailsData:{},
    supplierEditData:{},
    supplierDeleteData:{}
   
}

//slice part
const AddSlice = createSlice(
    {
        name: 'supplier',
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(addSupplier.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(addSupplier.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.addSupplierData=payload
                })
                .addCase(addSupplier.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierListData=payload
                })
                .addCase(supplierList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierDetails.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierDetails.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierDetailsData=payload
                })
                .addCase(supplierDetails.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierEdit.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierEdit.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierEditData=payload
                })
                .addCase(supplierEdit.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierDelete.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierDelete.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierDeleteData=payload
                })
                .addCase(supplierDelete.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                
        }
    }
)


export default AddSlice.reducer