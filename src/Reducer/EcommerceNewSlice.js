import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import axios from "axios";
import newApi from "../store/NewApi";

// hat image
export const hatImageAdd = createAsyncThunk(
    'ecommerce/hatImageAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/postgresapi/admin/hat/image/save`, userInput);
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

export const hatImageUpdate = createAsyncThunk(
    'ecommerce/hatImageUpdate',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/postgresapi/admin/hat/primary-image/update`, userInput);
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
            const response = await api.get(`/postgresapi/admin/hat/image/list?hat_style_id=${id}`);
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
            const response = await api.post(`/postgresapi/admin/brand/save`, userInput);
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
            const response = await api.get(`/postgresapi/admin/brand/list`);
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
            const response = await api.get(`/postgresapi/admin/brand/list?id=${id}`);
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
export const brandDelete = createAsyncThunk(
    'ecommerce/brandDelete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/postgresapi/admin/brand/delete/${id}`);
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
            const response = await api.post(`/postgresapi/admin/hat/save`, userInput);
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
            const response = await api.get(`/postgresapi/admin/hat/list`);
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
            const response = await api.get(`/postgresapi/admin/hat/list?id=${id}`);
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

export const hatSingleForEdit = createAsyncThunk(
    'ecommerce/hatSingleForEdit',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/hat/detail?hat_id=${id}`);
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

export const hatUpdate = createAsyncThunk(
    'ecommerce/hatUpdate',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post(`/postgresapi/admin/hat/update`, userInput);
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
export const hatDelete = createAsyncThunk(
    'ecommerce/hatDelete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/postgresapi/admin/hat/delete/${id}`);
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
// export const hatColorAdd = createAsyncThunk(
//     'ecommerce/hatColorAdd',
//     async (userInput, { rejectWithValue }) => {
//         try {
//             const response = await api.post(`/postgresapi/admin/hat/color/save`,userInput);
//             if (response?.data?.status_code === 201 || response?.data?.status_code === 200) {
//                 return response.data;
//             } else {
//                 if (response?.data?.errors) {
//                     return rejectWithValue(response.data.errors);
//                 } else {
//                     return rejectWithValue('Something went wrong.');
//                 }
//             }
//         } catch (err) {
//             return rejectWithValue(err);
//         }
//     }
// )

export const hatColorAdd = createAsyncThunk(
    'ecommerce/hatColorAdd',
    async (formData, { rejectWithValue }) => {
        try {
            const hatStyleId = formData.get('hat_style_id');
            const response = await newApi.post(`/api/hats/${hatStyleId}/colors`, formData);
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || response?.data?.errors || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

// hat color update
export const hatColorUpdate = createAsyncThunk(
    'ecommerce/hatColorUpdate',
    async ({ hatStyleId, colorId, formData }, { rejectWithValue }) => {
        try {
            const response = await newApi.put(`/api/hats/${hatStyleId}/colors/${colorId}`, formData);
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || response?.data?.errors || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

// hat color delete
export const hatColorDelete = createAsyncThunk(
    'ecommerce/hatColorDelete',
    async ({ hatStyleId, colorId }, { rejectWithValue }) => {
        try {
            const response = await newApi.delete(`/api/hats/${hatStyleId}/colors/${colorId}`);
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || response?.data?.errors || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const hatColorList = createAsyncThunk(
    'ecommerce/hatColorList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/hat/color/list`);
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
// export const hatColorSingle = createAsyncThunk(
//     'ecommerce/hatColorSingle',
//     async (id, { rejectWithValue }) => {
//         try {
//             const response = await api.get(`/postgresapi/admin/hat/color/list?hat_style_id=${id}`);
//             if (response?.data?.status_code === 201 || response?.data?.status_code === 200) {
//                 return response.data;
//             } else {
//                 if (response?.data?.errors) {
//                     return rejectWithValue(response.data.errors);
//                 } else {
//                     return rejectWithValue('Something went wrong.');
//                 }
//             }
//         } catch (err) {
//             return rejectWithValue(err);
//         }
//     }
// )

export const hatColorSingle = createAsyncThunk(
    'ecommerce/hatColorSingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await newApi.get(`/api/hats/${id}/colors`);
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
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
            const response = await api.post(`/postgresapi/admin/hat/size/save`, userInput);
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
    async ({ hat_color_id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/hat/size/list?${hat_color_id}`);
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
            const response = await api.get(`/postgresapi/admin/hat/size/list?hat_color_id=${id}`);
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

// orders's API
export const orderList = createAsyncThunk(
    'ecommerce/orderList',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/order/list?page=${page}&limit=${limit}`);
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
export const orderSingle = createAsyncThunk(
    'ecommerce/orderSingle',
    async ({ page, limit, id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/postgresapi/admin/order/list?page=${page}&limit=${limit}&id=${id}`);
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

// ==================== THUNKS ====================

export const inventoryWiseUpdate = createAsyncThunk(
    'ecommerce/inventoryWiseUpdate',
    async ({ hatId, userInput }, { rejectWithValue }) => {
        try {
            const response = await newApi.put(`/api/hats/variants/${hatId}/inventory`, userInput);
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || response?.data?.errors || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

// export const variantWiseUpdateStatus = createAsyncThunk(
//     'ecommerce/variantWiseUpdateStatus',
//     async ({ inventoryId, userInput }, { rejectWithValue }) => {
//         try {
//             const response = await newApi.put(
//                 `api/hats/variants/${inventoryId}/status`,
//                 userInput
//             );
//             if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
//                 return response.data;
//             }
//             return rejectWithValue(response?.data?.message || response?.data?.errors || 'Something went wrong.');
//         } catch (err) {
//             return rejectWithValue(err);
//         }
//     }
// )

export const variantWiseUpdateStatus = createAsyncThunk(
    'ecommerce/variantWiseUpdateStatus',
    async ({ sizeId, userInput }, { rejectWithValue }) => {
        try {
            const response = await newApi.put(
                `api/hats/variants/${sizeId}/status`,
                userInput
            );
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

const initialState = {
    error: null,
    loading: false,
    brandListData: {},
    brandSingleData: {},
    hatListData: {},
    hatSingleData: [],
    hatColorListData: {},

    hatColorAddLoading: false,
    hatColorAddError: null,
    hatColorAddData: null,

    hatColorUpdateLoading: false,
    hatColorUpdateError: null,
    hatColorUpdateData: null,

    hatColorDeleteLoading: false,
    hatColorDeleteError: null,
    hatColorDeleteData: null,

    hatColorSingleData: {},
    hatSizeListData: {},
    hatSizeSingleData: {},
    hatImageGetData: {},
    orderListData: {},
    orderSingleData: {},
    updateHatData: "",
    hatSingleForEditData: {},
    hatImageUpdateMessage: "",

    // ==================== initialState====================

    inventoryWiseUpdateLoading: false,
    inventoryWiseUpdateError: null,
    inventoryWiseUpdateData: null,

    variantWiseUpdateStatusLoading: false,
    variantWiseUpdateStatusError: null,
    variantWiseUpdateStatusData: null,
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
                    state.brandListData = payload
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
                    state.brandSingleData = payload
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
                    state.hatListData = payload
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
                    state.hatSingleData = payload
                })
                .addCase(hatSingle.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })

                // hat color
                // .addCase(hatColorAdd.pending, (state) => {
                //     state.message = null
                //     state.loading = true;
                //     state.error = null
                // })
                // .addCase(hatColorAdd.fulfilled, (state, { payload }) => {
                //     state.loading = false;
                //     state.message = payload;
                // })
                // .addCase(hatColorAdd.rejected, (state, { payload }) => {
                //     state.loading = false;
                //     state.error = payload;
                // })
                // .addCase(hatColorList.pending, (state) => {
                //     state.message = null
                //     state.loading = true;
                //     state.error = null
                // })

                .addCase(hatColorAdd.pending, (state) => {
                    state.hatColorAddLoading = true;
                    state.hatColorAddError = null;
                })
                .addCase(hatColorAdd.fulfilled, (state, { payload }) => {
                    state.hatColorAddLoading = false;
                    state.hatColorAddData = payload?.data || payload;
                    state.hatColorAddError = null;
                })
                .addCase(hatColorAdd.rejected, (state, { payload }) => {
                    state.hatColorAddLoading = false;
                    state.hatColorAddError = payload?.message || payload || 'Hat color creation failed.';
                })

                // hat color update
                .addCase(hatColorUpdate.pending, (state) => {
                    state.hatColorUpdateLoading = true;
                    state.hatColorUpdateError = null;
                })
                .addCase(hatColorUpdate.fulfilled, (state, { payload }) => {
                    state.hatColorUpdateLoading = false;
                    state.hatColorUpdateData = payload?.data || payload;
                    state.hatColorUpdateError = null;
                })
                .addCase(hatColorUpdate.rejected, (state, { payload }) => {
                    state.hatColorUpdateLoading = false;
                    state.hatColorUpdateError = payload?.message || payload || 'Hat color update failed.';
                })

                // hat color delete
                .addCase(hatColorDelete.pending, (state) => {
                    state.hatColorDeleteLoading = true;
                    state.hatColorDeleteError = null;
                })
                .addCase(hatColorDelete.fulfilled, (state, { payload }) => {
                    state.hatColorDeleteLoading = false;
                    state.hatColorDeleteData = payload?.data || payload;
                    state.hatColorDeleteError = null;
                })
                .addCase(hatColorDelete.rejected, (state, { payload }) => {
                    state.hatColorDeleteLoading = false;
                    state.hatColorDeleteError = payload?.message || payload || 'Hat color delete failed.';
                })

                .addCase(hatColorList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.hatColorListData = payload
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
                    state.hatColorSingleData = payload
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
                    state.hatSizeListData = payload
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
                    state.hatSizeSingleData = payload
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
                .addCase(hatImageUpdate.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatImageUpdate.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.hatImageUpdateMessage = payload;
                })
                .addCase(hatImageUpdate.rejected, (state, { payload }) => {
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
                    state.hatImageGetData = payload
                })
                .addCase(hatImageGet.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(orderList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(orderList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.orderListData = payload
                })
                .addCase(orderList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(orderSingle.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(orderSingle.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.orderSingleData = payload
                })
                .addCase(orderSingle.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(hatUpdate.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatUpdate.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.updateHatData = payload
                })
                .addCase(hatUpdate.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(hatSingleForEdit.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatSingleForEdit.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.hatSingleForEditData = payload
                })
                .addCase(hatSingleForEdit.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })

             

                .addCase(inventoryWiseUpdate.pending, (state) => {
                    state.inventoryWiseUpdateLoading = true;
                    state.inventoryWiseUpdateError = null;
                })
                .addCase(inventoryWiseUpdate.fulfilled, (state, { payload }) => {
                    state.inventoryWiseUpdateLoading = false;
                    state.inventoryWiseUpdateData = payload?.data || payload;
                    state.inventoryWiseUpdateError = null;
                })
                .addCase(inventoryWiseUpdate.rejected, (state, { payload }) => {
                    state.inventoryWiseUpdateLoading = false;
                    state.inventoryWiseUpdateError = payload?.message || payload || 'Inventory update failed.';
                })

                .addCase(variantWiseUpdateStatus.pending, (state) => {
                    state.variantWiseUpdateStatusLoading = true;
                    state.variantWiseUpdateStatusError = null;
                })
                .addCase(variantWiseUpdateStatus.fulfilled, (state, { payload }) => {
                    state.variantWiseUpdateStatusLoading = false;
                    state.variantWiseUpdateStatusData = payload?.data || payload;
                    state.variantWiseUpdateStatusError = null;
                })
                .addCase(variantWiseUpdateStatus.rejected, (state, { payload }) => {
                    state.variantWiseUpdateStatusLoading = false;
                    state.variantWiseUpdateStatusError = payload?.message || payload || 'Variant status update failed.';
                })


        }
    }
)


export default AddSlice.reducer