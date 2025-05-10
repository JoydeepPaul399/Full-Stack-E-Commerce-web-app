import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from "../utils/AxiosToastError"

const EditCategory = ({close, fetchData, data: CategoryData}) => {

    const [data, setData]= useState({
        categoryId: CategoryData._id, 
        name: CategoryData.name,
        image: CategoryData.image
      })
    
      const [loading, setLoading]= useState(false)
      const [ImgLoading, setImgLoading]= useState(false)
    
      const handleOnChange= (e)=>{
        const {name, value}= e.target
        setData((prev)=>{
          return {
            ...prev, [name]: value
          }
        })
      }

    const handleSubmit= async (e)=>{
        e.preventDefault()
        try {
          setLoading(true)
          console.log("data submitting ")
    
          // sending data to backend
          const response= await Axios({
            ...SummaryApi.updateCategory,
            data: data
          })
    
          const {data: responseData}= response
          
          if(responseData.success){
            toast.success(responseData.message)
            close()
            fetchData()
          }

          console.log("data submitted")
    
    
        } catch (error) {
          console.log(error)
          toast.error(error.response.data.message)
        }
        finally{
          setLoading(false)
        }
    
      }

    const handleUploadCategoryImage= async (e)=>{
        try {
            const file= e.target.files[0]
        if(!file){
          return
        }
        setImgLoading(true)

        

        console.log("ready to upload")
        
        // uploading image to cloudinary 
        const response= await uploadImage(file)
    
        const {data: imageResponse}= response
    
        setData((prev)=>{
          return {
            ...prev,
            image: imageResponse.data.url
          }
        })

        console.log("uploaded")
        } catch (error) {
            console.log(error)
        }
        finally{
            setImgLoading(false)
        }
    
    
      }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-30 flex justify-center items-center' >
          <div className='bg-white max-w-4xl p-4 w-full rounded '>
    
            <div className='flex items-center justify-between'>
              <h1 className='font-semibold'>Update Category</h1>
              {/* w-fit block ml-auto classes can be used to send the button to right end */}
              <button onClick={close} className='cursor-pointer w-fit block ml-auto' >
                <IoClose size={25} />
              </button>
            </div>
    
            <form className='my-3 grid gap-2' onSubmit={handleSubmit} >
    
              <div className='grid gap-1'>
                <label htmlFor="categoryName">Name</label>
                <input type="text" name="name" id="categoryName" placeholder='Enter Category Name' value={data.name} onChange={handleOnChange} className='bg-blue-50 p-2 border border-blue-100 focus-within:border-amber-400 outline-none rounded' />
              </div>
    
              <div>
                <p>Images</p>
                <div className='flex gap-4 flex-col items-center lg:flex-row'>
                  <div className=' bg-blue-50 h-55 w-full lg:w-36 flex items-center justify-center rounded '>
                    {
                      data.image ? (
                        <img src={data.image} alt="Category Image" className='w-full h-full object-cover' />
                      ) : (
    
                        <p className='text-sm text-neutral-500 '>No Image</p>
                      )
                    }
                  </div>
                  <label htmlFor="uploadCategoryImage">
                    <div  className={`
                    ${data.name ? "bg-green-400" : "bg-gray-200"} px-4 py-2 rounded cursor-pointer`} >
                        {
                            ImgLoading ? "Loading" : "Upload Image"
                        }
                    </div>
                    <input disabled={!data.name} onChange={handleUploadCategoryImage} type="file" name="uploadCategoryImage" id="uploadCategoryImage" className='hidden' />
                  </label>
                </div>
              </div>
    
              <button disabled= {ImgLoading} className={`
              ${data.name && data.image ? "bg-amber-400": "bg-slate-200"} py-2 font-semibold cursor-pointer hover:bg-amber-500 ${ImgLoading ? "bg-gray-200": "bg-amber-400"}
                ` } >
                    {
                            loading ? "Uploading" : "Update Category"
                    }
                </button>
    
            </form>
    
          </div>
          
        </section>
  )
}

export default EditCategory
