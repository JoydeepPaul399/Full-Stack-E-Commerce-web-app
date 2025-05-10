import React from 'react'
import { IoClose } from "react-icons/io5";


const ViewImage = ({url, close}) => {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-300 flex justify-center items-center z-50'>
        <div className='w-full max-w-md max-h-[90vh] p-4 bg-white  '>
            <button onClick={close} className='w-fit ml-auto block cursor-pointer' >
                <IoClose size={25} />
            </button>
            <img src={url}  alt="Image" className=' w-full h-full object-scale-down' />
        </div>
      
    </div>
  )
}

export default ViewImage
