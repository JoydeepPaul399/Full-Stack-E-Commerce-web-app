import React from 'react'
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({cancel, confirm, close}) => {
  return (
    <div className='fixed top-0 left-0 bottom-0 right-0 z-50 bg-neutral-500 flex justify-center items-center '>
      <div className='bg-white w-full max-w-md p-4 rounded  '>
        <div className='flex justify-between items-center gap-3'>
            <h5 className='font-semibold'>Delete Permanently</h5>
            <button className='cursor-pointer' onClick={close}>
                <IoClose size={25} />
            </button>
        </div>

        <p className='mt-2 mb-4'>Are You sure to delete it permanently?</p>

        {/* w-fit ml-auto these can be used to push an element to right  */}
        <div className='w-fit ml-auto flex items-center gap-3'>
            <button onClick={cancel} className='px-3 py-1 font-semibold border rounded cursor-pointer border-green-500 text-green-500 hover:bg-green-600 hover:text-white  '>Cancel</button>
            <button onClick={confirm} className='px-3 py-1 font-semibold border rounded cursor-pointer border-red-500 text-red-500 hover:bg-red-600 hover:text-white  '>Confirm</button>
        </div>

      </div>
    </div>
  )
}

export default ConfirmBox
