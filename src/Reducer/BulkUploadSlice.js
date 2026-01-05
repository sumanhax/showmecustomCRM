import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const bulkUpload = createAsyncThunk(
  "bulkUpload/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/bulkupload/upload",
        formData
      );

      if (response?.data?.status_code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error.message
      );
    }
  }
);


const initialState = {
  loading: false,
  bulkUploadData: null,
  error: null,
  success: false,
};

const BulkUploadSlice = createSlice({
  name: "bulkUpload",
  initialState,
  reducers: {
    resetBulkUploadState: (state) => {
      state.loading = false;
      state.bulkUploadData = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bulkUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkUpload.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bulkUploadData = payload;
        state.success = true;
      })
      .addCase(bulkUpload.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      });
  },
});

export const { resetBulkUploadState } = BulkUploadSlice.actions;
export default BulkUploadSlice.reducer;
