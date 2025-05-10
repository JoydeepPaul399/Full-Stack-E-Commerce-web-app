import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { convertToUrl } from '../utils/convertToUrl'
import calculateDiscount from '../utils/CalculateDiscount'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const CardProduct = ({data}) => {
    // const url= `/product/${convertToUrl(data.name)}-${convertToUrl(data._id)}`
    const url= `/product/${convertToUrl(data?.name)}-${convertToUrl(data?._id)}`
    const [loading, setLoading]= useState(false)

    const handleAddToCart= async (e)=>{
        try {
            e.preventDefault()
            e.stopPropagation()
            setLoading(true)

            const response= await Axios({
                ...SummaryApi.addToCart,
                data: {
                    productId: data?._id
                }
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
            }

        } catch (error) {
            // console.log(error?.response?.data?.message)
            toast.error(error?.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <Link to={url} className='border border-gray-200 p-4 grid gap-3 max-w-52 lg:min-w-42 rounded' >
        <div className='max-h-32 rounded'>
            {/* <img src={data.image[0]} alt="image" className='w-full h-full object-scale-down lg:scale-125' /> */}
            <img src={Array.isArray(data.image) && data.image.length > 0 && data.image[0]} alt="image" className='w-full h-full object-scale-down lg:scale-125' />
        </div>
        <div className='rounded text-sm w-fit p-[1px] px-2 mt-2  text-green-600 bg-green-50'>
            10 Minutes
        </div>
        <div className='font-medium text-ellipsis line-clamp-2'>
            {data.name}
            
        </div>
        <div className='flex justify-between items-center gap-2'>
            <span>{data.unit}</span>
            <span>
                {
                    data.discount >0 && (<span className='bg-green-200 text-green-600 text-sm'>{data.discount}% discount</span>)
                }
            </span>
        </div>
        <div className='flex items-center justify-between gap-2 '>
            <div className='font-semibold'>
                {DisplayPriceInRupees(calculateDiscount(data.price, data.discount))}
            </div>
            <div className=''>
                {
                    data.stock < 1 ? (<p className='text-sm my-2 text-red-500'>Out Of Stock</p>) : (
                        <button onClick={handleAddToCart} className='bg-green-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-green-700'>Add</button>
                    )
                }
            </div>
        </div>

  </Link>
  )
}

export default CardProduct
