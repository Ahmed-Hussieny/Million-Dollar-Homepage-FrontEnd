import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LogoEntry, LogosData } from "../interfaces";

export const getLogos = createAsyncThunk<LogosData>("Logos/getLogos", async () => {
    // console.log(import.meta.env.VITE_BACK_END_HOST);
    const { data } = await axios.get(`http://localhost:3000/logo/getLogos`);
    return data;
});
export const addLogo = createAsyncThunk<LogoEntry>("Logos/addLogo", async (apiData) => {
    const { data } = await axios.post(`http://localhost:3000/logo/addLogo`, apiData);
    return data;
});
const initialState: {
    Logos: LogoEntry[];
    numberOfPixelsUsed :number
} = {
    Logos: [],
    numberOfPixelsUsed:0
};
const LogoSlice = createSlice({
    name: "Logos",
    initialState,
    reducers: {
        changePixelNumber: (state, action) => {
            console.log(action.payload,"------");
            state.numberOfPixelsUsed = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getLogos.fulfilled, (state, { payload }) => {
            state.Logos = payload.logos;
            state.numberOfPixelsUsed = (state.Logos.map((entry: LogoEntry) => entry.pixels.length).reduce((a, b) => a + b, 0))*10;
        });
        builder.addCase(getLogos.rejected, (state) => {
            state.Logos = [];
        });
        builder.addCase(addLogo.fulfilled, (state, { payload }) => {
            state.Logos.push(payload);
        });
    }
})

export default LogoSlice.reducer;
export const { changePixelNumber } = LogoSlice.actions;