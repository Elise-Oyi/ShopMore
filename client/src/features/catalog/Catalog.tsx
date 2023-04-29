//import {  } from "@mui/icons-material";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchedProductsAsync, productSelectors } from "./catalogSlice";



export default function Catalog(){

    //const [products,setProducts] = useState<Product[]>([])
    //setting loading state
    const products = useAppSelector(productSelectors.selectAll)
    const {productsLoaded,status} =useAppSelector(state=>state.catalog)
    const dispatch = useAppDispatch()

  useEffect(()=>{
     if(!productsLoaded) dispatch(fetchedProductsAsync())
  },[productsLoaded,dispatch])

  if(status.includes('pending')) return <LoadingComponent message="Loading products..."/>

    return(
    <>
        <h1>Catalog</h1>

        <ProductList products = {products}/>
  
    </>
    )
}