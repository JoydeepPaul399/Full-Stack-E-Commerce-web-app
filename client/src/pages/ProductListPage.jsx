import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { convertToUrl } from '../utils/convertToUrl'

// This will show the all product where user can buy 
const ProductListPage = () => {
  const [data, setData]= useState([])
  const [page, setPage]= useState(1)
  const [loading, setLoading]= useState(false)
  const [totalPage, setTotalPage]= useState(1)


  const params= useParams()
  // console.log(params)
  const categoryId= params.category.split("-").slice(-1)[0]
  // console.log("categoryId is ", categoryId)
  const subCategoryId= params.subCategory.split("-").slice(-1)[0]
  // console.log("subcategoryId is ", subCategoryId)
  const subCategory= params?.subCategory?.split("-")
  const subCategoryName= subCategory?.slice(0, subCategory?.length - 1).join(" ")

  const allSubCategory= useSelector(state=>state.product.subCategory)
  const [displaySubCategory, setDisplaySubCategory]= useState([])

  // console.log("allSubCategory is ", allSubCategory)


  const fetchProductData= async ()=>{
    try {
      setLoading(true)
      const response= await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 10
        }
      })

      // console.log("response is ", response)
      const {data: responseData}= response

      if(responseData.success){
        setTotalPage(responseData.totalCount)
        if(responseData.page==1){
          setData(responseData.data)
        }
        else{
          setData([...data, responseData.data])
        }
        setTotalPage(responseData.totalCount)
        // 2:38
      }
      // throw new Error("new error")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong!")
    }
    finally{
      setLoading(false)
    }
  }

  
  useEffect(()=>{
    fetchProductData()
  }, [params])

  useEffect(()=>{
    const sub= allSubCategory.filter(s=>{
      // These sub categories are the part of a category 
      const filterData= s.category.some(el=>{
        return el._id===categoryId
      })

      return filterData ? filterData : false
    })
    // console.log("sub is ", sub)
    setDisplaySubCategory(sub)
  }, [params, allSubCategory])

  

  // console.log("data is ", data)
  


  return (
    <section className='sticky top-27 lg:top-20' >
      <div className='container sticky top-27 lg:top-20 mx-auto grid grid-cols-[90px_1fr] md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
        {/* sub-category  */}
        {/* Give min and max height then overflow auto then box will be scrollable if required  */}
        <div className='min-h-[78vh] p-2 grid gap-1  shadow-md max-h-[78vh] overflow-y-auto scrollbarCustom'>
          {
            displaySubCategory.map((s, index)=>{
              return (
                <Link to={`/${convertToUrl(s?.category[0].name)}-${convertToUrl(s?.category[0]._id)}/${convertToUrl(s.name)}-${s._id}`} key={index} className={`w-full p-2 lg:flex lg:items-center justify-between hover:bg-green-300 cursor-pointer ${subCategoryId===s._id ? "bg-green-100" :"bg-white" } `}>
                  <div className='w-fit mx-auto'>
                    <img src={s.image} alt="Image" className='w-14 h-full object-scale-down' />
                  </div>
                  <p className='-mt-6 text-xs text-center lg:w-[50%]'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>

        {/* product */}
        <div className='bg-white sticky lg:20'>
          <div className='bg-white shadow-md p-4 font-semibold ' >
            <h3>{subCategoryName}</h3>
          </div>
        <div>

        <div className='min-h-[70vh] max-h-[70vh] overflow-y-auto'>
          <div className='flex flex-wrap gap-4 justify-center items-center md:justify-start ml-4 mt-2'>
            {
              data.map((p, index)=>{
                return (
                  <CardProduct key={index} data={p}  />
                )
              })
            }
          </div>
        </div>
            {
              loading && (
                <Loading/>
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
