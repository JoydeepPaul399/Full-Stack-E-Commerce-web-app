import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'
// This function is to make some routes as protected routes. I will wrap this component in route folder index.js file component routes
const AdminPermission = ({children}) => {
    const user= useSelector(state=>state.user)

    
  return (
    <>
        {
            isAdmin(user.role) ? children :  <p className='text-red-600 bg-red-100 p-4'>You don't have the permission</p>
        }
    </>
  )
}

export default AdminPermission
