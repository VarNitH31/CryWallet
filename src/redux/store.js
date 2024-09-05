import { configureStore } from "@reduxjs/toolkit";
import ethReducer from "./Etherium/ethSlicer";
import solREducer from "./Solana/solSlicer";
export const store = configureStore({


    reducer:{
        eth: ethReducer,
        sol: solREducer
    }

})