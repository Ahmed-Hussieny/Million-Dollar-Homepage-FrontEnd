import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LogoEntry, LogosData } from "../interfaces";

export const getLogos = createAsyncThunk<LogosData>("Logos/getLogos", async () => {
    const { data } = await axios.get(`http://localhost:3000/logo/getLogos`);
    return data;
});

export const addLogo = createAsyncThunk<LogoEntry ,{apiData: FormData}>("Logos/addLogo", async ({apiData}) => {
    try{
        const { data } = await axios.post(`http://localhost:3000/logo/addLogo`, apiData ,{
            headers:{
                "Content-Type": "multipart/form-data",
            }
        });
        console.log(data);
        return data;
    }
    catch(error){
        console.log(error);
        return error;
    }
});
export const addUnPaindLogo = createAsyncThunk<LogoEntry ,{apiData: FormData}>("Logos/addUnPaindLogo", async ({apiData}) => {
    try{
        const { data } = await axios.post(`http://localhost:3000/logo/addUnpaidLogo`, apiData ,{
            headers:{
                "Content-Type": "multipart/form-data",
                accesstoken: localStorage.getItem('token')
            }
        });
        console.log(data);
        return data;
    }
    catch(error){
        console.log(error);
    }
});

export const updateLogo = createAsyncThunk<LogoEntry, { id: string; apiData: FormData }>("Logos/updateLogo", async ({ id, apiData }) => {
    try {
        const { data } = await axios.put(`http://localhost:3000/logo/updateLogo/${id}`, apiData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                accesstoken: localStorage.getItem('token')
            }
        });
        return data;
    }
    catch (error) {
        console.log(error);
    }
});

export const deleteLogo = createAsyncThunk<LogoEntry, { id: string;}>("Logos/deleteLogo", async ({ id }) => {
    try {
        const { data } = await axios.delete(`http://localhost:3000/logo/deleteLogo/${id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                accesstoken: localStorage.getItem('token')
            }
        });
        return data;
    }
    catch (error) {
        console.log(error);
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
            console.log(action.payload, "------");
            state.numberOfPixelsUsed = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getLogos.fulfilled, (state, { payload }) => {
            state.Logos = payload.logos;
            state.numberOfPixelsUsed = (state.Logos.map((entry: LogoEntry) => entry.pixels.length).reduce((a, b) => a + b, 0)) * 10;
        });
        builder.addCase(getLogos.rejected, (state) => {
            state.Logos = [];
        });
        builder.addCase(addLogo.fulfilled, (state, { payload }) => {
            state.Logos.push(payload);
        });
        builder.addCase(addLogo.rejected, (state) => {
            state.Logos = [];
        }
        );
        builder.addCase(addUnPaindLogo.fulfilled, (state, { payload }) => {
            state.Logos.push(payload);
        });
        builder.addCase(addUnPaindLogo.rejected, (state) => {
            state.Logos = [];
        }
        );
        builder.addCase(updateLogo.fulfilled, (state, { payload }) => {
            console.log(payload)
            state.Logos.push(payload);
        });
        builder.addCase(updateLogo.rejected, (state) => {
            state.Logos = [];
        });
    }
})

export default LogoSlice.reducer;
export const { changePixelNumber } = LogoSlice.actions;