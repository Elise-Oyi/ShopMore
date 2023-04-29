import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/util/util";
import { useAppSelector } from "../../app/store/configureStore";

// interface Props{
//     subtotal:number{subtotal}:Props)
// }

export default function BasketSummary(){


    const {basket} = useAppSelector(state=>state.basket)

    const subtotal =basket?.items.reduce((sum,item)=> sum + (item.price*item.quantity),0) ?? 0

    const deliveryFee = subtotal > 20000 ? 0 : 500

    return(
        <>
        <TableContainer component={Paper} variant={'outlined'}>
      <Table>
        <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{currencyFormat(subtotal) }</TableCell>
            </TableRow> 
            <TableRow>   
              <TableCell colSpan={2}>Deliver fee*</TableCell>
              <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
            </TableRow>  
            <TableRow> 
               <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
            </TableRow> 
              
            <TableRow> 
                <TableCell >Delivery above $100 is free*</TableCell>
            </TableRow> 
              

             
        </TableBody>
      </Table>
    </TableContainer>
        </>
    )
}