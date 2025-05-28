import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import calculateDiscount from '../utils/CalculateDiscount'
import ImageEmptyCart from "../assets/empty_cart.webp"
import toast from 'react-hot-toast'


const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user= useSelector(state=>state.user)
    const navigate= useNavigate()
    // console.log(user)

    const handleRedirectPage= ()=>{
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }

    return (
        <section className='bg-neutral-300  fixed top-0 right-0 left-0 bottom-0 z-50'>
            <div className='bg-white w-full max-w-sm min-h-screen max-h-screen opacity-100 ml-auto'>
                <div className='flex items-center justify-between p-3 shadow-md gap-1 '>
                    <h2 className='font-semibold'>Cart</h2>
                    <Link to={"/"} className='lg:hidden'>
                        <IoClose size={25} />
                    </Link>
                    <button onClick={close} className='hidden lg:block'>
                        <IoClose size={25} />
                    </button>
                </div>

                <div className='min-h-[75vh] lg:min-h-[80vh] max-h-[calc(100vh-120px)] bg-blue-50 p-2 flex flex-col gap-4'>
                    {/* Display items */}

                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded'>
                                    <p>Your Total Savings</p>
                                    <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                                </div>
                                <div className='bg-white rounded-md p-2 grid gap-5 overflow-auto'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                return (
                                                    <div key={index} className='flex w-full gap-4' >
                                                        <div className='w-16 h-16 min-w-16 min-h-16  bg-red-500 border border-blue-100'>
                                                            {/* {console.log(item)} */}
                                                            <img src={item?.productId?.image[0]} alt="items" className='object-scale-down' />
                                                        </div>
                                                        <div className='w-full max-w-sm text-xs'>
                                                            <p className='text-xs text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                                            <p className='text-neutral-400'>{item?.productId?.unit}</p>
                                                            <p className='font-semibold'>{DisplayPriceInRupees(calculateDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                                                        </div>
                                                        <div>
                                                            <AddToCartButton data={item?.productId} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>

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
                            </>
                        ) : (
                            <div className='flex flex-col justify-center items-center gap-2 lg:gap-3 w-full h-full '>
                            <img src={ImageEmptyCart} alt="Empty cart" className='w-full h-full object-scale-down' />
                            <p className=' text-sm text-gray-500'>No Product in cart</p>
                            <Link onClick={close} to={"/"} className='bg-green-600 px-3 py-2 rounded text-white font-semibold'>Shop Now</Link>
                            </div>
                        )
                    }



                </div>

                {
                    cartItem[0] && (
                        <div className='p-2 sticky bottom-3 '>
                            <div className='bg-green-700 text-neutral-100 px-4 py-4 font-bold text-base rounded flex items-center justify-between gap-4 '>
                                <div>
                                    {DisplayPriceInRupees(totalPrice)}
                                </div>
                                <button onClick={handleRedirectPage} className='flex items-center gap-1 cursor-pointer'>
                                    PROCEED
                                    <span><FaCaretRight /></span>
                                </button>
                            </div>
                        </div>
                    )
                }


            </div>
        </section>
    )
}

export default DisplayCartItem
