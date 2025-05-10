import React from 'react'

const CardLoading = () => {
    // Loading animation 
  return (
    
      <div className='border border-gray-200 w-[90%] mx-auto py-2 lg:p-4 grid gap-1 md:min-w-56 md:p-2 rounded animate-pulse' >
        <div className='min-h-24 mx-2 bg-blue-50 rounded'>
        </div>
        <div className='bg-blue-50 h-4 lg:p-3 rounded w-20'>
        </div>
        <div className='bg-blue-50 lg:p-3 h-8  rounded'>
        </div>
        <div className='bg-blue-50 lg:p-3  rounded w-14'>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <div className='bg-blue-50 lg:p-3 rounded w-20'>
          </div>
          <div className='bg-blue-50 lg:p-3 rounded w-20'>
          </div>
        </div>

      </div>
    
  )
}

export default CardLoading
