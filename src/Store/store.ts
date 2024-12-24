import { configureStore } from "@reduxjs/toolkit";
import LogoSlice from "./LogosSlices";
import { useDispatch } from "react-redux";
export const Config = configureStore({
    reducer: {
        LogoData: LogoSlice,
    },
});

export type AppDispatch = typeof Config.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();