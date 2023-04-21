
import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, createTheme } from "@mui/material";
import Header from "./Header";
import { ThemeProvider } from "@emotion/react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";




function App() {
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
        <Route path="*" Component={NotFound}/>
      </Routes>
     
    </Container> 
    </ThemeProvider>
   
    </>
    
  )
}

export default App;