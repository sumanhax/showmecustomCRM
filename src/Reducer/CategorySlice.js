import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const addCateGory = createAsyncThunk(
    'addCateGory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category/add-category`, user_input);
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

export const getCateGory = createAsyncThunk(
    'getCateGory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category/get-category`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const getSingleCateGory = createAsyncThunk(
    'getSingleCateGory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category/get-category`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const updateCateGory = createAsyncThunk(
    'updateCateGory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category/update-category`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)
export const getActiveDeactive = createAsyncThunk(
    'getActiveDeactive',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category/change-status`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const getActiveDeactiveDesc = createAsyncThunk(
    'getActiveDeactiveDesc',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category-desc/change-status`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const addCategoryDes = createAsyncThunk(
    'addCategoryDes',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category-desc/add-desc`, user_input);
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

export const updateCategoryDes = createAsyncThunk(
    'updateCategoryDes',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category-desc/update-desc`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }

)

export const getCateGoryDes = createAsyncThunk(
    'getCateGoryDes',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category-desc/get-desc`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const deleteCateDes = createAsyncThunk(
    'deleteCateDes',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category-desc/delete`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'deleteCategory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category/delete-category`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const uploadAvatar = createAsyncThunk(
    'uploadAvatar',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/category/change-category-image`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)



const initialState = {
    loading: false,
    addCateGoryData: {},
    cateGory: [],
    error: false,
    singleCate: {},
    updateCateData: {},
    categoryDesc: {},
    allDes: [],
    upDateDesData: {},
    deleteDesCate: {},
    delCat: {},
    uploadPic: {}
}
const CategorySlice = createSlice(
    {
        name: "cate",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(addCateGory.pending, (state) => {
                    state.loading = true
                })
                .addCase(addCateGory.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addCateGoryData = payload
                    state.error = false
                })
                .addCase(addCateGory.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getCateGory.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCateGory.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.cateGory = payload
                    state.error = false
                })
                .addCase(getCateGory.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getSingleCateGory.pending, (state) => {
                    state.loading = true
                })
                .addCase(getSingleCateGory.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.singleCate = payload
                    state.error = false
                })
                .addCase(getSingleCateGory.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateCateGory.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateCateGory.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.updateCateData = payload
                    state.error = false
                })
                .addCase(updateCateGory.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addCategoryDes.pending, (state) => {
                    state.loading = true
                })
                .addCase(addCategoryDes.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.categoryDesc = payload
                    state.error = false
                })
                .addCase(addCategoryDes.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getCateGoryDes.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCateGoryDes.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allDes = payload
                    state.error = false
                })
                .addCase(getCateGoryDes.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(updateCategoryDes.pending, (state) => {
                    state.loading = true
                })
                .addCase(updateCategoryDes.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.upDateDesData = payload
                    state.error = false
                })
                .addCase(updateCategoryDes.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(deleteCateDes.pending, (state) => {
                    state.loading = true
                })
                .addCase(deleteCateDes.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.deleteDesCate = payload
                    state.error = false
                })
                .addCase(deleteCateDes.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(deleteCategory.pending, (state) => {
                    state.loading = true
                })
                .addCase(deleteCategory.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.delCat = payload
                    state.error = false
                })
                .addCase(deleteCategory.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(uploadAvatar.pending, (state) => {
                    state.loading = true
                })
                .addCase(uploadAvatar.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.uploadPic = payload
                    state.error = false
                })
                .addCase(uploadAvatar.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }
)
export default CategorySlice.reducer;