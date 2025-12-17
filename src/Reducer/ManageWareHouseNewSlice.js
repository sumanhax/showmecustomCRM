import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiUser from "../store/ApiUser";


export const warehouseList = createAsyncThunk(
    'warehouseList',
    async ({page,limit}, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/warehouse/list?page=${page}&limit=${limit}`);
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

export const warehouseAdd = createAsyncThunk(
    'warehouseAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/warehouse/save`,userInput);
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
const initialState={
    loading:false,
    error:false,
    warehouseListData:[],
    warehouseAddData:{}
}
const ManageWareHouseNewSlice=createSlice(
    {
        name:"warehouse",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(warehouseList.pending,(state)=>{
                state.loading=true
            })
            .addCase(warehouseList.fulfilled,(state,{payload})=>{
                state.loading=false
                state.warehouseListData=payload
                state.error=false
            })
            .addCase(warehouseList.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
                .addCase(warehouseAdd.pending,(state)=>{
                state.loading=true
            })
            .addCase(warehouseAdd.fulfilled,(state,{payload})=>{
                state.loading=false
                state.warehouseAddData=payload
                state.error=false
            })
            .addCase(warehouseAdd.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default ManageWareHouseNewSlice.reducer;
