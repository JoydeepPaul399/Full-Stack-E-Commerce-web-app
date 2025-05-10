import { createSlice } from "@reduxjs/toolkit";

const initialValue= {
    allCategory: [],
    loadingCategory: false,
    subCategory: [],
    product: []
}

const productSlice = createSlice({
    name: "product",
    initialState: initialValue,
    reducers: {
        setAllCategory: (state, action)=>{
            state.allCategory= [...action.payload]
        },

        setLoadingCategory: (state, action)=>{
            state.loadingCategory= action.payload
        },

        setSubCategory: (state, action)=>{
            
            state.subCategory= [...action.payload]
            // console.log("This is ", state.subCategory)
        }
    }
})

export const {setAllCategory, setSubCategory, setLoadingCategory} = productSlice.actions
export default productSlice.reducer