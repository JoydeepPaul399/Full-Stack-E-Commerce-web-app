import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import { RiExternalLinkFill } from "react-icons/ri";
import isAdmin from '../utils/isAdmin'


const UserMenu = () => {
    const user= useSelector((state)=>state?.user)
    const dispatch= useDispatch()
    const navigate= useNavigate()

    const handleLogout= async ()=>{
      try{
        const response= await Axios({
          ...SummaryApi.logout
        })
        if(response.data.success){
          dispatch(logout())
          localStorage.clear()
          alert("Logged out successfully")
          //window.history.back() // redirect to previous page
          navigate("/")
          
          return
        }
      }
      catch(error){
        console.log(error)
      }
    }

  return (
    <div>
      <div className={`grid gap-1`}>
        <div className='font-semibold'>My Account</div>
        <div className='flex gap-1 items-center'>
          {user.name || user.mobile}<span className='text-amber-500 text-sm pt-2'>({(user?.role) === "ADMIN" ? "Admin" : "User"})</span>
          <Link className='hover:text-yellow-700' to="/dashboard/profile">
            <RiExternalLinkFill size={20} />
          </Link> 
        </div>
      <Divider/>
      </div>
      <div className='grid gap-3'>
        {
          isAdmin(user?.role) && (
            <div className='hover:bg-yellow-200 px-2 py-2'> <Link to={"/dashboard/category"}>Category</Link></div>
          )
        }
        {
          isAdmin(user?.role) && (
            <div className='hover:bg-yellow-200 px-2 py-2'> <Link to={"/dashboard/subcategory"}>Sub Category</Link></div>
          )
        }

        {
          isAdmin(user?.role) && (
            <div className='hover:bg-yellow-200 px-2 py-2'> <Link to={"/dashboard/upload-product"}>Upload Product</Link></div>
          )
        }

        {
          isAdmin(user?.role) && (
            <div className='hover:bg-yellow-200 px-2 py-2'> <Link to={"/dashboard/products"}>Products</Link> </div>
          )
        }
        <div className='hover:bg-yellow-200 px-2 py-2'> <Link to={"/dashboard/myorders"}>Order</Link> </div>
        <div className='hover:bg-yellow-200 py-1 px-2'> <Link to={"/dashboard/address"}>Saved Address</Link> </div>
        <div className='bg-red-200 hover:bg-yellow-200 py-1 px-2'><button onClick={handleLogout} className='cursor-pointer w-full text-left'>Log Out</button></div>
      </div>
    </div>
  )
}

export default UserMenu
