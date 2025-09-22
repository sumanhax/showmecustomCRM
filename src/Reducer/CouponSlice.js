import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../store/Api';
import errorHandler from '../store/ErrorHandler';

// Fetch Coupons List
export const getCouponList = createAsyncThunk(
  'coupon/get-all-coupon',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post('coupon/get-all-coupons', userInput);
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
//create Coupons
export const createCoupon = createAsyncThunk(
  'coupon/create-coupon',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post('/coupon/create-coupon', userInput);
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

//get all Product for coupon
export const getAllCouponProduct = createAsyncThunk(
  'coupon/couponProduct',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post('/product/get-product-List-dropdown', userInput);
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

//get single coupon

export const getSingleCoupon = createAsyncThunk(
  'coupon/getSingleCoupon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post('/coupon/get-single-coupon', id);
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
//update coupon
export const updateCoupon = createAsyncThunk(
  'coupon/updateCoupon',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post('/coupon/edit-coupon', userInput);
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
//coupon active deactive
export const couponActiveDeactive = createAsyncThunk(
  'coupon/couponActiveDeactive',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post('/coupon/active-inactive-coupon', userInput);
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



//coupon Validation
export const couponValidate = createAsyncThunk(
  'coupon/validation',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post('/coupon/new-coupon-validation', userInput);
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
// Initial States
const initialState = {
  loading: false,
  error: null,
  message: null,
  couponList: [],
  productDropDownList: [],
  singleCoupon: {},
  active_inactive: {},
  validate:""
};

// Reducer
const CouponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCouponList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.couponList = [];
      })
      .addCase(getCouponList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
        state.couponList = payload;
      })
      .addCase(getCouponList.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
        state.couponList = [];
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true
      })
      .addCase(createCoupon.fulfilled, (state, { payload }) => {
        // console.log("Payload", payload);
        state.loading = false
        state.message = payload
        state.error = null
      })
      .addCase(createCoupon.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(getAllCouponProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllCouponProduct.fulfilled, (state, { payload }) => {
        state.loading = false
        state.productDropDownList = payload
        state.error = null
      })
      .addCase(getAllCouponProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(getSingleCoupon.pending, (state) => {
        state.loading = true
      })
      .addCase(getSingleCoupon.fulfilled, (state, { payload }) => {
        state.loading = false
        state.singleCoupon = payload
        state.error = false
      })
      .addCase(getSingleCoupon.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCoupon.fulfilled, (state, { payload }) => {
        state.loading = false
        state.message = payload
        state.error = false
      })
      .addCase(updateCoupon.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(couponActiveDeactive.pending, (state) => {
        state.loading = true
      })
      .addCase(couponActiveDeactive.fulfilled, (state, { payload }) => {
        state.loading = false
        state.active_inactive = payload
      })
      .addCase(couponActiveDeactive.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(couponValidate.pending,(state)=>{
        state.loading=true
      })
      .addCase(couponValidate.fulfilled,(state,{payload})=>{
        state.loading=false
        state.validate=payload
        state.error=false
      })
      .addCase(couponValidate.rejected,(state,{payload})=>{
         state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      ;
  },
});

export const { message, error, isLoading } = CouponSlice.actions;

export default CouponSlice.reducer;
