import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia,  ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import ProductDetails from "./ProductDetails";

interface Props{
    product : Product
}

export default function ProductCard({product}:Props){
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
            <Button size="small">add to cart</Button>
            <Button component={Link} to={`/catalog/${product.id}`} size="small" >view</Button>
        </CardActions>
    </Card>
           
              
           {/* <ListItem key={product.id}>
                    <ListItemAvatar>
                      <Avatar>src={product.pictureUrl}</Avatar> 
                    </ListItemAvatar>
                   <ListItemText>
                    {product.name} -{product.price} 
                   </ListItemText>
                </ListItem>    
         */}
        </>
    )
}