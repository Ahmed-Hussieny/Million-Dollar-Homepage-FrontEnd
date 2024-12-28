import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: "global",
    initialState:{
        loading: true,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export default globalSlice.reducer;
export const { setLoading } = globalSlice.actions;