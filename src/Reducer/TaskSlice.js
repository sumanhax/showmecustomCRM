import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";



export const addTaskLeads = createAsyncThunk(
    'addTaskLeads',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/dashboard/create-action`,user_input);
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
    error:false,
    addTaskData:""
}
const TaskSlice=createSlice(
    {
        name:'tasks',
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(addTaskLeads.pending,(state)=>{
                state.loading=true
            })
            .addCase(addTaskLeads.fulfilled,(state,{payload})=>{
                state.loading=false
                state.addTaskData=payload
            })
            .addCase(addTaskLeads.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default TaskSlice.reducer