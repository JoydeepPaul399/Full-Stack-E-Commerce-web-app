import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { convertToUrl } from '../utils/convertToUrl'


const CategoryWiseProductDisplay = ({id, name }) => {
    const [data, setData]= useState([])
    const [loading, setLoading]= useState(false)
    const containerRef= useRef()
    const subCategoryData= useSelector(state=>state.product.subCategory)
    const navigate= useNavigate()
    const loadingCardNumber= new Array(6).fill(null)

    // Fetching product by category Id 
    const fetchCategoryWiseProduct= async ()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const {data: responseData}= response
            // console.log(responseData)

            if(responseData.success){
                setData(responseData.data)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategoryWiseProduct()
    }, [])



    // scroll button 
    const handleScrollRight= ()=>{
        containerRef.current.scrollLeft +=200
    }

    const handleScrollLeft= ()=>{
        containerRef.current.scrollLeft -=200
    }

  

  const handleRedirectProductListPage= ()=>{
    // console.log(id, name)
    // console.log(subCategoryData)
    const subcategory= subCategoryData.find(sub=>{
      // console.log(sub)
     const filterData= sub.category.some(c=>{
      return c._id ==id
     })
    //  When the callback returns true, .find() returns the entire sub object that matched, and assigns it to subcategory.
     return filterData ? true : null
    })

    // console.log(subcategory)

    const url= `/${convertToUrl(name)}-${id}/${convertToUrl(subcategory.name)}-${subcategory._id}`
    console.log(url)
    navigate(url)

    // return url
  }


  return (
    <div>
        <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
            <h3 className='font-semibold text-lg md:text-xl'>{name}s</h3>
            <button onClick={handleRedirectProductListPage} className='text-green-600 hover:text-green-700 cursor-pointer'>See All</button>
        </div>
        <div className='flex items-center gap-4 md:gap-6 lg:gap-8 container mx-auto overflow-x-scroll scroll-smooth scrollbar-none' ref={containerRef}>
            {/* While loading CardLoading component will be rendered  */}
            <div className='flex flex-wrap justify-center gap-3'>
                {
                    loading && 
                    (
                        loadingCardNumber.map((_, index)=>{
                            return (

                                <CardLoading key={index}/>
                            )
                        }) 
                    )
                }
            </div>


            {/* After loading finishes following will be rendered */}
            {
                data.map((p, index)=>{
                    return (
                        <CardProduct key={index} data={p}  />
                    )
                })
            }
            {/* The arrows will not be appeared in mobile devices */}
            <div className='absolute left-0 right-0 hidden lg:flex justify-between w-full container mx-auto '>
                {/* left scrool button  */}
                <button onClick={handleScrollLeft} className='bg-transparent shadow-lg p-4 rounded-full text-lg cursor-pointer hover:bg-gray-100  '>
                    <FaAngleLeft size={20}/>
                </button>
                {/* right scrool button  */}
                <button onClick={handleScrollRight} className='bg-transparent shadow-lg p-4 rounded-full text-lg cursor-pointer hover:bg-gray-100 '>
                    <FaAngleRight size={20}/>
                </button>
            </div>

        </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
