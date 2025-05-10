import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';



const OtpVerification = () => {

    const [data, setData]= useState(["", "", "", "", "", ""])
    const navigate= useNavigate()
    const inputRef= useRef([])
    // we can get the email id from the location now since we have added state while navigating 
    const location= useLocation()

    console.log("location", location)

    useEffect(()=>{
      if(!location?.state?.email){
        navigate("/forgot-password")
      }
    }, [])

    const validateValue=data.every(el=>el)

    const handleSubmit= async (e)=>{
        e.preventDefault()
        try{
            const response= await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                  otp: data.join(""),
                  email: location?.state?.email
                }
            })

            console.log(response)
            // error we set from the backend while sending the data 
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data){
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                  state: {
                    email: location?.state?.email, // Put the email inside state
                    ...response.data
                  }
                })

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
        <p className='font-semibold text-lg text-center'>Enter OTP</p>
        <form className="grid gap-[16px] mt-5" onSubmit={handleSubmit} >

            

            <div className='grid gap-3'>
                <label htmlFor="otp">Enter Your OTP: </label>
                <div className='grid grid-cols-6 gap-1 lg:gap-3'>
                  {
                    data.map((element, index)=>{
                      return (<input type="text" maxLength={1} value={data[index]} ref={(ref)=>{
                        inputRef.current[index]= ref
                        return ref
                        }} onChange={(e)=>{
                        const value= e.target.value
                        console.log("value is ", value)
                        const newData= [...data]
                        newData[index]= value
                        setData(newData)

                        if(value && index < 5){
                          inputRef.current[index+1].focus()
                        }
                      }}  key={"otp"+index} id='otp' className='bg-blue-50 p-2 border w-9 lg:w-14 border-gray-400 rounded text-center font-semibold' />)
                    })
                  }
                </div>
                
            </div>

            
            
            

            <button disabled= {!validateValue} type='submit' className={` ${validateValue ? "bg-green-800" : "bg-gray-500"} cursor-pointer text-white font-bold py-2 rounded my-3 tracking-wider`}>Verify OTP</button>
            

        </form>

        <p>
            Already have an account ? <Link to="/login" className='font-semibold text-blue-800 hover:text-green-700 transition-all duration-300 ease-in-out'>Login</Link>
        </p>

      </div>
    </section>
  )
}

export default OtpVerification

