import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className="h-8 w-8 border-4 border-blue-300 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingSpinner
