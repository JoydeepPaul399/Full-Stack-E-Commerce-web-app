import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import toast from 'react-hot-toast'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import NoData from "../assets/nothing here yet.webp"

const SearchPage = () => {
  const [data, setData]= useState([])
  const [loading, setLoading]= useState(false)
  const loadingArrayCard= new Array(10).fill(null)
  const [page, setPage]= useState(1)
  const [totalPage, setTotalPage]= useState(1)
  const params= useLocation()
  const searchText= params?.search?.slice(3)
  // console.log("This is ", params.search.slice(3))
  

  const fetchData= async ()=>{
    try {
      setLoading(true)
      const response= await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page
        }
      })

      const { data: responseData }= response

      if(responseData.success){
        if(responseData.page==1){
          setData(responseData.data)
        }
        else{
          setData((prev)=>{
            return [...prev, ...responseData.data]
          })
        }
        setTotalPage(responseData.totalPage)
        console.log(responseData)
      }


    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log("error is ", error)
    }
    finally{
      setLoading(false)
    }
  }

  const handleFetchMore= async ()=>{
    if(totalPage>page){
      setPage(prev=>prev+1)
    }
  }

  useEffect(()=>{
    fetchData()
  }, [page, searchText])

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4 '>
        <p className='font-semibold'>Search Result: {data.length} </p>
      </div>

      <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore} >
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 ' >

          {/* Dispalying dat  */}
            {
              data.map((p, index)=>{
                return (
                  <CardProduct data={p} key={index}/>
                )
              })
            }

            


          {/* Loading data  */}
          {
            loading && (
              loadingArrayCard.map((_, index)=>{
                return (
                  <div key={index} >
                    <CardLoading />
                  </div>
                )
              })
            )
          }


        </div>
      </InfiniteScroll>

      {/* If No Data  */}
      {
              !data[0] && !loading && (
                <div className='flex justify-center items-center flex-col'>
                  <img className='w-full h-full max-w-xs max-h-xs' src={NoData} alt="No Data" />
                  <p className='font-semibold my-2 text-gray-600'>No Product found.</p>
                </div>
              )
            }
    </section>
  )
}

export default SearchPage
