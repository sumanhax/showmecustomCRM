import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiUser from "../store/ApiUser";



export const inventoryList = createAsyncThunk(
    'inventoryList',
    async ({page,limit}, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/inventory-item/list?page=${page}&limit=${limit}`);
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

export const addInventory = createAsyncThunk(
    'addInventory',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/inventory-item/add`,userInput);
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
    inventoryListData:[],
    addinventData:{}
}
const AddInvetoryNewSlice=createSlice(
    {
        name:"invent",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(inventoryList.pending,(state)=>{
                state.loading=true
            })
            .addCase(inventoryList.fulfilled,(state,{payload})=>{
                state.loading=false
                state.inventoryListData=payload
                state.error=false
            })
            .addCase(inventoryList.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
                .addCase(addInventory.pending,(state)=>{
                state.loading=true
            })
            .addCase(addInventory.fulfilled,(state,{payload})=>{
                state.loading=false
                state.addinventData=payload
                state.error=false
            })
            .addCase(addInventory.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default AddInvetoryNewSlice.reducer;
