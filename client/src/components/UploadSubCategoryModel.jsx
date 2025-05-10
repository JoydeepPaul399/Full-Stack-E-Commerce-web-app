import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';



const UploadSubCategoryModel = ({close, fetchData}) => {
    const [subCategoryData, setSubCategoryData]= useState({
        name: "",
        image: "",
        category: []
    })
    const [loading, setLoading]= useState(false)

    const allCategory= useSelector(state=>state.product.allCategory)
    console.log("All category is ", allCategory)

    const handleChange= (e)=>{
        const {name, value}= e.target
        setSubCategoryData((prev)=>{
            return {
                ...prev, [name]: value
            }
        })
    }

    const handleUploadSubCategoryImage= async (e)=>{
        try{
            const file= e.target.files[0]

        if(!file){
            return
        }
        setLoading(true)
        const response = await uploadImage(file)

        const {data: ImageResponse }= response

        setSubCategoryData((prev)=>{
            return {
                ...prev, image: ImageResponse.data.url
            }
        })
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    console.log("Sub Category Data is ", subCategoryData)

    // Function to remove the selected category
    const handleRemoveCategorySelected= (categoryId)=>{
        // const index= subCategoryData.category.findIndex(el=> el._id ===categoryId)
        
        // setSubCategoryData(subCategoryData.category.splice(index, 1))
        const newCategory= subCategoryData.category.filter((cat)=>cat._id !==categoryId)
        setSubCategoryData({...subCategoryData, category: [...newCategory]})
    }

    const handleSubmitSubCategory= async (e)=>{
        e.preventDefault()
        e.stopPropagation()
        try{
            const response= await Axios({
                ...SummaryApi.createSubCategory,
                data: subCategoryData
            })

            const { data: responseData}= response
            console.log("response Data ", responseData)
            if(responseData.success){
                toast.success(responseData.message)
                // if close function is availabe than call it 
                if(close){
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.response.message)
        }
        
    }


  return (
    <section className='fixed top-0 left-0 right-0 bottom-0 z-50 bg-neutral-200 flex items-center justify-center '>
      <div className='w-full max-w-5xl bg-white p-4 rounded'>
        <div className='flex justify-between items-center gap-3'>
            <h1 className='font-semibold'>Add Sub Category</h1>
            <button onClick={close} className='cursor-pointer'><IoCloseSharp size={22} /></button>
        </div>

        <div>
            <form className='my-4 grid gap-3' onSubmit={handleSubmitSubCategory} >
                    <div className='grid gap-1'>
                        <label htmlFor="name">Name</label>
                        <input type="text" id='name' name='name' value={subCategoryData.name} onChange={handleChange} className='p-2 bg-blue-50 border border-blue-50 outline-none focus-within:border-amber-400 rounded' placeholder='Enter the Sub Category' />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex items-center flex-col gap-3 lg:flex-row'>
                            <div className='border border-blue-100 min-h-56 w-full lg:w-36 bg-blue-50 flex justify-center items-center'>
                                {
                                    !subCategoryData.image ? (
                                        <p className='text-sm text-neutral-600'>No Image</p>
                                    ) : (
                                        <img src={subCategoryData.image} alt="Image" />
                                    )
                                }
                            </div>
                            <label htmlFor="uploadSubCategoryImage">
                                <div className='px-4 py-1 border border-amber-400 text-amber-400 rounded cursor-pointer hover:text-black hover:bg-amber-500'>Upload Image</div>
                            </label>
                            <input type="file" name="uploadSubCategoryImage" id="uploadSubCategoryImage" className='hidden' onChange={handleUploadSubCategoryImage} />
                        </div>

                        {
                            loading && <p className='text-green-400'>Uploading! Please wait</p>
                        }
                    </div>

                    

                    <div className='grid gap-1'>
                        <label htmlFor="">Select Category</label>
                        <div className='border focus-within:border-amber-400 rounded'>
                        {/* Display values  */}
                        <div className='flex flex-wrap gap-2'>
                            {
                                subCategoryData.category.map((cat, index)=>{
                                    return (
                                        <div className='bg-white shadow-md px-1 m-1 flex items-center gap-1' key={cat._id} >{cat.name}
                                            <div onClick={()=>handleRemoveCategorySelected(cat._id)} className='cursor-pointer'><IoClose size={20} /></div>
                                        </div>
                                        
                                    )
                                })
                            }
                        </div>
                        {/* Select category  */}
                        <select className='w-full p-2 bg-transparent outline-none' name="" id="" onChange={(e)=>{
                            const value= e.target.value
                            // if same item be present in the subCategoryData.category then it exit 
                            if (subCategoryData.category.some(cat => cat._id === value)) {
                                return;
                            }
                            const categoryDetails= allCategory.find(el=>el._id == value)
                            setSubCategoryData((prev)=>{
                                return {
                                    ...prev, category: [...prev.category, categoryDetails]
                                }
                            })
                        }}>
                            
                            {/* <option value={""} disabled>Select Category</option> */}
                            <option value={""}>Select Category</option>
                            {
                                allCategory.map((category, index)=>{
                                    return (
                                        <option key={index} value={category?._id}>{category?.name}</option>
                                    )
                                })
                            }
                        </select>
                        </div>
                    </div>
                    <button type='submit' className={`px-4 py-1 border border-gray-200 rounded cursor-pointer ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? 'bg-amber-500 hover:bg-amber-600' : "bg-gray-200" } font-semibold`}>Submit</button>
            </form>
        </div>
      </div>
    </section>
  )
}

export default UploadSubCategoryModel
