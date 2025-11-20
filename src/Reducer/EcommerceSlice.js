import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiUser from "../store/ApiUser";
import axios from "axios";

export const addSupplier = createAsyncThunk(
    'supplier/addSupplier',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post('/api/admin/supplier/add', userInput);
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
export const supplierList = createAsyncThunk(
    'supplier/supplierList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiUser.get('/api/admin/supplier/list');
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
export const supplierDetails = createAsyncThunk(
    'supplier/supplierDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/supplier/get/${id}`);
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
export const supplierEdit = createAsyncThunk(
    'supplier/supplierEdit',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await apiUser.put(`/api/admin/supplier/edit/${id}`, userInput);
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
export const supplierActiveToggle = createAsyncThunk(
    'supplier/supplierActiveToggle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.delete(`/api/admin/supplier/del/${id}`);
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
    'supplier/hatList',
    async ({ limit, page }, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/hat/list?limit=${limit}&page=${page}`);
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
export const hatDetails = createAsyncThunk(
    'supplier/hatDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/hat/sinlge?id=${id}`);
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
export const hatAdd = createAsyncThunk(
    'supplier/hatAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/hat/add`, userInput);
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
export const hatEdit = createAsyncThunk(
    'supplier/hatEdit',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/hat/update/${id}`, userInput);
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
export const hatEditImageUpload = createAsyncThunk(
    'supplier/hatEditImageUpload',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/hat/iamge-upload/${id}`, userInput);
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
    'supplier/hatDelete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.delete(`/api/admin/hat/del/${id}`);
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
export const addVarientSize = createAsyncThunk(
    'supplier/addVarientSize',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/variant/size/add`, userInput);
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
export const addVarient = createAsyncThunk(
    'supplier/addVarient',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/variant/add`, userInput);
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
export const updateVarient = createAsyncThunk(
    'supplier/updateVarient',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/variant/update/${id}`, userInput);
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
export const updateVarientImage = createAsyncThunk(
    'supplier/updateVarientImage',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/variant/update-image/${id}`, userInput);
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
export const varientList = createAsyncThunk(
    'supplier/varientList',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/variant/list`, userInput);
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

// inventory api's
export const inventoryList = createAsyncThunk(
    'supplier/inventoryList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/inventory/listing`);
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
export const inventorySingle = createAsyncThunk(
    'supplier/inventorySingle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/inventory/listing/hat?id=${id}`);
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
export const inventoryAdd = createAsyncThunk(
    'supplier/inventoryAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/inventory/add`, userInput);
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
export const inventoryEdit = createAsyncThunk(
    'supplier/inventoryEdit',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/inventory/edit`, userInput);
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
export const inventoryUpdate = createAsyncThunk(
    'supplier/inventoryUpdate',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/inventory/update`, userInput);
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
export const inventoryShowHide = createAsyncThunk(
    'supplier/inventoryShowHide',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/inventory/show-hide-inventory`, userInput);
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
export const inventoryDelete = createAsyncThunk(
    'supplier/inventoryDelete',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/inventory/delete-inventory`, userInput);
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

// decoration api's
    export const decorationList = createAsyncThunk(
        'supplier/decorationList',
        async (_, { rejectWithValue }) => {
            try {
                const response = await apiUser.get(`/api/admin/decoration/list`);
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
    export const decorationAdd = createAsyncThunk(
        'supplier/decorationAdd',
        async (userInput, { rejectWithValue }) => {
            try {
                const response = await apiUser.post(`/api/admin/decoration/save`, userInput);
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
    export const decorationSingle = createAsyncThunk(
        'supplier/decorationSingle',
        async (userInput, { rejectWithValue }) => {
            try {
                const response = await apiUser.get(`/api/admin/decoration/list?id=${userInput}`);
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
    export const decorationUpdate = createAsyncThunk(
        'supplier/decorationUpdate',
        async ({ id, userInput }, { rejectWithValue }) => {
            try {
                const response = await apiUser.post(`/api/admin/decoration/update/${id}`, userInput);
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
    export const decorationStatusChange = createAsyncThunk(
        'supplier/decorationStatusChange',
        async (userInput, { rejectWithValue }) => {
            try {
                const response = await apiUser.patch(`/api/admin/decoration/status/${userInput}`);
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
// logo api's
export const logoList = createAsyncThunk(
    'supplier/logoList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/logo/list`);
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
export const logoAdd = createAsyncThunk(
    'supplier/logoAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/logo/save`, userInput);
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
export const logoUpdate = createAsyncThunk(
    'supplier/logoUpdate',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/logo/update/${id}`, userInput);
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
export const logoStatusChange = createAsyncThunk(
    'supplier/logoStatusChange',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/logo/status/${userInput}`);
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
// pricetier

export const pricetierAdd = createAsyncThunk(
    'supplier/pricetierAdd',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.post(`/api/admin/pricetiers/save`, userInput);
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
export const pricetierList = createAsyncThunk(
    'supplier/pricetierList',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.get(`/api/admin/pricetiers/list?id=${userInput}`);
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
export const pricetierUpdate = createAsyncThunk(
    'supplier/pricetierUpdate',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/pricetiers/update/${id}`, userInput);
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
export const pricetierStatusChange = createAsyncThunk(
    'supplier/pricetierStatusChange',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await apiUser.patch(`/api/admin/pricetiers/status/${userInput}`);
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
    inventorySingleloading: false,
    message: null,
    addSupplierData:{},
    supplierListData:{},
    supplierDetailsData:{},
    supplierEditData:{},
    supplierActiveToggleData:{},
    hatListData:{},
    hatDetailsData:{},
    hatAddData:{},
    hatEditData:{},
    hatDeleteData:{},
    varientListData:{},
    inventoryListData:{},
    inventorySingleData:{},
    inventoryEditData:{},
    decorationListData:{},
    logoListData:{},
    pricetierListData:{},

}

//slice part
const AddSlice = createSlice(
    {
        name: 'supplier',
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(addSupplier.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(addSupplier.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.addSupplierData=payload
                })
                .addCase(addSupplier.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierListData=payload
                })
                .addCase(supplierList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierDetails.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierDetails.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierDetailsData=payload
                })
                .addCase(supplierDetails.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierEdit.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierEdit.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierEditData=payload
                })
                .addCase(supplierEdit.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(supplierActiveToggle.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(supplierActiveToggle.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.supplierActiveToggleData=payload
                })
                .addCase(supplierActiveToggle.rejected, (state, { payload }) => {
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
                .addCase(hatAdd.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatAdd.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.hatAddData=payload
                })
                .addCase(hatAdd.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(hatDetails.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatDetails.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.hatDetailsData=payload
                })
                .addCase(hatDetails.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(hatDelete.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatDelete.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(hatDelete.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(hatEdit.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatEdit.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(hatEdit.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(hatEditImageUpload.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(hatEditImageUpload.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(hatEditImageUpload.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // varient
                .addCase(addVarientSize.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(addVarientSize.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    
                })
                .addCase(addVarientSize.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(addVarient.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(addVarient.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    
                })
                .addCase(addVarient.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(updateVarient.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(updateVarient.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(updateVarient.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(updateVarientImage.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(updateVarientImage.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(updateVarientImage.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(varientList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(varientList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.varientListData=payload
                })
                .addCase(varientList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // inventory
                .addCase(inventoryList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(inventoryList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.inventoryListData=payload
                })
                .addCase(inventoryList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(inventorySingle.pending, (state) => {
                    state.message = null
                    state.inventorySingleloading = true;
                    state.error = null
                })
                .addCase(inventorySingle.fulfilled, (state, { payload }) => {
                    state.inventorySingleloading = false;
                    state.message = payload;
                    state.inventorySingleData=payload
                })
                .addCase(inventorySingle.rejected, (state, { payload }) => {
                    state.inventorySingleloading = false;
                    state.error = payload;
                })
                .addCase(inventoryAdd.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(inventoryAdd.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                  
                })
                .addCase(inventoryAdd.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(inventoryEdit.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(inventoryEdit.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.inventoryEditData=payload
                })
                .addCase(inventoryEdit.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(inventoryUpdate.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(inventoryUpdate.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                   
                })
                .addCase(inventoryUpdate.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(inventoryShowHide.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(inventoryShowHide.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(inventoryShowHide.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(inventoryDelete.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(inventoryDelete.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(inventoryDelete.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // decoration
                .addCase(decorationList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(decorationList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.decorationListData=payload
                })
                .addCase(decorationList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(decorationAdd.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(decorationAdd.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(decorationAdd.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(decorationSingle.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(decorationSingle.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(decorationSingle.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(decorationUpdate.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(decorationUpdate.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(decorationUpdate.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(decorationStatusChange.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })  
                .addCase(decorationStatusChange.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(decorationStatusChange.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // logo
                .addCase(logoList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(logoList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.logoListData=payload
                })
                .addCase(logoList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(logoAdd.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(logoAdd.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(logoAdd.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(logoUpdate.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(logoUpdate.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(logoUpdate.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(logoStatusChange.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(logoStatusChange.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(logoStatusChange.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                // pricetier
                .addCase(pricetierList.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(pricetierList.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                    state.pricetierListData=payload
                })
                .addCase(pricetierList.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(pricetierAdd.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(pricetierAdd.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(pricetierAdd.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(pricetierUpdate.pending, (state) => {
                    state.message = null
                    state.loading = true;
                    state.error = null
                })
                .addCase(pricetierUpdate.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(pricetierUpdate.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
                .addCase(pricetierStatusChange.pending, (state) => {
                    state.message = null
                    state.loading = true;
                })
                .addCase(pricetierStatusChange.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.message = payload;
                })
                .addCase(pricetierStatusChange.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                })
            }
    }
)


export default AddSlice.reducer