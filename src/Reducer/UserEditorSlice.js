import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";

export const getListPerProductTemplate = createAsyncThunk(
    'getListPerProductTemplate',
    async (userInput, { rejectWithValue }) => {
        try {
            console.log("User Input: ", userInput);

            console.log("userInput Id", userInput?.id);
            console.log("userInput PId", userInput?.pid);

            const response = await api.post(`/product/list-per-product-template/${userInput?.pid}`, { id: userInput?.id });
            console.log('response', response);
            if (response?.data?.status_code === 200) {
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

export const saveUserEditor = createAsyncThunk(
    'editor/product-save-editor',
    async (userInput, { rejectWithValue }) => {
        try {
            console.log("Data: ", userInput);

            const response = await api.post(`/product/product-save-template/${userInput?.pid}`, {
                data: userInput?.data,
                id: userInput?.id
            });
            console.log("product-save-template", response);


            if (response?.data?.status_code === 200) {
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
);
const initialState = {
    loading: false,
    data: [],
    error: null,
    message: "",
}
const UserEditorSlice = createSlice(
    {
        name: 'UserEditors',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getListPerProductTemplate.pending, (state) => {
                state.loading = true
            })
                .addCase(getListPerProductTemplate.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.data = payload
                    state.error = false
                })
                .addCase(getListPerProductTemplate.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
                .addCase(saveUserEditor.pending, (state) => {
                    state.loading = true
                })
                .addCase(saveUserEditor.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.message = payload
                    state.error = false
                })
                .addCase(saveUserEditor.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = true;
                    state.message =
                        payload !== undefined && payload.message
                            ? payload.message
                            : 'Something went wrong. Try again later.';
                })
        }
    }
)
export default UserEditorSlice.reducer;