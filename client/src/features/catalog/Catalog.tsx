//import {  } from "@mui/icons-material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";



export default function Catalog(){

    const [products,setProducts] = useState<Product[]>([])

  useEffect(()=>{
    fetch('https://localhost:44379/api/products')
    .then(response => response.json())
    .then(data => setProducts(data))
  },[])

    return(
    <>
        <h1>Catalog</h1>

        <ProductList products = {products}/>
  
    </>
    )
}