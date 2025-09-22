import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorHandler from "../store/ErrorHandler";
import api from "../store/Api";


export const createBumpProduct = createAsyncThunk(
    'bump/createBumpProduct',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/bump/create-bump-product', userInput);
            if (response?.data?.status_code === 201) {
                return response?.data;
            } else {
                let errors = errorHandler(response);
                return rejectWithValue(errors);
            }
        } catch (error) {
            let errors = errorHandler(error);
            return rejectWithValue(errors);
        }
    }
)
const initialState = {
    loading: false,
    error: null,
    message: ""
}
const BumpProductSlice = createSlice(
    {
        name: "bump",
        initialState,
        reducers: {},
        extraReducers: (builer) => {
            builer.addCase(createBumpProduct.pending, (state) => {
                state.loading = true
            })
                .addCase(createBumpProduct.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = null
                })
                .addCase(createBumpProduct.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = null;
                    state.message = state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
        }
    }
)
export default BumpProductSlice.reducer;