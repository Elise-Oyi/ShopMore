import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>()


//---to fetch all products
export const fetchedProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchedProductsAsync',
    async (_,thunkAPI) => {
        try {
           return await agent.Catalog.list() 
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)

//---to fetch individual products
export const fetchedProductAsync = createAsyncThunk<Product,number>(
    'catalog/fetchedProductAsync',
    async (productId,thunkAPI) =>{
        try {
            return await agent.Catalog.details(productId)
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder =>{
        
        //---cases for all products
        builder.addCase(fetchedProductsAsync.pending, (state)=>{
            state.status = 'pendingFetchedProducts'
        })
        builder.addCase(fetchedProductsAsync.fulfilled,(state,action) =>{
            productsAdapter.setAll(state, action.payload)
            state.status ='idle'
            state.productsLoaded = true
        })
        builder.addCase(fetchedProductsAsync.rejected,(state,action)=>{
            state.status = 'idle'
            console.log(action.payload);
        })

        //---cases for individual products
        builder.addCase(fetchedProductAsync.pending,(state)=>{
            state.status = 'pendingFetchedProduct'
        })
        builder.addCase(fetchedProductAsync.fulfilled,(state,action)=>{
            productsAdapter.upsertOne(state,action.payload)
            state.status = 'idle'
            //state.productsLoaded = true
        })
        builder.addCase(fetchedProductAsync.rejected,(state,action)=>{
            state.status = 'idle'
            console.log(action);
        })
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState)=>state.catalog)