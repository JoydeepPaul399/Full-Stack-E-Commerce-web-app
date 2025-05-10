import React, { useEffect } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../components/Loading'
import SummaryApi from '../common/SummaryApi'
import { setAllCategory, setLoadingCategory } from '../store/productSlice'
import Axios from '../utils/Axios'
import { convertToUrl } from '../utils/convertToUrl'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory= useSelector(state=> state.product.loadingCategory)
  const dispatch= useDispatch()
  const categoryData= useSelector(state=>state.product.allCategory)
  const subCategoryData= useSelector(state=>state.product.subCategory)
  const navigate= useNavigate()

  const handleRedirectProductListPage= (id, catName)=>{
    console.log(id, catName)
    // console.log(subCategoryData)
    const subcategory= subCategoryData.find(sub=>{
      // console.log(sub)
     const filterData= sub.category.some(c=>{
      return c._id ==id
     })
    //  When the callback returns true, .find() returns the entire sub object that matched, and assigns it to subcategory.
     return filterData ? true : null
    })

    console.log(subcategory)

    const url= `/${convertToUrl(catName)}-${id}/${convertToUrl(subcategory.name)}-${subcategory._id}`
    // console.log(url)
    navigate(url)


  }

  const fetchCategory= async ()=>{
    try {
      // setLoading(true)
      dispatch(setLoadingCategory(true))
      const response= await Axios({
        ...SummaryApi.getCategory
      })

      const {data: responseData}= response
      // console.log(responseData)

      if(responseData.success){
        // setCategoryData(responseData.data)
        dispatch(setAllCategory(responseData.data))
      }
      // console.log("Category data to be displayed ",categoryData)

      
    } 
    catch (error) {
      console.log(error)
    }
    finally{
      // setLoading(false)
      dispatch(setLoadingCategory(false))
    }
  }

  // categoryData
  
  useEffect(()=>{
    fetchCategory()
  }, [])

  
 

  return (
    <section className='bg-white'>
      <div className='min-h-48 slate-200 container mx-auto rounded '>
        <div className={`w-full min-h-48 bg-blue-100 ${!banner && "animate-pulse"}`}>
          <img src={banner} alt="Banner Image" className='w-full h-full hidden lg:block' />
          <img src={bannerMobile} alt="Banner Image" className='w-full h-full lg:hidden' />
        </div>
      </div>

      <div className='container mx-auto px-4 my-2 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
        {/* This is for loading animation */}
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index)=>{
              return (
                <div className='bg-white rounded p-4 min-h-36 grid gap-2 shadow-md animate-pulse ' key={index}>
                  <div className='bg-blue-100 min-h-20 rounded'></div>
                  <div className='bg-blue-100 h-8 rounded'></div>
                  {/* <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-blue-100 h-8 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div> */}
                </div>
              )
            })
          )

          : (
            // displaying category product 
            categoryData.map((cat, index)=>{
              return (
                <div key={index} className='w-full h-full' onClick={()=>handleRedirectProductListPage(cat._id, cat.name)} >
                  <div>
                    <img src={cat.image} className='w-full h-full object-scale-down' />
                  </div>
                </div>
              )
            })
            
          )
          
        }
      </div>

      {/* Display category product  */}
      {
        categoryData.map((c, index)=>{
          return (
            <CategoryWiseProductDisplay key={index} id={c?._id} name={c?.name} />
          )
        })
      }
    </section>
  )
}

export default Home
