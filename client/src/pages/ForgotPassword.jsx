import axios from 'axios';
import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';



const ForgotPassword = () => {

    const [data, setData]= useState({
        email: ""
    })
    const navigate= useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    // console.log(data)
    // Object.values returns an array. and .every() is an array method that checks if every element in the array satisfies a given condition. 
    const validateValue= Object.values(data).every(el=>el)

    const handleSubmit= async (e)=>{
        e.preventDefault()
        try{
            const response= await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })

            console.log(response)
            // error we set from the backend while sending the data 
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                console.log(response.data.email)
                // as we are setting the state with email Id we can use it in Otpverification page.
                console.log("Now data is ", data)
                navigate("/verification-otp", {
                    state: data,
                })
                // setData({
                //     email:""
                // })
                

            }
        }
        catch(error){
            console.log("Error occured", error)
            AxiosToastError(error) // we have created a custom function in util folder to show the error to the user
        }
    }

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-10'>
        <p className='font-semibold text-lg text-center'>Forgot Password</p>
        <form className="grid gap-[16px] mt-5" onSubmit={handleSubmit} >

            

            <div className='grid gap-3'>
                <label htmlFor="email">Email: </label>
                <input type="email" id='email' className='bg-blue-50 p-2 border border-gray-400 rounded' name='email' value={data.email} onChange={handleChange} placeholder='Enter Your Email' />
            </div>

            
            
            

            <button disabled= {!validateValue} type='submit' className={` ${validateValue ? "bg-green-800" : "bg-gray-500"} cursor-pointer text-white font-bold py-2 rounded my-3 tracking-wider`}>Send OTP</button>
            

        </form>

        <p>
            Already have an account ? <Link to="/login" className='font-semibold text-blue-800 hover:text-green-700 transition-all duration-300 ease-in-out'>Login</Link>
        </p>

      </div>
    </section>
  )
}

export default ForgotPassword

