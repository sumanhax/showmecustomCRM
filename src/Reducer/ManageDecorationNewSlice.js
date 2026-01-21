import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const decorationaddonList = createAsyncThunk(
    'decorationaddonList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/decoration/add/on/list`);
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
export const decorationaddonSingle = createAsyncThunk(
    'decorationaddonSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/decoration/add/on/list?id=${id}`);
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
export const decorationaddonAdd = createAsyncThunk(
    'decorationaddonAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/postgresapi/admin/decoration/add/on/save`,userInput);
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
export const decorationaddonPriceList = createAsyncThunk(
    'decorationaddonPriceList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/decoration/add/on/price/list`);
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
export const decorationaddonPriceSingle = createAsyncThunk(
    'decorationaddonPriceSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/decoration/add/on/price/list?decoration_addon_id=${id}`);
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
export const decorationaddonPriceAdd = createAsyncThunk(
    'decorationaddonPriceAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/postgresapi/admin/decoration/add/on/price/save`,userInput);
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
    decorationaddonListData:[],
    decorationaddonPriceListData:[],
    decorationaddonSingleData:[],
    decorationaddonPriceSingleData:[]
}
const ManageDecorationNewSlice=createSlice(
    {
        name:"decorationaddon",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(decorationaddonList.pending,(state)=>{
                state.loading=true
            })
            .addCase(decorationaddonList.fulfilled,(state,{payload})=>{
                state.loading=false
                state.decorationaddonListData=payload
                state.error=false
            })
            .addCase(decorationaddonList.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(decorationaddonSingle.pending,(state)=>{
                state.loading=true
            })
            .addCase(decorationaddonSingle.fulfilled,(state,{payload})=>{
                state.loading=false
                state.decorationaddonSingleData=payload
                state.error=false
            })
            .addCase(decorationaddonSingle.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(decorationaddonAdd.pending,(state)=>{
                state.loading=true
            })
            .addCase(decorationaddonAdd.fulfilled,(state,{payload})=>{
                state.loading=false
                state.error=false
            })
            .addCase(decorationaddonAdd.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(decorationaddonPriceList.pending,(state)=>{
                state.loading=true
            })
            .addCase(decorationaddonPriceList.fulfilled,(state,{payload})=>{
                state.loading=false
                state.decorationaddonPriceListData=payload
                state.error=false
            })
            .addCase(decorationaddonPriceList.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(decorationaddonPriceAdd.pending,(state)=>{
                state.loading=true
            })
            .addCase(decorationaddonPriceAdd.fulfilled,(state,{payload})=>{
                state.loading=false
                state.error=false
            })
            .addCase(decorationaddonPriceAdd.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(decorationaddonPriceSingle.pending,(state)=>{
                state.loading=true
            })
            .addCase(decorationaddonPriceSingle.fulfilled,(state,{payload})=>{
                state.loading=false
                state.decorationaddonPriceSingleData=payload
                state.error=false
            })
            .addCase(decorationaddonPriceSingle.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
                
        }
    }
)
export default ManageDecorationNewSlice.reducer;
