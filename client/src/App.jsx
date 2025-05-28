import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import fetchUserDetails from './utils/fetchUserDetails'
import { setUserDetails } from './store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setAllCategory, setSubCategory, setLoadingCategory } from './store/productSlice'
import Axios from './utils/Axios'
import SummaryApi from './common/SummaryApi'
import {handleAddItemCart} from './store/cartProduct'
import GlobalProvider from './provider/GlobalProvider'
import { FaCartPlus } from "react-icons/fa";
import CartMobileLink from './components/CartMobileLink'



function App() {
  const dispatch= useDispatch()
  const location= useLocation()



  const fetchData= async ()=>{
    const userData= await fetchUserDetails()
    // console.log(userData.data)
    dispatch(setUserDetails(userData.data))
    
  }

  const fetchCategory= async ()=>{
      try {
        dispatch(setLoadingCategory(true))
        const response= await Axios({
          ...SummaryApi.getCategory
        })
  
        const {data: responseData}= response
        // console.log(responseData)
  
        if(responseData.success){
          // setCategoryData(responseData.data)
          dispatch(setAllCategory(responseData.data))
          
        }
        // console.log("Category data to be displayed ",categoryData)
  
        
      } 
      catch (error) {
        
      }
      finally{
        dispatch(setLoadingCategory(false))
      }
    }

  const fetchSubCategory= async ()=>{
    const response= await Axios({
      ...SummaryApi.getSubCategory
    })

    dispatch(setSubCategory(response.data.data))
    // console.log(response.data.data)
  }

    useEffect(()=>{
      fetchCategory()
      fetchData()
      fetchSubCategory()
    }, [])

  return (
    <GlobalProvider>
    <Header/>
      <main className='min-h-[78vh]'>
        
        {/* Outlet: This is a component from react-router-dom. It acts as a placeholder where nested routes (defined using children in your router) will render. If you have child routes in your routing configuration, the Outlet will be where those child routes are displayed. */}
        <Outlet/>
      </main>
      <Footer/>
      <Toaster/>
      {
        location.pathname!=="/checkout" && (

          <CartMobileLink/>
        )
      }
    </GlobalProvider>
  )
}

export default App
