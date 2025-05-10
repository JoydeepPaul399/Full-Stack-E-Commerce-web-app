import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchSharp } from "react-icons/io5";


const ProductAdmin = () => {

  const [productData, setProductData]= useState([])
  // current page 
  const [page, setPage]= useState(1)
  const [loading, setLoading]= useState(false)
  const [totalPageNumber, setTotalPageNumber]= useState(1)
  const [search, setSearch]= useState("")

  const fetchProductData= async ()=>{
      try {
        setLoading(true)
          const response= await Axios({
              ...SummaryApi.getProduct,
              data: {
                  page: page,
                  limit:12,
                  search: search
              }
          })

          const {data : responseData}= response

          if(responseData.success){
              setProductData(responseData.data)
              setTotalPageNumber(responseData.totalNoPage)
              // console.log(responseData)
          }
      } catch (error) {
          toast(error.response.data.message)
          console.log(error)
      }
      finally{
        setLoading(false)
      }
  }

  useEffect(()=>{
    fetchProductData()
  }, [page])

  useEffect(()=>{
    let flag= true

    const interval= setTimeout(()=>{
      if(flag){
        fetchProductData()
        flag=false
      }
    }, 300)

    return ()=>{
      clearTimeout(interval)
    }
  }, [search])

  const handleNext= ()=>{
    if(page !== totalPageNumber){
      setPage((prev)=>{
        return prev+1
      })
    }
  }

  const handlePrevious= ()=>{
    if(page>1){
      setPage((prev)=>{
        return prev-1
      })
    }
  }

  const handleOnChange= (e)=>{
    const {value}= e.target
    setPage(1)
    setSearch(value)
  }

  // console.log(search)


  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between h-full '>
        <h2  className='font-semibold'>Product</h2>
        <div className='h-full flex justify-center items-center px-4 py-2 gap-2 border border-blue-100 bg-blue-50 rounded'>
          <IoSearchSharp size={25} />
          <input onChange={handleOnChange} value={search} type="text" placeholder='Search Product Here...' className='h-full  outline-none' />
        </div>
      </div>
      {/* Loading spinner  */}
      {loading && (
          <Loading/>
        )
      }

      {/* All product  */}
      <div className='p-4 bg-blue-50'>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>      
        {
          productData.map((p, index)=>{
            return (
              <ProductCardAdmin fetchProductData={fetchProductData} data={p}/>
            )
          })
        }
        </div>
        <div className='flex justify-between items-center my-4'>
          <button onClick={handlePrevious} className='border border-amber-400 px-4 py-1 rounded hover:bg-amber-500 cursor-pointer'>Previous</button>
          <button className='w-full bg-slate-100'>{page}/{totalPageNumber}</button>
          <button onClick={handleNext} className='border border-amber-400 px-4 py-1 rounded hover:bg-amber-500 cursor-pointer'>Next</button>
        </div>
      </div>

    </section>
        
  )
}

export default ProductAdmin
