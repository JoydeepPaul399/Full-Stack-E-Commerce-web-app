import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllCategory } from '../store/productSlice'

const CategoryPage = () => {
  const user= useSelector(state=>state.user)
  const navigate= useNavigate()
  useEffect(()=>{
    if(user.role!=="ADMIN"){
      navigate("/")
    }
  })
  const [openUploadCategory, setOpenUploadCategory]= useState(false)
  const [loading, setLoading]= useState(false)
  const [categoryData, setCategoryData]= useState([])
  const [openEdit, setOpenEdit]= useState(false)
  const [editData, setEditData]= useState({
    name: "",
    image: ""
  })

  const dispatch= useDispatch()
  
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete]= useState(false)
  const [deleteCategory, setDeleteCategory]= useState({
    _id: ""
  })
  const allCategory= useSelector(state=>state.product.allCategory)

  useEffect(()=>{
    setCategoryData(allCategory)
  }, [allCategory])

  // console.log("All Category redux is ", allCategory)

  // Following function I will use only for uploadCategoryModel component 
  const fetchCategory= async ()=>{
    try {
      setLoading(true)
      const response= await Axios({
        ...SummaryApi.getCategory
      })

      const {data: responseData}= response
      console.log(responseData)

      if(responseData.success){
        setCategoryData(responseData.data)
        dispatch(setAllCategory(responseData.data))
      }
      // console.log("Category data to be displayed ",categoryData)

      
    } 
    catch (error) {
      
    }
    finally{
      setLoading(false)
    }
  }

  // useEffect(()=>{
  //   fetchCategory()
  // }, [])

  // useEffect(()=>{
  //   console.log(categoryData)

  // }, [categoryData])

  const handleDeleteCategory= async ()=>{
    try {
      console.log("deleteCategory is ", deleteCategory)
      const response= await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory
      })

      console.log("response something bad in request please check", response)

      if(response.data.success){
        toast.success(response.data.message)
        fetchCategory()
        setOpenConfirmBoxDelete(false)
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("The error is ", error)
      console.log(error.response.data.message)
      toast.error(error.response.data.message)
      setOpenConfirmBoxDelete(false)
    }
  }


  return (
    <section>
        <div className='p-2 bg-white shadow-md flex items-center justify-between '>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border border-amber-400 hover:bg-amber-500 px-3 py-1 rounded cursor-pointer'>Add Category</button>
        </div>

        {
          !categoryData[0] && !loading && (
            <NoData/>
          )
        }

        <div className='p-4 grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-2 justify-center'>
          {
            categoryData.map((category, index)=>{
              return (
                <div key={index} className='w-40 h-70 object-scale-down overflow-hidden bg-[#edf4ff] m-2 p-2 rounded shadow group cursor-pointer' >
                  <img src={category.image} alt={category.name} className='w-36 object-scale-down' />
                  <div className='items-center justify-center gap-2 h-9 hidden group-hover:flex' >
                    <button onClick={()=>{
                      setOpenEdit(true)
                      setEditData(category)
                    }} className='flex-1 bg-green-100 text-green-600 font-medium py-1 cursor-pointer rounded my-2 hover:bg-green-200'>Edit</button>
                    <button onClick={()=>{
                      setOpenConfirmBoxDelete(true)
                      // might give an error 
                      setDeleteCategory(category)
                    }} className='flex-1 bg-red-100 text-red-600 font-medium py-1 cursor-pointer rounded my-2 hover:bg-red-200'>Delete</button>
                  </div>
                </div>
              )
            })
          }
        </div>


        {
          loading && (
            <Loading/>
          )
        }


        {
          openUploadCategory && <UploadCategoryModel fetchData= {fetchCategory} close={()=>setOpenUploadCategory(false)}/>
        }

        {
          openEdit && (
            // sending setOpenEdit so that we can close this edit category component 
            <EditCategory data={editData} close= {()=>setOpenEdit(false)} fetchData= {fetchCategory} />
          ) 
        }

        {
          openConfirmBoxDelete && (
            <ConfirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory} />
          )
        }
        
    </section>
  )
}

export default CategoryPage
