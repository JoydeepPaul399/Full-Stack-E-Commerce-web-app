import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { updateAvatar } from '../store/userSlice';
import { IoClose } from "react-icons/io5";


const UserProfileAvatarEdit = ({close}) => {
    const user= useSelector((state)=>state.user)
    const [loading, setLoading]= useState(false)
    const dispatch= useDispatch()

    const handleUploadAvatarImage= async (e)=>{
        const file = e.target.files[0]
        const formData= new FormData()

        if(!file){
            return
        }

        formData.append('avatar', file)
        try{
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData
            })
            const {data: responseData}= response
            dispatch(updateAvatar(responseData.data.avatar))
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoading(false)
        }
        

    }
  return (
    <div>
        {/* following class to make the page fixed. Proper way to make it 100% with screen height and width.  */}
      <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-200 flex items-center justify-center'>
        <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col justify-center items-center opacity-[1] '>
            <button onClick={close} className='w-fit block ml-auto text-neutral-800 cursor-pointer'>
                <IoClose size={20} />
            </button>
            <div className='w-16 h-16 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                    user.avatar ? (
                    <img src= {user.avatar} alt={user.name} className='w-full h-full' />
                    ) : (
                    <FaRegUserCircle size={60} />
                    )
                }
            </div>
            <form onSubmit={(e)=>e.preventDefault()}>
                <label htmlFor="uploadProfile">
                    <div className='border border-amber-600 hover:bg-amber-600 px-4 py-1 rounded text-sm my-3 cursor-pointer'>
                        {
                            loading ? "uploading..." : "Upload"
                        }
                    </div>
                </label>
                <input onChange={handleUploadAvatarImage} type="file" name="image" id="uploadProfile" className='hidden' />
            </form>
            
        </div>
      </section>
    </div>
  )
}

export default UserProfileAvatarEdit
