import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiUser from "../store/ApiUser";



export const priceTierList = createAsyncThunk(
    'priceTierList',
    async ({page,limit}, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/decoration-price-tier/list?page=${page}&limit=${limit}`);
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
 
    allPriceTierList:[],
    addinventData:{}
}
const AddInvetoryNewSlice=createSlice(
    {
        name:"invent",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(priceTierList.pending,(state)=>{
                state.loading=true
            })
            .addCase(priceTierList.fulfilled,(state,{payload})=>{
                state.loading=false
                state.allPriceTierList=payload
                state.error=false
            })
            .addCase(priceTierList.rejected,(state,{payload})=>{
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
