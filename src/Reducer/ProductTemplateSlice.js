import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const createProductTemplate = createAsyncThunk(
    'productTemplate/createProductTemplate',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/product/product-save-template/${38}`, userInput);
            if (response?.data?.status_code === 201) {
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
    loading: false,
    error: false,
    message: ""
}

const ProductTemplateSlice = createSlice(
    {
        name: 'productTemplate',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(createProductTemplate.pending, (state) => {
                state.loading = true
            })
                .addCase(createProductTemplate.fulfilled, (state, payload) => {
                    state.loading = false
                    state.error = false
                    state.message = payload
                })
                .addCase(createProductTemplate.rejected, (state, { payload }) => {
                    state.error = true;
                    state.loading = false;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
        }

    }
)
export default ProductTemplateSlice.reducer;