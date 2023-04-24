import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia,  ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../app/context/StoreContext";

interface Props{
    product : Product
}

export default function ProductCard({product}:Props){
    const [loading, setLoading]= useState(false)
    const {setBasket} = useStoreContext()

    function handleAddItem(productId:number){
        setLoading(true)
         
        agent.Basket.addItem(productId)
        .then(basket=>setBasket(basket))
        .catch(error => console.log(error))
        .finally(()=> setLoading(false))
    }
    return(
        <>
        
    <Card>
        <CardHeader
            avatar={
            <Avatar sx={{backgroundColor:'secondary.main'}}>
                {product.name.charAt(0).toLocaleUpperCase()}
            </Avatar>}
            title={product.name}
            titleTypographyProps={{
                sx:{fontWeight:'bold', color:'primary.main'}
            }}
        />
        <CardMedia
            sx={{ height: 140, backgroundSize:'contain', backgroundColor:'primary.light'}}
            image={product.pictureUrl}
            title={product.name}
        />
        <CardContent>
            <Typography gutterBottom color='secondary' variant="h5" component="div">
            ${(product.price/100).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
            </Typography>
        </CardContent>
        <CardActions>
            <LoadingButton loading={loading} size="small" onClick={()=>handleAddItem(product.id)}>add to cart</LoadingButton>
            
            <Button component={Link} to={`/catalog/${product.id}`} size="small" >view</Button>
        </CardActions>
    </Card>
           
              
        </>
    )
}