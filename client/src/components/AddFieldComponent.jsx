import React from 'react'
import { IoClose } from "react-icons/io5";


const AddFieldComponent = ({close, value, onChange, submit}) => {
  // console.log(value)
  return (
    <section className='fixed top-0 left-0 right-0 bottom-0 bg-slate-300 w-full h-f z-50 flex justify-center items-center p-4' >
        <div className='bg-white rounded p-4  w-full max-w-md'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold' >Add Field</h1>
                <button className='cursor-pointer' onClick={close}><IoClose size={25} /></button>
            </div>
            <input type="text" className='bg-blue-50 p-2 border border-blue-100 rounded outline-none focus-within:border-amber-300 my-2 inline-block w-full' placeholder='Enter Field Name' value={value} onChange={onChange} />
            <button className='bg-amber-400 px-4 py-2 rounded w-fit mx-auto block mt-3 cursor-pointer hover:bg-amber-500 ' onClick={submit} >Add Field</button>
        </div>
    </section>
  )
}

export default AddFieldComponent
