import React, { useRef, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import successAlert from '../utils/SuccessAlert';
import { IoCloseSharp } from "react-icons/io5";


const EditProductAdmin = ({close, data : propsData, fetchProductData}) => {

    const [data, setData] = useState({
        _id: propsData._id,
        name: propsData.name,
        image: propsData.image,
        category: propsData.category,
        subCategory: propsData.subCategory,
        unit: propsData.unit,
        stock: propsData.stock,
        price: propsData.price,
        discount: propsData.discount,
        description: propsData.description,
        more_details: propsData.more_details || {}
    })
    const [loading, setLoading] = useState(false)
    const [imageViewUrl, setImageViewUrl] = useState("")
    const [viewImageFullScreen, setViewImageFullScreen] = useState(false)
    const [selectCategory, setSelectCategory] = useState("")
    const [slectSubCategory, setSelectSubCategory] = useState("")
    const [openAddField, setOpenAddField] = useState(false)
    const ref = useRef(null)
    // fieldName will be added by AddFieldComponent 
    const [fieldName, setFieldName] = useState("")

    const allCategory = useSelector(state => state.product.allCategory)
    // console.log(allCategory)
    const subCategory = useSelector(state => state.product.subCategory)
    // console.log(subCategory)

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }

    const handleUploadImage = async (e) => {
        try {
            const file = e.target.files[0]

            if (!file) {
                return
            }
            setLoading(true)

            // console.log(file)
            const uploadImageResponse = await uploadImage(file)
            const { data: imageResponse } = uploadImageResponse
            const imageUrl = imageResponse.data.url
            // console.log(imageResponse)
            setData((prev) => {
                return {
                    ...prev, image: [...prev.image, imageUrl]
                }
            })


        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleDeleteImage = async (index) => {
        data.image.splice(index, 1)
        setData((prev) => {
            return {
                ...prev
            }
        })
    }

    const handleRemoveCategory = (index) => {
        data.category.splice(index, 1)
        setData((prev) => {
            return {
                ...prev
            }
        })
    }

    const handleRemoveSubCategory = (index) => {
        data.subCategory.splice(index, 1)
        setData((prev) => {
            return {
                ...prev
            }
        })
    }

    // This function to make the first option disabled when click the select first time 
    const makeDisabledFirstOption = () => {
        ref.current.disabled = true
    }

    // This function will add field to more_details object in data object. That will come from AddFieldComponent 
    const handleAddField = () => {
        try {
            if (!fieldName.trim()) {
                return
            }
            setData((prev) => {
                return {
                    ...prev, more_details: { ...prev.more_details, [fieldName]: "" }
                }
            })
            setFieldName("")
            setOpenAddField(false)
            // data will not be updated real time due to async nature of useState 
            // console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            e.stopPropagation()
            // console.log(data)
            // make api request 
            const response = await Axios({
                ...SummaryApi.updateProductDetails,
                data: data
            })

            // destructuring data 
            const { data: responseData } = response
            console.log(responseData)

            // checking status 
            if (responseData.success) {
                successAlert(responseData.message)
                // toast.success(responseData.message)
                setData({
                    name: "",
                    image: [],
                    category: [],
                    subCategory: [],
                    unit: "",
                    stock: "",
                    price: "",
                    discount: "",
                    description: "",
                    more_details: {}
                })
                if(close){
                    close()
                }
                fetchProductData()
            }

        } catch (error) {
            toast.error(error.response.data.message)
            // console.log("error is ", error)
        }
    }


    return (
        <section className='fixed top-0 right-0 bottom-0 left-0 bg-slate-300 z-50 p-4' >
            <div className='bg-white w-full p-4 max-w-2xl mx-auto overflow-y-auto h-full max-h-[95vh]'>
                <section>
                    <div className='p-2 bg-white shadow-md flex items-center justify-between '>
                        <h2 className='font-semibold'>Update Product</h2>
                        <button className='cursor-pointer' onClick={close}><IoCloseSharp size={25} /></button>
                    </div>

                    {/* Form to display the product  */}
                    <div className='grid p-3 '>
                        <form className='grid gap-2' onSubmit={handleSubmit} >
                            {/* Name input */}
                            <div className='grid gap-1'>
                                <label htmlFor='name' className='font-medium' >Name</label>
                                <input type="text" name="name" id="name" placeholder='Enter Product Name' value={data.name} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border border-blue-200 rounded focus-within:border-amber-200' />
                            </div>
                            {/* Description input  */}
                            <div className='grid gap-1'>
                                <label htmlFor='description' className='font-medium' >Description</label>
                                {/* resize-none class don't allow it to be resizeable  */}
                                <textarea name="description" id="description" placeholder='Enter Product Description' value={data.description} onChange={handleChange} required rows={3} className='bg-blue-50 p-2 outline-none border border-blue-200 rounded focus-within:border-amber-200 resize-none'> </textarea>
                            </div>
                            {/* Image Input and preview  */}
                            <div>
                                <p>Image</p>
                                <div>
                                    <label htmlFor='image' className='bg-blue-50 h-24 border border-blue-200 rounded flex justify-center items-center cursor-pointer font-medium'>
                                        <div className=' flex justify-center items-center flex-col'>
                                            <FaCloudUploadAlt size={35} />
                                            <p className={`${loading && "text-green-600"}`}>
                                                {
                                                    loading ? (
                                                        <LoadingSpinner />
                                                    ) : "Upload Image"
                                                }
                                            </p>

                                        </div>
                                        <input type="file" name="image" id="image" accept='image/*' className='hidden' onChange={handleUploadImage} />
                                    </label>

                                    <div className=' mt-2 flex gap-2 flex-wrap'>
                                        {/* Uploaded images will be displayed here  */}
                                        {
                                            data.image.map((image, index) => {
                                                return (
                                                    // hidden group-hover:block important css classes we give group class to parent and after that we can group hover to do something. In this case if I hover on parent then the properties added through group:hover will be added to the child
                                                    <div key={image + index} className='h-20 w-20 min-w-2 bg-blue-50 border border-blue-100 cursor-pointer relative py-2 group'>
                                                        <img src={image} alt="Image" className='w-full h-full object-scale-down' onClick={() => {
                                                            setImageViewUrl(image)
                                                            setViewImageFullScreen(true)
                                                        }} />
                                                        <div className='absolute bottom-0 right-0 bg-red-500 rounded-full p-1 hover:bg-red-600 hidden group-hover:block' onClick={() => handleDeleteImage(index)}>
                                                            <MdDelete size={20} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* category input  */}
                            <div className='grid gap-1'>
                                <label htmlFor="" className='font-medium'>Category</label>
                                <div>
                                    <select name="" id="" className='bg-blue-50 border border-blue-100 rounded p-2 w-full ' value={selectCategory} onChange={(e) => {
                                        const value = e.target.value
                                        const category = allCategory.find(el => el._id === value)
                                        if (data.category.some(cat => cat._id === value)) {
                                            return;
                                        }

                                        setData((prev) => {
                                            return {
                                                ...prev, category: [...prev.category, category]
                                            }
                                        })
                                        console.log("category is ", data.category)
                                        setSelectCategory("")

                                    }} >
                                        <option value="">Select Category</option>
                                        {
                                            allCategory.map((cat, index) => {
                                                return (
                                                    <option key={index} value={cat._id}>{cat.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        {
                                            data.category.map((c, index) => {
                                                return (
                                                    <div key={c._id + index} className='flex items-center gap-1 bg-blue-50 mt-2' >
                                                        <p>{c.name}</p>
                                                        <button onClick={() => handleRemoveCategory(index)}><IoClose size={20} /></button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* sub category part */}
                            <div className='grid gap-1'>
                                <label htmlFor="" className='font-medium'>Sub Category</label>
                                <div>
                                    <select onClick={makeDisabledFirstOption} name="" id="" className='bg-blue-50 border border-blue-100 rounded p-2 w-full ' value={slectSubCategory} onChange={(e) => {
                                        const value = e.target.value
                                        const subCat = subCategory.find(el => el._id === value)
                                        if (data.subCategory.some(cat => cat._id === value)) {
                                            return;
                                        }

                                        setData((prev) => {
                                            return {
                                                ...prev, subCategory: [...prev.subCategory, subCat]
                                            }
                                        })
                                        console.log("category is ", data.subCategory)
                                        setSelectSubCategory("")

                                    }} >
                                        <option ref={ref} value="">Select Sub Category</option>
                                        {
                                            subCategory.map((subcat, index) => {
                                                return (
                                                    <option key={index} value={subcat._id}>{subcat.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        {
                                            data.subCategory.map((subcat, index) => {
                                                return (
                                                    <div key={subcat._id + index} className='flex items-center gap-1 bg-blue-50 mt-2' >
                                                        <p>{subcat?.name}</p>
                                                        <button onClick={() => handleRemoveSubCategory(index)}><IoClose size={20} /></button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* Unit  */}
                            <div className='grid gap-1'>
                                <label htmlFor='unit' className='font-medium' >Unit</label>
                                <input type="text" name="unit" id="unit" placeholder='Enter Product Unit' value={data.unit} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border border-blue-200 rounded focus-within:border-amber-200' />
                            </div>
                            {/* stock  */}
                            <div className='grid gap-1'>
                                <label htmlFor='stock' className='font-medium' >Stock</label>
                                <input type="text" name="stock" id="stock" placeholder='Enter Product Stock' value={data.stock} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border border-blue-200 rounded focus-within:border-amber-200' />
                            </div>
                            {/* price */}
                            <div className='grid gap-1'>
                                <label htmlFor='price' className='font-medium' >Price</label>
                                <input type="number" name="price" id="price" placeholder='Enter Product Price' value={data.price} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border border-blue-200 rounded focus-within:border-amber-200' />
                            </div>
                            {/* discount  */}
                            <div className='grid gap-1'>
                                <label htmlFor='discount' className='font-medium' >Discount</label>
                                <input type="number" name="discount" id="discount" placeholder='Enter Product Discount' value={data.discount} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border border-blue-200 rounded focus-within:border-amber-200' />
                            </div>

                            {/* dispalying added field  */}
                            {
                                Object?.keys(data?.more_details).map((key, index) => {
                                    return (
                                        <div key={index} className='grid gap-1'>
                                            <label htmlFor={key} className='font-medium' > {key} </label>
                                            <input type="text" id={key} placeholder={`Enter Product ${key}`} value={data.more_details[key]} onChange={(e) => {
                                                const value = e.target.value
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        more_details: {
                                                            ...prev.more_details,
                                                            [key]: value
                                                        }
                                                    }
                                                })
                                            }} required className='bg-blue-50 p-2 outline-none border border-blue-200 rounded focus-within:border-amber-200' />
                                        </div>
                                    )
                                })
                            }


                            {/* Add more button  */}
                            <div onClick={() => setOpenAddField(true)} className=' bg-amber-300 py-1 px-3 w-38 text-center rounded font-semibold cursor-pointer hover:bg-amber-400 ' >
                                Add More Field
                            </div>

                            {/* button to submit  */}
                            <button className='bg-green-500 py-1 px-3 mt-4 text-center rounded font-semibold cursor-pointer hover:bg-green-600 ' type='submit' >Update Product</button>
                        </form>
                    </div>

                    {
                        viewImageFullScreen && <ViewImage url={imageViewUrl} close={() => setViewImageFullScreen(false)} />
                    }

                    {
                        openAddField && (
                            <AddFieldComponent close={() => setOpenAddField(false)} value={fieldName} onChange={(e) => setFieldName(e.target.value)} submit={handleAddField} />
                        )
                    }
                </section>
            </div>
        </section>
    )
}

export default EditProductAdmin









