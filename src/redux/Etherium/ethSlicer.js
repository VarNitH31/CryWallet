import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value:[],
}

export const ethSlice=createSlice({
    name:"eth",
    initialState:initialState,
    reducers:{
        addEth:(state,action)=>{
            state.value.push(action.payload);
        },

        removeEth:(state,action)=>{
            const index=state.value.findIndex(wallet=> wallet==action.payload)
            state.value.splice(index,1);

        }

    }

})

export const { removeEth,addEth } = ethSlice.actions

export default ethSlice.reducer