import { MetaData } from './../../app/models/pagination';
import { ProductParams } from './../../app/models/product';
import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

//interface for catalog state
interface CatalogState{
    productsLoaded: boolean
    filtersLoaded: boolean
    status: string
    brands: string[]
    types: string[]
    productParams: ProductParams
    metaData: MetaData | null
}

const productsAdapter = createEntityAdapter<Product>()


function getAxiosParams(productParams:ProductParams){
    const params = new URLSearchParams()
    params.append('pageNumber', productParams.pageNumber.toString())
    params.append('pageSize', productParams.pageSize.toString())
    params.append('orderBy', productParams.orderBy)

    if(productParams.searchTerm) params.append('searchTerm', productParams.searchTerm)
    if(productParams.brands.length > 0) params.append('brands',productParams.brands.toString())
    if(productParams.types.length > 0) params.append('types',productParams.types.toString())

    return params
}

//---to fetch all products
export const fetchedProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchedProductsAsync',
    async (_,thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        try {
           const response = await agent.Catalog.list(params) 
           thunkAPI.dispatch(setMetaData(response.metaData))
           return response.items
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

//---to fetch filters
export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async(_,thunkAPI)=>{
        try {
           return agent.Catalog.fetchFilters()
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

 function initParams(){
    return{
        pageNumber:1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: []
    }
 }

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state,action)=>{
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload, pageNumber:1}
        },
        setPageNumber: (state,action)=>{
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload}
        },
        setMetaData:(state,action)=>{
            state.metaData = action.payload
        },
        resetProductParams: (state)=>{
            state.productParams = initParams()
        }

    },
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
            console.log(action.payload);
        })

        //---cases for filters
        builder.addCase(fetchFilters.pending,(state)=>{
             state.status = 'pendingFetchFilters'
        })
        builder.addCase(fetchFilters.fulfilled,(state,action)=>{
            state.brands = action.payload.brands
            state.types = action.payload.types
            state.filtersLoaded = true
            state.status = 'idle'
        })
        builder.addCase(fetchFilters.rejected,(state,action)=>{
            state.status = 'idle'
            console.log(action.payload)
        })
    }) 
})

export const productSelectors = productsAdapter.getSelectors((state: RootState)=>state.catalog)

export const {setProductParams, resetProductParams,setMetaData, setPageNumber} = catalogSlice.actions 