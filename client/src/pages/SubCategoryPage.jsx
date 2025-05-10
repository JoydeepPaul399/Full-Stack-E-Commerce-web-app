import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { BsPencil } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import axios from 'axios'



const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory]= useState(false)
  // this data will be used to store subCategory which will be fetched from the server
  const [data, setData]= useState([])
  const [loading, setLoading]= useState(false)
  const [imageUrl, setImageUrl]= useState("")
  const [openEdit, setOpenEdit]= useState(false)
  const [editData, setEditData]= useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory]= useState({
    _id: ""
  })
  const [openDeleteConfirmBox, setDeleteConfirmBox]= useState(false)

  const fetchSubCategory= async ()=>{
    try {
      setLoading(true)
      const response= await Axios({
        ...SummaryApi.getSubCategory
      })

      const {data: responseData}= response
      // console.log(responseData)
      if(responseData.success){
        setData(responseData.data)
      }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubCategory()
  }, [])

  // api to delete the sub category 
  const handleDeleteSubCategory= async ()=>{
    try {
      const response= await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData }= response

      if(responseData.success){
        toast.success(responseData.message)
        setDeleteConfirmBox(false)
        fetchSubCategory()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }
  // console.log("subcategory data is ", data)

  // following is to use tenstack table 
  const columnHelper = createColumnHelper()

  // This variable will hold the table column's names that will be passed to displaytable component in order to show the table 
  const column= [
    columnHelper.accessor('name',{
      header: "Name"
    }),

    columnHelper.accessor('image', {
      header: "Image",
      cell: ({row})=>{
        // console.log("row", row.original.image)
        return <div className='flex justify-center items-center'>
          <img src={row.original.image} alt="Image" className='w-8 h-8 cursor-pointer' onClick={()=>setImageUrl(row.original.image)} />
        </div>
      }
    }),

    columnHelper.accessor("category",{
      header: "Category",
      cell: ({row})=>{
        return (
          <>
          {
            row.original.category.map((c, index)=>{
              return (
                <p key={c._id+"table"} className='shadow-md px-1 inline-block' > {c.name} </p>
              )
            })
          }
          </>
        )
      }    
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({row})=>{
        return (
          <div className='flex justify-center items-center gap-3'>
            <button onClick={()=> {
              setOpenEdit(true)
              setEditData(row.original)
            }} className='p-2 bg-green-100 rounded-full hover:text-green-600 cursor-pointer'>
              <BsPencil size={20} />
            </button>
            <button onClick={()=>{
              setDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} className='p-2 bg-red-100 rounded-full hover:text-red-600 cursor-pointer'>
              <MdDelete size={20} />
            </button>
          </div>
        )
      }
    })
  ]

  
  

  
  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between '>
        <h2 className='font-semibold'>Sub Category</h2>
        <button onClick={()=>setOpenAddSubCategory(true)} className='text-sm border border-amber-400 hover:bg-amber-500 px-3 py-1 rounded cursor-pointer'>Add Sub Category</button>
      </div>
      {/* I will display the subCategory table bellow. I will create new component that will use tanstack table to render the react table. link is here https://tanstack.com/table/latest/docs/framework/react/examples/basic */}
      <div>
        <DisplayTable data={data} column= {column} />
      </div>

      {
        openAddSubCategory && <UploadSubCategoryModel fetchData={fetchSubCategory} close={()=>setOpenAddSubCategory(false)}/>
      }

      {
        imageUrl && <ViewImage url={imageUrl} close={()=>setImageUrl("")} />
      }

      {
        openEdit &&  <EditSubCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchSubCategory} />
      }

      {
        openDeleteConfirmBox && (
          <ConfirmBox cancel={()=>setDeleteConfirmBox(false)} close={()=>setDeleteConfirmBox(false)} confirm={handleDeleteSubCategory} />
        )
      }

    </section>
  )
}

export default SubCategoryPage
