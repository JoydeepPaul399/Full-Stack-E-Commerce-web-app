// context api
import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { handleAddItemCart } from "../store/cartProduct";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import calculateDiscount from "../utils/CalculateDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext= createContext(null)

export const useGlobalContext= ()=>useContext(GlobalContext)

const GlobalProvider= ({children})=>{
    const dispatch= useDispatch()
    const [totalPrice, setTotalPrice]= useState(0)
    const [totalQty, setTotalQty]= useState(0)
    const cartItem= useSelector(state=>state.cartItem.cart)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice]= useState(0)
    const user= useSelector(state=>state?.user)

    const fetchCartItem= async ()=>{
    try {
      const response= await Axios({
        ...SummaryApi.getCartItem
      })

      const {data: responseData}= response

      if(responseData.success){
        // console.log("Cart items are", responseData)
        dispatch(handleAddItemCart(responseData.data))
      }


    } catch (error) {
      console.log(error)
    }
  }

  const updateCartItem= async (id, qty, )=>{
    try {
      const response= await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: id,
          qty: qty          
        }
      })

      const {data: responseData}= response

      if(responseData.success){
        // toast.success(responseData.message)
        fetchCartItem()
        return responseData
      }
    } catch (error) {
      // AxiosToastError(error)
      return error
    }
  }

  const deleteCartItem= async (cartId)=>{
    try {
      const response= await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId
        }
      })

      const {data : responseData}= response

      if(responseData.success){
        toast.success(responseData.message)
        fetchCartItem()
      }


    } catch (error) {
      AxiosToastError(error)
    }
  }

  const fetchOrder= async ()=>{
    try {
      const response= await Axios({
        ...SummaryApi.getOrderItems
      })

      const {data: responseData}= response

      if(responseData.success){
        dispatch(setOrder(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchCartItem()
  }, [])

  useEffect(()=>{
          // console.log("cartitme is ", cartItem)
          const qty= cartItem.reduce((prev, curr)=>{
              return prev+curr.quantity
          }, 0)
          setTotalQty(qty)
          // console.log(qty)
          
          // After including discount
          const tPrice= cartItem.reduce((prev, curr)=>{
            // curr.productId.price
            // console.log("discoutn is ", curr)
              return prev+ (calculateDiscount(curr?.productId?.price, curr?.productId?.discount)* curr?.quantity)
          }, 0)
          setTotalPrice(tPrice)
          // console.log(tPrice)

          // After deducting discount
          const PriceExcludedDiscount= cartItem.reduce((prev, curr)=>{
              return prev+ (curr?.productId?.price* curr?.quantity)
          }, 0)

          setNotDiscountTotalPrice(PriceExcludedDiscount)

      }, [cartItem])

  useEffect(()=>{
    fetchCartItem()
  }, [user])

  const handleLogout= ()=>{
    localStorage.clear()
    dispatch(handleAddItemCart([]))
  }

  useEffect(()=>{
    fetchCartItem()
    handleLogout()
    fetchAddress()
    fetchOrder()
  }, [user])

  const fetchAddress= async ()=>{
    try {
      const response= await Axios({
        ...SummaryApi.getAddress
      })

      const {data: responseData}= response

      if(responseData.success){
        dispatch(handleAddAddress(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchAddress,
            fetchOrder

        }} >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider