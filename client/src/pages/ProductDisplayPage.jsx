import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from "../assets/Best_Prices_Offers.png"
import image3 from "../assets/Wide_Assortment.png"
import calculateDiscount from '../utils/CalculateDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params= useParams()
  
  let productId= params?.product?.split("-").slice(-1)[0]
  // console.log(productId)
  // console.log(params)
  const [data, setData]= useState({
    name:"",
    image: []
  })
  const [loading, setLoading]= useState(false)
  // setting the image index based on this we will display images 
  const [imageIndex, setImagesIndex]= useState(0)
  const imageContainer= useRef(null)

  const handleScrollRight= ()=>{
    imageContainer.current.scrollLeft+=100
  }
  const handleScrollLeft= ()=>{
    imageContainer.current.scrollLeft-=100
  }

  const fetchProductDetails= async ()=>{
    try {
      setLoading(true)
      const response= await Axios({
        ...SummaryApi.getProductDetails,
        data: {productId: productId}
      })

      const {data: responseData}= response

      if(responseData.success){
        setData(responseData.data)
      }
    } 
    catch (error) {
      toast.error(error?.response?.data?.message)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  }, [productId])
  // console.log("data is", data)

  

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2  '>
      <div className='h-full'>
        <div className='bg-white min-h-[300px] lg:min-h-[70vh] rounded w-full'>
          <img className='w-full h-full object-scale-down' src={data.image[imageIndex]} alt="Image" />
          
        </div>
        {/* rounded box bellow to the image  */}
        <div className='flex items-center justify-center gap-3'>
          {
            data.image.map((img, index)=>{
              return (
                <div key={index} onClick={()=>setImagesIndex(index)} className={`bg-blue-200 w-3 h-3 rounded-full -mt-8 ${index ===imageIndex && "bg-green-300"} `}></div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 relative z-10 mt-5 w-full overflow-x-auto scrollbar-none'>
            {
               data.image.map((img, index)=>{
                return (
                  <div key={index} className='w-20 h-20 min-h-20 max-h-20 shadow-md'>
                    <img onClick={()=>setImagesIndex(index)} className='w-full h-full object-scale-down cursor-pointer'  src={img} alt="image" />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full h-full flex justify-between absolute items-center z-5 -ml-4'>
            <button onClick={handleScrollLeft} className='bg-white p-1 rounded-full shadow-md' >
              <FaAngleLeft/>
            </button>
            <button onClick={handleScrollRight} className='bg-white p-1 rounded-full shadow-md' >
              <FaAngleRight/>
            </button>
          </div>
        </div>
        <div className='my-4'>
          <div>
            <p className='font-semibold' >Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold' >Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>
          <div>
            {
              data?.more_details && Object.keys(data?.more_details).map((element, index)=>{
                return (
                  <div key={index}>
                    <p className='font-semibold' >{element}</p>
                    <p className='text-base'>{data?.more_details[element]}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* right part  */}
      <div className='p-4 lg:pl-7 text-base  lg:my-1 lg:text-lg'>
        <p className='bg-green-300 w-fit px-2 rounded-full' >10 Minutes</p>
        <h2 className='text-lg font-semibold lg:text-3xl'>{data?.name}</h2>
        <p>{data.unit}</p>
        <Divider/>
        <div className='mt-4 mb-1 flex'>
          <span>Price: </span> <span className='font-semibold text-lg lg:text-xl bg-green-50 px-2 py-1 border border-green-600 rounded mx-2' >{DisplayPriceInRupees(calculateDiscount(data.price, data.discount))}</span>
        </div>
          <div className='  text-base'>{
            data.discount > 0 && <div>
              <span>Original Price: <span className='line-through'>{DisplayPriceInRupees(data.price)}</span></span>
              <div>
                <span className='text-green-600 font-bold'>{`${data.discount}% `}</span><span>Discount</span></div>
              </div>
          }</div>
        {
          data.stock == 0 ? (
            <p className='text-sm my-2 text-red-500'>Out Of Stock</p>
          ) : (

            // <button className='my-1 mb-2 px-4 py-1 bg-green-600 hover:bg-green-700 rounded font-semibold text-white cursor-pointer'>Add</button>
            <div className='my-4'>
              <AddToCartButton data={data}/>
            </div>
          )
        }

          <h2 className='font-semibold my-4'>Why shop from Blinkit</h2>
          <div className='flex flex-col gap-2'>

            <div className='flex items-center gap-4'>
              <img src={image1} alt="Fast delivery" className='w-20 h-20' />
              <div className='text-sm'>
                <div className='font-semibold'>Superfast Delivery</div>
                <p>Get Your order delivered to your doorstep at the earliest from dark stores near you</p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <img src={image2} alt="Best Price" className='w-20 h-20' />
              <div className='text-sm'>
                <div className='font-semibold'>Best Prices and Offers </div>
                <p>Best price in the market!</p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <img src={image3} alt="image3" className='w-20 h-20' />
              <div className='text-sm'>
                <div className='font-semibold'>Wide Assortment </div>
                <p>Choose from 5000+ products across food personal care, household & other categories</p>
              </div>
            </div>


          </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
