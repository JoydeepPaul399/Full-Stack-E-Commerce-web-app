import React, { useEffect, useState } from 'react'
import Search from './Search'
import { FaRegCircleUser } from "react-icons/fa6";
import { useLocation, useNavigate } from 'react-router-dom'
import useMobile from '../hooks/useMobile';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import logo from '../assets/logo.png'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';



const Header = () => {
    // Array destructuring 
    const [isMobile] = useMobile()
    // console.log(isMobile)


    const location = useLocation()

    const isSearchPage = location.pathname === "/search"
    // console.log(isSearchPage)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem= useSelector(state=>state.cartItem.cart)

    // console.log(cartItem)

    const navigate = useNavigate()

    // Getting user details from redux store
    const user = useSelector((state) => state?.user)
    // console.log("The user details are ", user)

    // const [totalPrice, setTotalPrice]= useState(0)
    // const [totalQty, setTotalQty]= useState(0)
    

    const {totalPrice, totalQty}= useGlobalContext()
    const [openCartSection, setOpenCartSection]= useState(false)

    const redirectHome = (e) => {
        // e.stopPropagation()
        navigate("/")
    }

    const redirectToLoginPage = (e) => {
        // e.stopPropagation()
        navigate("/login")
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }

        navigate("/user")
    }

    // useEffect(()=>{
    //     const qty= cartItem.reduce((prev, curr)=>{
    //         return prev+curr.quantity
    //     }, 0)
    //     setTotalQty(qty)
    //     // console.log(qty)
        

    //     const tPrice= cartItem.reduce((prev, curr)=>{
    //         return prev+ (curr.productId.price * curr.quantity)
    //     }, 0)
    //     setTotalPrice(tPrice)
    //     // console.log(tPrice)
    // }, [cartItem])
    return (
        <header className='h-27 lg:h-20 shadow-md sticky top-0 z-40 pt-2 flex flex-col justify-center bg-white'>
            {/* Basically the Binkeyit and user logo will not be showed  */}
            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex justify-between items-center px-4'>
                        {/* Logo  */}
                        <div>
                            <div onClick={redirectHome} className='cursor-pointer'>
                                <img className='hidden lg:block' src={logo} alt="Logo" width={170} height={60} />
                                {/* <img className='hidden lg:block' src="../src/assets/logo.png" alt="Logo" width={170} height={60} /> */}
                                {/* lg: this is used to mean desktop or any display which size is big we can use this to make page responsive. Here we are using 2 image one for desktop and another for mobile */}
                                <img className='lg:hidden' src={logo} alt="Logo" width={120} height={60} />
                            </div>
                        </div>

                        {/* search section  */}
                        <div className='hidden lg:block'>
                            <Search />
                        </div>
                        {/* login and my cart */}
                        <div className=''>
                            {/* This user button can only be seen in mobile version */}
                            <button className='cursor-pointer text-neutral-600 lg:hidden' onClick={handleMobileUser} >
                                <FaRegCircleUser size={26} />
                            </button>
                            <div className='hidden lg:flex items-center gap-10'>
                                {
                                    user._id ? (
                                        <div onClick={() => setOpenUserMenu(!openUserMenu)} className='relative cursor-pointer select-none'>
                                            <div className='flex items-center gap-2'>
                                                <p>Account</p>
                                                {
                                                    openUserMenu ? (
                                                        <GoTriangleUp size={25} />
                                                    ) : (
                                                        <GoTriangleDown size={25} />
                                                    )
                                                }


                                            </div>
                                            {
                                                openUserMenu && (
                                                    <div className='absolute right-[-180px] top-11'>
                                                        <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                                            <UserMenu />
                                                        </div>
                                                    </div>
                                                )
                                            }

                                        </div>
                                    ) : (
                                        <button onClick={redirectToLoginPage} className='hover:cursor-pointer text-lg px-2' >Login</button>
                                    )
                                }
                                <button onClick={()=>setOpenCartSection(true)} className='flex cursor-pointer items-center gap-2 bg-green-700 px-2 py-2 rounded text-white hover:bg-green-800 text-sm'>
                                    {/* Add to cart icon  */}
                                    <div className='animate-bounce'>
                                        <FaShoppingCart size={21} />
                                    </div>
                                    <div className='font-semibold'>
                                        {
                                            cartItem[0] ? (
                                                <div>
                                                    <p>{totalQty} items</p>
                                                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                                                </div>
                                            ) : (
                                                <p>My Cart</p>
                                            )
                                        }
                                        
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* This search button is for only mobile version */}
            <div className='container mx-auto px-2 my-2 lg:hidden'>
                <Search />
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={()=>setOpenCartSection(false)} />
                )
            }
        </header>
    )
}

export default Header
