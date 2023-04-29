
import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, createTheme } from "@mui/material";
import Header from "./Header";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";




function App() {

  //const {setBasket} = useStoreContext();
  const dispatch = useAppDispatch()
  const [loading, setLoading]= useState(true)

  useEffect(()=>{
     const buyerId =getCookie("buyerId")
     if(buyerId){
      agent.Basket.get()
      .then(basket => dispatch(setBasket(basket)))
      .catch(error => console.log(error))
      .finally(()=>setLoading(false))
     }
     else{
      setLoading(false)
     }
  },[dispatch])

  const [darkMode, setDarkMode] = useState(false)
  const paletteType = darkMode? 'dark' : 'light'

  const theme = createTheme({
    palette:{
      mode: paletteType, 
      background:{
        default: paletteType === 'light'? '#eaeaea' : '#333333'
      }
    }
  })
  
  function handleThemeChange(){
    setDarkMode(!darkMode)
  }

  if(loading) return <LoadingComponent message="initialising app..."/>

  return (
    <>
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar />
    <CssBaseline/>
    <Header darkMode={darkMode}  handleThemeChange={handleThemeChange} />
 
    <Container>
      <Routes>
        <Route path="/" Component={HomePage}/>
        <Route path="/catalog" Component={Catalog}/>
        <Route path="/catalog/:id" Component={ProductDetails}/>
        <Route path="/about" Component={AboutPage}/>
        <Route path="/contact" Component={ContactPage}/>
        <Route path="/about/ServerError" Component={ServerError}/>
        <Route path="/basket" Component={BasketPage}/>
        <Route path="/checkout" Component={CheckoutPage}/>
        <Route path="*" Component={NotFound}/>
        
      </Routes>
     
    </Container> 
    </ThemeProvider>
   
    </>
    
  )
}

export default App;