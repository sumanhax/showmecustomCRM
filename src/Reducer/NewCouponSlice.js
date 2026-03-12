import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newApi from "../store/NewApi";

// POST /api/admin/coupons - Add new coupon
export const createCoupon = createAsyncThunk(
    'coupons/createCoupon',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await newApi.post('/api/admin/coupons', formData);
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || response?.data?.errors || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

// GET /api/admin/coupons - Get all coupons list
export const getCouponList = createAsyncThunk(
    'coupons/getCouponList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await newApi.get('/api/admin/coupons');
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

// GET /api/admin/coupons/:code - Get coupon details by code
export const getCouponByCode = createAsyncThunk(
    'coupons/getCouponByCode',
    async (couponCode, { rejectWithValue }) => {
        try {
            const response = await newApi.get(`/api/admin/coupons/${couponCode}`);
            if (response?.status === 200 || response?.data?.status === true) {
                return response.data;
            }
            return rejectWithValue(response?.data?.message || 'Something went wrong.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

// ✅ PUT /api/admin/coupons/update/:id — toggle active/inactive
export const toggleCouponStatus = createAsyncThunk(
    'coupons/toggleCouponStatus',
    async ({ coupon, isActive }, { rejectWithValue }) => {
        try {
            const payload = {
                code: coupon.code,
                title: coupon.title,
                description: coupon.description ?? "",
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                appliesTo: coupon.appliesTo,
                usageLimit: coupon.usageLimit,
                minOrderAmount: coupon.minOrderAmount ?? 0,
                maxDiscountAmount: coupon.maxDiscountAmount ?? 0,
                startsAt: coupon.startsAt,
                expiresAt: coupon.expiresAt,
                isActive: isActive,
            };
            const response = await newApi.put(`/api/admin/coupons/update/${coupon.id}`, payload);
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === true) {
                return { code: coupon.code, isActive };
            }
            return rejectWithValue(response?.data?.message || 'Failed to update status.');
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

const initialState = {
    // Create Coupon
    createCouponLoading: false,
    createCouponError: null,
    createCouponData: null,

    // Coupon List
    couponListLoading: false,
    couponListError: null,
    couponListData: [],

    // Coupon Details by Code
    couponDetailLoading: false,
    couponDetailError: null,
    couponDetailData: null,

    // Toggle Status
    toggleStatusLoading: false,
    toggleStatusError: null,
}

const NewCouponSlice = createSlice({
    name: 'newCoupons',
    initialState,
    reducers: {
        resetCreateCoupon: (state) => {
            state.createCouponLoading = false;
            state.createCouponError = null;
            state.createCouponData = null;
        },
        resetCouponDetail: (state) => {
            state.couponDetailLoading = false;
            state.couponDetailError = null;
            state.couponDetailData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Coupon
            .addCase(createCoupon.pending, (state) => {
                state.createCouponLoading = true;
                state.createCouponError = null;
            })
            .addCase(createCoupon.fulfilled, (state, { payload }) => {
                state.createCouponLoading = false;
                state.createCouponData = payload?.data || payload;
                state.createCouponError = null;
            })
            .addCase(createCoupon.rejected, (state, { payload }) => {
                state.createCouponLoading = false;
                state.createCouponError = payload?.message || payload || 'Coupon creation failed.';
            })

            // Get Coupon List
            .addCase(getCouponList.pending, (state) => {
                state.couponListLoading = true;
                state.couponListError = null;
            })
            .addCase(getCouponList.fulfilled, (state, { payload }) => {
                state.couponListLoading = false;
                state.couponListData = payload?.data || payload;
                state.couponListError = null;
            })
            .addCase(getCouponList.rejected, (state, { payload }) => {
                state.couponListLoading = false;
                state.couponListError = payload?.message || payload || 'Failed to fetch coupon list.';
            })

            // Get Coupon by Code
            .addCase(getCouponByCode.pending, (state) => {
                state.couponDetailLoading = true;
                state.couponDetailError = null;
            })
            .addCase(getCouponByCode.fulfilled, (state, { payload }) => {
                state.couponDetailLoading = false;
                state.couponDetailData = payload?.data || payload;
                state.couponDetailError = null;
            })
            .addCase(getCouponByCode.rejected, (state, { payload }) => {
                state.couponDetailLoading = false;
                state.couponDetailError = payload?.message || payload || 'Failed to fetch coupon details.';
            })

            // Toggle Coupon Status — optimistic update in list
            .addCase(toggleCouponStatus.pending, (state) => {
                state.toggleStatusLoading = true;
                state.toggleStatusError = null;
            })
            .addCase(toggleCouponStatus.fulfilled, (state, { payload }) => {
                state.toggleStatusLoading = false;
                // Optimistically update the list so UI reflects immediately
                const updateInArray = (arr) => {
                    const idx = arr.findIndex(c => c.code === payload.code);
                    if (idx !== -1) arr[idx] = { ...arr[idx], isActive: payload.isActive };
                };
                if (Array.isArray(state.couponListData)) {
                    updateInArray(state.couponListData);
                } else if (Array.isArray(state.couponListData?.data)) {
                    updateInArray(state.couponListData.data);
                } else if (Array.isArray(state.couponListData?.coupons)) {
                    updateInArray(state.couponListData.coupons);
                }
            })
            .addCase(toggleCouponStatus.rejected, (state, { payload }) => {
                state.toggleStatusLoading = false;
                state.toggleStatusError = payload || 'Status update failed.';
            })
    }
})

export const { resetCreateCoupon, resetCouponDetail } = NewCouponSlice.actions;
export default NewCouponSlice.reducer;