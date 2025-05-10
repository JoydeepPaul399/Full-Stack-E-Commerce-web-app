import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';


const Profile = () => {
  const user= useSelector((state)=>state.user)
  const dispatch= useDispatch()
  const [openProfileAvatarEdit, setOpenProfileAvatarEdit]= useState(false)
  const [loading, setLoading]= useState(false)
  // console.log("THis is details", user)
  const [userData, setUserData]= useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile
  })

  useEffect(()=>{
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    })
  }, [user])

  const handleOnChange= (e)=>{
    const {name, value}= e.target
    setUserData((prev)=>{
      return {
        ...prev, [name]:value
      }
    })
  }

  const handleSubmit= async (e)=>{
    e.preventDefault()
    try{
      setLoading(true)
      const response= await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData
      })

      const { data: responseData}= response
      console.log("Response data", responseData)

      if(responseData.success){
        alert("Updated successfully")
        console.log("Updated successfully")
        // update the user details in redux store
        const userData= await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false)
    }

  }
  return (
    <div>
      {/* profile upload and display image */}
      <div className='w-16 h-16 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
        {
          user.avatar ? (
            <img src= {user.avatar} alt={user.name} className='w-full h-full' />
          ) : (
            <FaRegUserCircle size={60} />
          )
        }
      </div>
      <button onClick={()=>setOpenProfileAvatarEdit(!openProfileAvatarEdit)} className='text-sm font-bold min-w-20 border border-amber-400 px-3 py-1 rounded-full mt-5 cursor-pointer outline-none hover:border-amber-800 hover:bg-amber-500 hover:text-white' >Edit</button>

      {
        openProfileAvatarEdit && (
          <UserProfileAvatarEdit close={()=>setOpenProfileAvatarEdit(false)} />
          
        )
      }


      {/* Name, Mobile, Email and change password  */}
      <form className='my-4 grid gap-4' onSubmit={handleSubmit} >

        <div className='grid'>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" placeholder='Enter Your Name' className='p-2 bg-blue-50 outline-amber-400 border rounded' value={userData.name} onChange={handleOnChange} required />
        </div>

        <div className='grid'>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder='Enter Your Email' className='p-2 bg-blue-50 outline-amber-400 border rounded' value={userData.email} onChange={handleOnChange} required />
        </div>

        <div className='grid'>
          <label htmlFor="mobile">Mobile</label>
          <input type="text" name="mobile" id="mobile" placeholder='Enter Your Mobile' className='p-2 bg-blue-50 outline-amber-400 border rounded' value={userData.mobile} onChange={handleOnChange} required />
        </div>

        <button className='border-none rounded px-4 py-2 font-semibold bg-amber-500 cursor-pointer hover:bg-amber-600' >{
          loading ? "Loading..." : "Submit"
        }</button>
      </form>
    </div>
  )
}

export default Profile
