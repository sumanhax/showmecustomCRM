import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../store/Api';
import errorHandler from '../store/ErrorHandler';

// Template List
export const fetchTemplateList = createAsyncThunk(
  'editor/template-list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/template/demo-template-list');
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
// Load Editor
export const loadEditor = createAsyncThunk(
  'editor/load-editor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/list-template/${4}`);
      // console.log('response', response);
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
// Save Editor
export const saveEditor = createAsyncThunk(
  'editor/save-editor',
  async (data, { rejectWithValue }) => {
    try {
      console.log("Data: ", data);

      const response = await api.post(`/product/save-template/${4}`, {
        data: data,
      });
      if (response?.data?.status_code === 200) {
        return response?.data?.data;
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
export const couponCheck = createAsyncThunk(
  'coupon-pricing',
  async (userInput, { rejectWithValue }) => {
    console.log('userInput', userInput);
    try {
      const response = await api.post('/coupon/coupon-validation', userInput);
      // console.log('response', response);
      if (response?.data?.status_code === 200) {
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
);

// Fetch Payement Methods to diplay in editor
export const fetchPaymentMethods = createAsyncThunk(
  'payment-methods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/get-payment-providers');
      console.log('response', response);
      if (response?.data?.status_code === 200) {
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
);

// Save HTML, CSS and JS
export const saveHtmlCssJs = createAsyncThunk(
  'save-html-css-js',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/template/create-checkout-html-css-js-template',
        data
      );
      if (response?.data?.status_code === 200) {
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
);

// Fetch HTML, CSS and JS
export const fetchHtmlCssJs = createAsyncThunk(
  'fetch-html-css-js',
  async (proId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/template/get-checkout-html-css-js-template/${proId}`
      );
      console.log('response', response);
      if (response?.data?.status_code === 200) {
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
);



export const createOrder = createAsyncThunk(
  'createOrder',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post(`/order/product-order`, userInput);
      if (response?.status_code === 200) {
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
  templateList: [],
  paymentProviders: [],
  htmlData: [],
};

// Reducer
const EditorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplateList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.templateList = [];
      })
      .addCase(fetchTemplateList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.templateList = payload.data;
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(fetchTemplateList.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.templateList = [];
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(loadEditor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.htmlData = [];
      })
      .addCase(loadEditor.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
        state.htmlData = payload;
        console.log("payload: ", payload);

      })
      .addCase(loadEditor.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
        state.htmlData = [];
      })
      .addCase(saveEditor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(saveEditor.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(saveEditor.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(couponCheck.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(couponCheck.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(couponCheck.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.paymentProviders = payload.paymentProviderTypes;
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(fetchPaymentMethods.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(saveHtmlCssJs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(saveHtmlCssJs.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(saveHtmlCssJs.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(fetchHtmlCssJs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchHtmlCssJs.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        console.log('HTML payload', payload);
        state.message = state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      })
      .addCase(fetchHtmlCssJs.rejected, (state, payload) => {
        state.loading = false;
        state.error = true;
        state.message =
          payload !== undefined && payload.message
            ? payload.message
            : 'Something went wrong. Try again later.';
      }).addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.loading = false
        state.message = payload
        state.error = false
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
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
export const { message, error, isLoading } = EditorSlice.actions;

export default EditorSlice.reducer;
