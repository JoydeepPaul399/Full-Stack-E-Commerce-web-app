import React from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <div className='bg-red-200 w-full max-w-md p-4 py-6 mx-auto mt-4 flex flex-col justify-center items-center gap-4'>
      <p className='text-red-900 text-lg font-bold text-center'>Order canceled</p>
      <Link to={"/"} className='border border-green-900 px-4 py-1 rounded-lg text-green-900 cursor-pointer hover:bg-green-900 hover:text-white transition-all ' >Go To Home</Link>
    </div>
  )
}

export default Cancel
