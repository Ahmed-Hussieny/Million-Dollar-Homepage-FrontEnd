import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LogoEntry, LogosData } from "../interfaces";

export const getLogos = createAsyncThunk<LogosData>("Logos/getLogos", async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/pixel/getPixels`,{
        headers: {
            "ngrok-skip-browser-warning": "true",
        }
    });
    
    return data;
});
// getPixels
export const getPixels = createAsyncThunk("Logos/getPixels", async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/pixel/getPixels`,{
        headers: {
            "ngrok-skip-browser-warning": "true",
        }
    });
    return data;
});

export const addPixel = createAsyncThunk<LogoEntry, { apiData: FormData }>("Logos/addPixel", async ({ apiData }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/pixel/addPixel`, apiData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "ngrok-skip-browser-warning": "true",
            }
        });
        console.log(data)
        return data;
    }
    catch (error) {
        return error;
    }
});

export const addPixelWithoutPayment = createAsyncThunk<LogoEntry, { apiData: FormData }>("Logos/addPixelWithoutPayment", async ({ apiData }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/pixel/addPixelWithoutPayment`, apiData, {
            headers: {
                "Content-Type": "multipart/form-data",
                accesstoken: localStorage.getItem('token'),
                "ngrok-skip-browser-warning": "true",
            }
        });
        return data;
    }
    catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data || error.message);
        } else {
            return rejectWithValue(error);
        }
    }
});

export const updateLogo = createAsyncThunk<LogoEntry, { url: string; apiData: FormData }>("Logos/updateLogo", async ({ url, apiData }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_SERVER_LINK}/pixel/updatePixel?url=${url}`, apiData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                accesstoken: localStorage.getItem('token'),
                "ngrok-skip-browser-warning": "true",
            }
        });
        return data;
    }
    catch (error) {
        return error;
    }
});

export const deleteLogo = createAsyncThunk<LogoEntry, { id: string; }>("Logos/deleteLogo", async ({ id }) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_SERVER_LINK}/logo/deleteLogo/${id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                accesstoken: localStorage.getItem('token'),
                "ngrok-skip-browser-warning": "true",
            }
        });
        return data;
    }
    catch (error) {
        return error;
    }
});

const initialState: {
    Logos: LogoEntry[];
    numberOfPixelsUsed: number
} = {
    Logos: [],
    numberOfPixelsUsed: 0
};
const LogoSlice = createSlice({
    name: "Logos",
    initialState,
    reducers: {
        changePixelNumber: (state, action) => {
            state.numberOfPixelsUsed = action.payload
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getLogos.fulfilled, (state, { payload }) => {
            state.Logos = payload.logos;
            state.numberOfPixelsUsed = payload.numberOfPixelsUsed;
        });
        builder.addCase(getLogos.rejected, (state) => {
            state.Logos = [];
        });

        builder.addCase(addPixel.fulfilled, () => {
        });
        builder.addCase(addPixel.rejected, (state) => {
            state.Logos = [];
        });

        builder.addCase(addPixelWithoutPayment.fulfilled, () => {
        });
        builder.addCase(addPixelWithoutPayment.rejected, (state) => {
            state.Logos = [];
        });
        
        builder.addCase(updateLogo.fulfilled, () => {
        });
        builder.addCase(updateLogo.rejected, (state) => {
            state.Logos = [];
        });

        builder.addCase(getPixels.fulfilled, (state, { payload }) => {
            state.Logos.push(payload);
        });
        builder.addCase(getPixels.rejected, (state) => {
            state.Logos = [];
        });
    }
})

export default LogoSlice.reducer;
export const { changePixelNumber } = LogoSlice.actions;