import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiUser from "../store/ApiUser";
import axios from "axios";

// hat image
export const hatImageAdd = createAsyncThunk(
    'ecommerce/hatImageAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/hat/image/save`,userInput);
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
export const hatImageGet = createAsyncThunk(
    'ecommerce/hatImageGet',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/hat/image/list?hat_style_id=${id}`);
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
// brand api's
export const brandAdd = createAsyncThunk(
    'ecommerce/brandAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/brand/save`,userInput);
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
export const brandList = createAsyncThunk(
    'ecommerce/brandList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/brand/list`);
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
export const brandSingle = createAsyncThunk(
    'ecommerce/brandSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/brand/list?id=${id}`);
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
// hat api's
export const hatAdd = createAsyncThunk(
    'ecommerce/hatAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/hat/save`,userInput);
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
export const hatList = createAsyncThunk(
    'ecommerce/hatList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/hat/list`);
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
export const hatSingle = createAsyncThunk(
    'ecommerce/hatSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/hat/list?id=${id}`);
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
// hat color api's
export const hatColorAdd = createAsyncThunk(
    'ecommerce/hatColorAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/hat/color/save`,userInput);
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
export const hatColorList = createAsyncThunk(
    'ecommerce/hatColorList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/hat/color/list`);
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
export const hatColorSingle = createAsyncThunk(
    'ecommerce/hatColorSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/hat/color/list?hat_style_id=${id}`);
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
// hat size api's
export const hatSizeAdd = createAsyncThunk(
    'ecommerce/hatSizeAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/postgresapi/admin/hat/size/save`,userInput);
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
export const hatSizeList = createAsyncThunk(
    'ecommerce/hatSizeList',
    async ({hat_color_id}, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/hat/size/list?${hat_color_id}`);
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
export const hatSizeSingle = createAsyncThunk(
    'ecommerce/hatSizeSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/postgresapi/admin/hat/size/list?hat_color_id=${id}`);
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

const initialState = {
    error: null,
    loading: false,
    brandListData:{},
    brandSingleData :{},
    hatListData:{},
    hatSingleData:[],
    hatColorListData:{},
    hatColorSingleData:{},
    hatSizeListData:{},
    hatSizeSingleData:{},
    hatImageGetData:{}
}

//slice part
const AddSlice = createSlice(
    {
        name: 'ecommerce',
        initialState,
        extraReducers: (builder) => {
            builder
            .addCase(brandAdd.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(brandAdd.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
            })
            .addCase(brandAdd.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(brandList.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(brandList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.brandListData=payload
            })
            .addCase(brandList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(brandSingle.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(brandSingle.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.brandSingleData=payload
            })
            .addCase(brandSingle.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
                
            // hat
            .addCase(hatAdd.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatAdd.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
            })
            .addCase(hatAdd.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(hatList.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.hatListData=payload
            })
            .addCase(hatList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(hatSingle.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatSingle.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.hatSingleData=payload
            })
            .addCase(hatSingle.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // hat color
            .addCase(hatColorAdd.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatColorAdd.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
            })
            .addCase(hatColorAdd.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(hatColorList.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatColorList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.hatColorListData=payload
            })
            .addCase(hatColorList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(hatColorSingle.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatColorSingle.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.hatColorSingleData=payload
            })
            .addCase(hatColorSingle.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // hat size
            .addCase(hatSizeAdd.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatSizeAdd.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
            })
            .addCase(hatSizeAdd.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(hatSizeList.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatSizeList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.hatSizeListData=payload
            })
            .addCase(hatSizeList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(hatSizeSingle.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatSizeSingle.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.hatSizeSingleData=payload
            })
            .addCase(hatSizeSingle.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // hat image
            .addCase(hatImageAdd.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatImageAdd.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
            })
            .addCase(hatImageAdd.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(hatImageGet.pending, (state) => {
                state.message = null
                state.loading = true;
                state.error = null
            })
            .addCase(hatImageGet.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload;
                state.hatImageGetData=payload
            })
            .addCase(hatImageGet.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            }
    }
)


export default AddSlice.reducer