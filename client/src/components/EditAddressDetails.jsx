import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoCloseSharp } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'


const EditAddressDetails = ({close, data}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
        address_line: data.address_line,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country,
        mobile: data.mobile,
        _id: data._id
    }
  })
  const {fetchAddress}= useGlobalContext()

  const onSubmit= async (data)=>{
    console.log(data)

    try {
      const response= await Axios({
        ...SummaryApi.updateAddress,
        data: {
          address_line: data.address_line,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
          mobile: data.mobile,
          _id: data._id
        }
      })

      const {data: responseData}= response

      if(responseData.success){
        toast.success(responseData.message)
        fetchAddress()
        if(close){
          close()
          reset()
        }
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <section className='bg-gray-300 fixed top-0 right-0 left-0 bottom-0 z-50 h-screen overflow-auto'>
        <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded '>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold'>Add Address</h2>
            <button onClick={close} className='cursor-pointer'><IoCloseSharp size={27} /></button>
          </div>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-4 grid gap-4'>
                <div className='grid gap-1'>
                    <label htmlFor='address_line'>Address Line:</label>
                    <input type="text" id="address_line" className='border border-blue-100 bg-blue-50 rounded p-2' {...register("address_line", {required: true})} />
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='city'>City:</label>
                    <input type="text" id="city" className='border border-blue-100 bg-blue-50 rounded p-2' {...register("city", {required: true})} />
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='state'>State:</label>
                    <input type="text" id="state" className='border border-blue-100 bg-blue-50 rounded p-2' {...register("state", {required: true})} />
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='pincode'>Pin Code:</label>
                    <input type="text" id="pincode" className='border border-blue-100 bg-blue-50 rounded p-2' {...register("pincode", {required: true})} />
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='country'>Country:</label>
                    <input type="text" id="country" className='border border-blue-100 bg-blue-50 rounded p-2' {...register("country", {required: true})} />
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='mobile'>Mobile Number:</label>
                    <input type="text" id="mobile" className='border border-blue-100 bg-blue-50 rounded p-2' {...register("mobile", {required: true})} />
                </div>

                <button type='submit' className='bg-amber-400 w-full py-2 font-semibold hover:bg-amber-500 cursor-pointer mt-4' >Submit</button>
            </form>
        </div>
    </section>
  )
}

export default EditAddressDetails
