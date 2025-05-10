import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // console.log("Email is reset is ", location?.state?.email)

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/")
    }

    if (location?.state?.email) {
      setData((prevData) => {
        return {
          ...prevData,
          email: location.state.email
        }
      })
    }
  }, [])

  const validateValue = Object.values(data).every(el => el)


  const handleSubmit = async (e) => {
    e.preventDefault()
    if(data.newPassword!==data.confirmPassword){
      toast.error("New password and Confirm Password must be same")
      return
    }
    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })

      console.log(response)
      // error we set from the backend while sending the data 
      if (response.data.error) {
        toast.error(response.data.message)
        return
      }
      if (response.data.success) {
        toast.success(response.data.message)
        console.log(response.data.email)
        // as we are setting the state with email Id we can use it in Otpverification page.
        // console.log("Now data is ", data)
        navigate("/login")
        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        })


      }
    }
    catch (error) {
      console.log("Error occured", error)
      AxiosToastError(error) // we have created a custom function in util folder to show the error to the user
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }


  console.log(data)
  console.log("resetPassword page", location)
  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-10'>
        <p className='font-semibold text-lg text-center'>Reset Your Password</p>
        <form className="grid gap-[16px] mt-5" onSubmit={handleSubmit} >



          <div className='grid gap-3'>
            <label htmlFor="newPassword">New Password: </label>
            <div className='bg-blue-50 p-2 border border-gray-400 rounded flex justify-between'>
              <input type={showNewPassword ? "text" : "password"} id='newPassword' className='outline-none w-[90%]' name='newPassword' value={data.newPassword} onChange={handleChange} placeholder='Enter Your New Password' />
              <div className='cursor-pointer' onClick={() => setShowNewPassword(!showNewPassword)}>
                {
                  showNewPassword ? (<IoEyeOff />)
                    :
                    (<FaEye />)
                }

              </div>
            </div>
          </div>

          <div className='grid gap-3'>
            <label htmlFor="confirmPassword">Confirm New Password: </label>
            <div className='bg-blue-50 p-2 border border-gray-400 rounded flex justify-between'>
              <input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' className='outline-none w-[90%]' name='confirmPassword' value={data.confirmPassword} onChange={handleChange} placeholder='Enter Your Confirm Password' />
              <div className='cursor-pointer' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {
                  showConfirmPassword ? (<IoEyeOff />)
                    :
                    (<FaEye />)
                }

              </div>
            </div>
          </div>





          <button disabled={!validateValue} type='submit' className={` ${validateValue ? "bg-green-800" : "bg-gray-500"} cursor-pointer text-white font-bold py-2 rounded my-3 tracking-wider`}>Change Password </button>


        </form>

        <p>
          Already have an account ? <Link to="/login" className='font-semibold text-blue-800 hover:text-green-700 transition-all duration-300 ease-in-out'>Login</Link>
        </p>

      </div>
    </section>
  )
}

export default ResetPassword
