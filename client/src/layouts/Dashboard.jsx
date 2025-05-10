import React from 'react'
import { Outlet } from 'react-router-dom'
import UserMenu from '../components/UserMenu'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  // const user= useSelector(state=> state.user)
  return (
    <section className='bg-white'>
        <div className='container mx-auto p-3 lg:flex'>
            {/* Left part for the menu  */}
            {/* top-24 because of the header we set h-24. So when the top will be 24 it will be stricked to the top of the header */}
            <div className='w-[20%] py-4 sticky top-24 hidden lg:block border-r border-gray-200 max-h-[calc(100vh-120px)]'>
              <UserMenu/>
            </div>

          {/* Right part for the content  */}
            <div className='bg-white w-[100%] min-h-[74vh] px-5'>
              {/* I need to add outlet because the dashboard is a parent component and the child components are myorders and address. So I need to add outlet here to show the child components.  */}
              <Outlet/>
            </div>
        </div>
    </section>
  )
}

export default Dashboard
