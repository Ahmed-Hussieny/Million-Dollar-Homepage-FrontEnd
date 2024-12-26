import { configureStore } from "@reduxjs/toolkit";
import LogoSlice from "./LogosSlices";
import AuthSlice from "./authSlice";
import { useDispatch } from "react-redux";
export const Config = configureStore({
    reducer: {
        LogoData: LogoSlice,
        AuthData : AuthSlice
    },
});

export type AppDispatch = typeof Config.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();