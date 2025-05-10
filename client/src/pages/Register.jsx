import axios from 'axios';
import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';



const Register = () => {

    const [data, setData]= useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword]= useState(false)
    const [showConfirmPassword, setShowConfirmPassword]= useState(false)
    const navigate= useNavigate()

    const handleChange= (e)=>{
        setData({...data, [e.target.name]: e.target.value})
    }

    // console.log(data)
    // Object.values returns an array. and .every() is an array method that checks if every element in the array satisfies a given condition. 
    const validateValue= Object.values(data).every(el=>el)

    const handleSubmit= async (e)=>{
        e.preventDefault()
        try{
            if(data.password !== data.confirmPassword){
                toast.error("Password and confirm password must be same")
                return
            }

            const response= await Axios({
                ...SummaryApi.register,
                // we are sending the data as body of the axios 
                data: data
            })

            console.log(response)
            // error we set from the backend while sending the data 
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name: "",
                    email:"",
                    password:"",
                    confirmPassword: ""
                })
                // After register user will be redirected to login page 
                navigate("/login")

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
        <p className='text-center font-bold underline text-xl underline-offset-6 text-yellow-600'>Welcome to Binkeyit</p>

        <form className="grid gap-[16px] mt-5" onSubmit={handleSubmit} >

            <div className='grid'>
                <label htmlFor="name">Name: </label>
                <input type="text" id='name' className='bg-blue-50 p-2 border border-gray-400 rounded' name='name' autoFocus={true} value={data.name} onChange={handleChange} placeholder='Enter Your Name' />
            </div>

            <div className='grid'>
                <label htmlFor="email">Email: </label>
                <input type="email" id='email' className='bg-blue-50 p-2 border border-gray-400 rounded' name='email' value={data.email} onChange={handleChange} placeholder='Enter Your Email' />
            </div>

            <div className='grid'>
                <label htmlFor="password">Password: </label>
                <div className='bg-blue-50 p-2 border border-gray-400 rounded flex justify-between'>
                    <input type={ showPassword ? "text": "password"} id='password' className='outline-none w-[90%]' name='password' value={data.password} onChange={handleChange} placeholder='Enter Your Password' />
                    <div className='cursor-pointer' onClick={()=>setShowPassword(!showPassword)}>
                        {
                            showPassword ? (<IoEyeOff />) 
                            : 
                            (<FaEye />)
                        }
                        
                    </div>
                </div>
            </div>

            <div className='grid'>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <div className='bg-blue-50 p-2 border border-gray-400 rounded flex justify-between'>
                    <input type={ showConfirmPassword ? "text": "password"} id='confirmPassword' className='outline-none w-[90%]' name='confirmPassword' value={data.confirmPassword} onChange={handleChange} placeholder='Confirm Your Password' />
                    <div className='cursor-pointer' onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                        {
                            showConfirmPassword ? (<IoEyeOff />) 
                            : 
                            (<FaEye />)
                        }
                        
                    </div>
                </div>
            </div>

            <button disabled= {!validateValue} type='submit' className={` ${validateValue ? "bg-green-800" : "bg-gray-500"} cursor-pointer text-white font-bold py-2 rounded my-3 tracking-wider`}>Register</button>
            

        </form>

        <p>
            Already have an account ? <Link to="/login" className='font-semibold text-blue-800 hover:text-green-700 transition-all duration-300 ease-in-out'>Login</Link>
        </p>

      </div>
    </section>
  )
}

export default Register
