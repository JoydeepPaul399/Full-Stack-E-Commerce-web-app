import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";


const AddToCartButton = ({data}) => {
    const [loading, setLoading]= useState(false)
    // fetching cart and update cart will be done the context api
    const {fetchCartItem, updateCartItem, deleteCartItem}= useGlobalContext()
    const cartItem= useSelector(state=>state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart]= useState(false)
    const [qty, setQty]= useState(1)
    const [cartItemDetails, setCartItemDetails]= useState()

    // console.log("Add to cart button", cartItem)
    // console.log("data is ", data)

    const handleAddToCart= async (e)=>{
        try {
            e.preventDefault()
            e.stopPropagation()
            setLoading(true)

            const response= await Axios({
                ...SummaryApi.addToCart,
                data: {
                    productId: data?._id
                }
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                if(fetchCartItem){
                    fetchCartItem()
                }
            }

        } catch (error) {
            // console.log(error?.response?.data?.message)
            toast.error(error?.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }

    // function to check whether this item is added in the cart or not 
    useEffect(()=>{
        // const checkItem= cartItem.some(item=> item._id == data._id)
        const checkItem = cartItem.some(item => String(item.productId._id) === String(data._id))
        // console.log("checkItem is", checkItem)
        // setting true or false based on items availability in the user's cart 
        setIsAvailableCart(checkItem)

        // finding the quantify of current product
        const product= cartItem.find(item=>item.productId._id===data._id)
        setQty(product?.quantity)
        setCartItemDetails(product)
    }, [data,cartItem])


    const increaseQty= async (e)=>{
        e.preventDefault()
        e.stopPropagation()
        // console.log("product is ", cartItemDetails)
        // console.log("data is ", data)

        // const productAvailability= cartItemDetails.productId.stock;
        // if(productAvailability<qty+1){
        //     // console.log("Something wrong")
        //     toast.error("Stock is not available")
        //     return
        // }
        // const productId= cartItemDetails.productId._id

        const response= await updateCartItem(cartItemDetails?._id, qty+1)
        if(response.success){
            toast.success("Item added")
        }
    }

    const decreaseQty= async (e)=>{
        e.preventDefault()
        e.stopPropagation()

        if(qty===1){
            deleteCartItem(cartItemDetails?._id)
        }
        else{
            const response = await updateCartItem(cartItemDetails?._id, qty-1)
            if(response.success){
            toast.success("Item removed")
        }
        }
    }


  return (
    <div className='w-full max-w-[150px]'>
        {
            // if item is available in the cart then use can update the number. Add button will not be showed. 
            isAvailableCart ? (
                <div className='flex w-full h-full '>
                    <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex justify-center items-center'><FaMinus/></button>
                    <p className='flex-1 w-full font-semibold px-1 text-center'>{qty}</p>
                    <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex justify-center items-center'><FaPlus/></button>
                </div>
            ) : (
                <button onClick={handleAddToCart} className='bg-green-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-green-700'>
            { loading ? (
                // laoding spinner 
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>

            ) : "Add"} 
        </button>
            )
        }
        
    </div>
  )
}

export default AddToCartButton
