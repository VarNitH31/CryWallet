import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value:[],
}

export const solSlice=createSlice({
    name:"sol",
    initialState:initialState,
    reducers:{
        addSol:(state,action)=>{

            state.value.push(action.payload);
        },

        removeSol:(state,action)=>{
            const index=state.value.findIndex(wallet=> wallet==action.payload)
            state.value.splice(index,1);

        }

    }

})

export const { removeSol,addSol } = solSlice.actions

export default solSlice.reducer