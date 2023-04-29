import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchedProductAsync, productSelectors } from "./catalogSlice";

//--adding a delay to the app(for simulation)
const sleep = () => new Promise(resolve => setTimeout(resolve,500))

export default function ProductDetails(){

  //---getting the basket from redux store
  const {basket,status} = useAppSelector(state=>state.basket)

  // //---getting the catalog from redux store
  const {status:productStatus} = useAppSelector(state=>state.catalog)

  //---getting the unction from redux basketSlice
  const dispatch = useAppDispatch()
  const {id} = useParams<{id:string}>();
  const product = useAppSelector(state=>productSelectors.selectById(state, id!))
  const [quantity, setQuantity] = useState(0)
  const item = basket?.items.find(i => i.productId === product?.id)

  const url = `https://localhost:44379/api/products/${id}`
  useEffect(()=>{
    if(item) setQuantity(item.quantity)
    // axios.get(url)
    // .then(async response =>{ await sleep(); setProduct(response.data)})
    // .catch(error => console.log(error.response))
    // .finally(() => setLoading(false)) 
     
    if(!product) dispatch(fetchedProductAsync(parseInt(id!)))
  },[id,item,dispatch,product])

  function handleInputChange(event:any){
    if(event.target.value >= 0){
    setQuantity(parseInt(event.target.value))
    }
  }

  function handleUpdateCart(){

    if(!item || quantity > item.quantity){
      const updatedQuantity = item ? quantity - item.quantity : quantity
      dispatch(addBasketItemAsync({productId:product?.id!,quantity:updatedQuantity}))
    }
    else{
      const updatedQuantity = item.quantity - quantity
     dispatch(removeBasketItemAsync({productId:product?.id!,quantity:updatedQuantity}))
    }
  }

  if(productStatus.includes('pending')) return <LoadingComponent message="Loading product..."/>

  if(!product) return <NotFound/>

    return(
        <>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <img src={product.pictureUrl} alt={product.name} style={{width:'100%'}} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{product.name}</Typography>
              <Divider sx={{mb:2}} />
              <Typography variant="h5" color='secondary' >${(product.price/100).toFixed(2)}</Typography>

              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>{product.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Brand</TableCell>
                      <TableCell>{product.brand}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quantity in stock</TableCell>
                      <TableCell>{product.quantityInStock}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                  onChange={handleInputChange}
                    variant="outlined"
                    type="number"
                    label='Quantity in Cart'
                    fullWidth
                    value={quantity}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LoadingButton
                    disabled={item?.quantity === quantity || !item && quantity === 0}
                    loading={status.includes('pending')}
                    onClick={handleUpdateCart}
                    sx={{height:'55px'}}
                    color="primary"
                    size='large'
                    variant="contained"
                    fullWidth
                  >
                    {item?'update Quantity' : 'Add to cart'}
                  </LoadingButton>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </>
    )
}