import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiUser from "../store/ApiUser";


export const primaryDecorationList = createAsyncThunk(
    'primaryDecorationList',
    async ({page,limit}, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/primary-decoration/list?page=${page}&limit=${limit}`);
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

export const addPriceTire = createAsyncThunk(
    'addPriceTire',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/decoration-price-tier/add`,userInput);
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
    decoList:[],
    allPriceTierList:[],
    addPriceData:{}
}
const ManagePriceTireNewSlice=createSlice(
    {
        name:"decoration",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(primaryDecorationList.pending,(state)=>{
                state.loading=true
            })
            .addCase(primaryDecorationList.fulfilled,(state,{payload})=>{
                state.loading=false
                state.decoList=payload
                state.error=false
            })
            .addCase(primaryDecorationList.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
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
                .addCase(addPriceTire.pending,(state)=>{
                state.loading=true
            })
            .addCase(addPriceTire.fulfilled,(state,{payload})=>{
                state.loading=false
                state.addPriceData=payload
                state.error=false
            })
            .addCase(addPriceTire.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default ManagePriceTireNewSlice.reducer;
