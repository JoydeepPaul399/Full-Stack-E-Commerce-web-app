import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckOutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty,fetchCartItem, fetchOrder } = useGlobalContext()
    const [openAddress, setOpenAddress]= useState(false)
    const addressList= useSelector(state=>state.addresses.addressList)
    const [selectedAddress, setSelectedAddress]= useState(0)
    const cartItemList= useSelector(state=>state.cartItem.cart)
    const navigate= useNavigate()



    // console.log("addressList", addressList)
    console.log("cartItemList is looks ", cartItemList)

    const handleCashOnDelivery= async ()=>{
        try {
            const response= await Axios({
                ...SummaryApi.CashOnDelivery,
                data: {
                    list_items: cartItemList,
                    totalAmt: totalPrice,
                    addressId:addressList[selectedAddress]._id,
                    subTotalAmt: totalPrice,
                    totalQty: totalQty
                }
            })

            const {data: responseData}= response

            if(responseData.success){
                toast.success(responseData.message)
                
                if(fetchCartItem){
                    fetchCartItem()
                    
                }
                if(fetchOrder){
                    fetchOrder()
                }
                navigate("/success", {
                    state: {
                        text:"Order"
                    }
                })
            }


        } catch (error) {
            AxiosToastError(error)
            navigate("/cancel")
        }
    }

    const handleOnlinePayment= async ()=>{
        try {
            toast.loading("Loading...")
            const stripePublicKey= import.meta.env.VITE_STRIPE_PUBLIC_KEY
            const stripePromise= await loadStripe(stripePublicKey) //This loads Stripe.js in your frontend using your public key.

            const response= await Axios({
                ...SummaryApi.payment_url,
                data: {
                    list_items: cartItemList,
                    totalAmt: totalPrice,
                    addressId:addressList[selectedAddress]._id,
                    subTotalAmt: totalPrice,
                    totalQty: totalQty
                }
            }) //Our backend will use this info to create a Checkout Session with Stripe.
            // A Checkout Session is a temporary payment session created by your backend to tell Stripe:
            // "I want to charge this customer X amount of money for Y items, and here’s what should happen after payment."
            // A Checkout Session is an object created via Stripe’s API

            const {data: responseData}= response //stripe will add an id that id will be used to redirect the user to stripe payment page

            stripePromise.redirectToCheckout({sessionId: responseData.id})
            if(fetchCartItem){
                fetchCartItem()
            }
            if(fetchOrder){
                fetchOrder()
            }
            
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-blue p-4'>
            <div className='container mx-auto p-4 flex w-full gap-5 justify-between flex-col lg:flex-row'>
                <div className='w-full'>
                    {/* Display address  */}
                    <h3 className='text-lg font-semibold'>Choose Your Address</h3>
                    <div className='bg-white grid gap-4' >
                        {
                            addressList.map((address, index)=>{
                                return (
                                    <label htmlFor={"address"+index} className={`${!address.status && 'hidden'}`} >
                                    <div className='border rounded border-blue-200 p-3 flex gap-3 hover:bg-blue-50'>
                                        <div>
                                            <input type="radio" value={index} onChange={(e)=>setSelectedAddress(e.target.value)} name="address" id={"address"+index} />
                                        </div>
                                        <div>
                                            <p>{address.address_line}</p>
                                            <p>{address.city}</p>
                                            <p>{address.state}</p>
                                            <p>{address.country}-{address.pincode}</p>
                                            <p>{address.mobile}</p>
                                        </div>
                                    </div>
                                    </label>
                                )
                            })
                        }
                        <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-100 border border-gray-200 border-dashed flex justify-center items-center cursor-pointer'>
                            Add Address
                        </div>
                    </div>
                </div>
                <div className='w-full max-w-md py-4 px-2'>
                    {/* Summary  */}
                    <h3 className='text-lg font-semibold'>Summary</h3>

                    <div className='bg-white p-4 '>
                        <h3 className='font-semibold'>Bill Details</h3>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Items Total</p>
                            <p className='flex items-center gap-2'><span className='line-through text-neutral-500'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Total Quantity</p>
                            <p className='flex items-center gap-2'>{totalQty} Items</p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Delivery Change</p>
                            <p className='flex items-center gap-2 text-green-600'>Free</p>
                        </div>
                        <div className='font-semibold flex items-center justify-between gap-4'>
                            <p>Grand Total</p>
                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 '>
                        <button onClick={handleOnlinePayment} className='py-2 px-4 bg-green-600 text-white font-semibold rounded cursor-pointer hover:bg-green-700'>Online Payment</button>
                        <button onClick={handleCashOnDelivery} className='py-2 px-4 border border-green-600  font-semibold rounded cursor-pointer hover:bg-green-700 hover:text-white'>Cash On Delivery</button>
                    </div>
                </div>

            </div>

            {
                openAddress && (
                    <AddAddress close={()=>setOpenAddress(false)}/>
                )
            }

        </section>
    )
}

export default CheckOutPage
