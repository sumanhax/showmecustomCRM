import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const getEquilizer=createAsyncThunk(
    'getEquilizer',
      async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-equelizer/get-mood-equelizer`);
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

export const addEquilizer = createAsyncThunk(
    'addEquilizer',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-equelizer/create`, user_input);
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

export const changeStatusEquilizer = createAsyncThunk(
    'changeStatusEquilizer',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/mood-equelizer/change-status`, user_input);
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
const initialState={
    loading:false,
    equilizerList:[],
    error:false,
    addEquilizerData:[]
}
const EquilizerSlice=createSlice(
    {
           name: 'equi',
           initialState,
           reducers: {},
           extraReducers: (builder) => {
               builder.addCase(getEquilizer.pending, (state) => {
                   state.loading = true
               })
                   .addCase(getEquilizer.fulfilled, (state, { payload }) => {
                       state.loading = false
                       state.equilizerList = payload
                       state.error = false
                   })
                   .addCase(getEquilizer.rejected, (state, { payload }) => {
                       state.loading = false
                       state.error = payload
                   })
                   .addCase(addEquilizer.pending, (state) => {
                   state.loading = true
               })
                   .addCase(addEquilizer.fulfilled, (state, { payload }) => {
                       state.loading = false
                       state.addEquilizerData = payload
                       state.error = false
                   })
                   .addCase(addEquilizer.rejected, (state, { payload }) => {
                       state.loading = false
                       state.error = payload
                   })
                 
           }
       }
    

)
export default EquilizerSlice.reducer;