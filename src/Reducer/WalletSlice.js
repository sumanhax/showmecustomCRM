import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";
import errorHandler from "../store/ErrorHandler";

export const getWallet = createAsyncThunk(
    'getWallet',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/user/wallet`, user_input);
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

export const walletFriz = createAsyncThunk(
    'walletFriz',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/user/wallet-freeze`, user_input);
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
export const lisingOfVideo = createAsyncThunk(
    'lisingOfVideo',
    async ({ entity, limit, page, user_id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/user/user-video-list/${entity}/${limit}/${page}/${user_id}`, { entity, limit, page, user_id });
            if (response?.data?.status_code === 200) {
                return response.data;


            } else {
                return rejectWithValue(response?.data?.response);

            }
        } catch (err) {
            let errors = errorHandler(err?.response?.data);
            return rejectWithValue(errors);
        }

    }
)

export const lisingOfAudio = createAsyncThunk(
    'lisingOfAudio',
    async ({ entity, limit, page, user_id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/user/user-video-list/${entity}/${limit}/${page}/${user_id}`, { entity, limit, page, user_id });
            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                return rejectWithValue(response?.data?.response);

            }
        } catch (err) {
            let errors = errorHandler(err?.response?.data);
            return rejectWithValue(errors);
        }

    }
)


export const getTransaction = createAsyncThunk(
    'getTransaction',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/user/transaction`, user_input);
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

export const giveCredits = createAsyncThunk(
    'giveCredits',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/user/give-credit`, user_input);
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
    error: false,
    wallet: [],
    walletFrizData: "",
    listOfVideo: [],
    listOfAudio: [],
    transactionHistoryData: [],
    give_creditsData: ""
}
const WalletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getWallet.pending, (state) => {
            state.loading = true
        })
            .addCase(getWallet.fulfilled, (state, { payload }) => {
                state.loading = false
                state.wallet = payload
                state.error = false
            })
            .addCase(getWallet.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(walletFriz.pending, (state) => {
                state.loading = true
            })
            .addCase(walletFriz.fulfilled, (state, { payload }) => {
                state.loading = false
                state.walletFrizData = payload
                state.error = false
            })
            .addCase(walletFriz.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(lisingOfVideo.pending, (state) => {
                state.loading = true
            })
            .addCase(lisingOfVideo.fulfilled, (state, { payload }) => {
                state.loading = false
                state.listOfVideo = payload
                state.error = false
            })
            .addCase(lisingOfVideo.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(lisingOfAudio.pending, (state) => {
                state.loading = true
            })
            .addCase(lisingOfAudio.fulfilled, (state, { payload }) => {
                state.loading = false
                state.listOfAudio = payload


                state.error = false
            })
            .addCase(lisingOfAudio.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
            .addCase(getTransaction.pending, (state) => {
                state.loading = true
            })
            .addCase(getTransaction.fulfilled, (state, { payload }) => {
                state.loading = false
                state.transactionHistoryData = payload
                state.error = false
            })
            .addCase(getTransaction.rejected, (state, { paylaod }) => {
                state.loading = false
                state.error = paylaod

            })
            .addCase(giveCredits.pending, (state) => {
                state.loading = true
            })
            .addCase(giveCredits.fulfilled, (state, { payload }) => {
                state.loading = false
                state.give_creditsData = payload
                state.error = false
            })
            .addCase(giveCredits.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
    }
})
export default WalletSlice.reducer