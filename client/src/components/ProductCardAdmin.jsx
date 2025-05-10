import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBox from './ConfirmBox'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({data, fetchProductData}) => {
    // console.log("data is ", data)
    const [editOpen, setEditOpen]= useState(false)
    const [openDeleteConfirm, setOpenDeleteConfirm]= useState(false)
    const [deleteItemId, setDeleteItemId]= useState("")

    const DeleteProduct= async ()=>{
      try {
        const response= await Axios({
          ...SummaryApi.deletProductById,
          data: {
            _id: deleteItemId
          }
        })

        const {data: responseData}= response
        console.log(responseData)
        if(responseData.success){
          toast.success(responseData.message)
          setDeleteItemId("")
          setOpenDeleteConfirm(false)
          if(fetchProductData){
            fetchProductData()
          }
        }
      } catch (error) {
        console.log(error.response.data.mesage || error)
      }
    }
  return (
    <div className='w-36 p-4 bg-white rounded mx-1 my-2'>
        <div>
            <img src={data?.image[0]} alt="Product Image" className='w-full h-full object-scale-down' />
        </div>
        {/* line-clamp-2 makes two lines  */}
        <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
        <div className='flex justify-between items-center '>
            <p className='text-slate-500'>{data?.unit}</p>
            <p className='text-slate-700'>₹{data.price}</p>
        </div>
        <div className='flex justify-between items-center gap-1 mt-4'>
          <button onClick={()=>setEditOpen(true)} className='px-2 rounded py-[2px] font-semibold text-green-800 cursor-pointer bg-green-100 hover:bg-green-200'>Edit</button>
          <button onClick={()=>{setOpenDeleteConfirm(true);
            setDeleteItemId(data._id);
            console.log("delete item id is ", data._id)
          }
          } className='px-2 rounded py-[2px] font-semibold text-white cursor-pointer bg-red-500 hover:bg-red-600'>Delete</button>
        </div>
        {/* Product edit component  */}
        {
          editOpen && <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setEditOpen(false)} />
        }
        {
          openDeleteConfirm && <ConfirmBox cancel={()=>setOpenDeleteConfirm(false)} close={()=>setOpenDeleteConfirm(false)} confirm={DeleteProduct} />
        }        
    </div>
  )
}

export default ProductCardAdmin
