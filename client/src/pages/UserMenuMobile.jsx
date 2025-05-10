import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoMdClose } from "react-icons/io";


const UserMenuMobile = () => {
  return (
    <section className='bg-white h-full w-full py-3' >
      <button onClick={()=>window.history.back()} className='text-neutral-800 block w-fit ml-auto mr-5'>
        <IoMdClose size={25} />
      </button>
      <div className='container mx-auto p-3 px-5'>
        <UserMenu/>
      </div>
    </section>
  )
}

export default UserMenuMobile


// ml-auto: This is the key class that moves the button to the right. The ml-auto class applies margin-left: auto, which causes the button to be pushed as far to the right as possible within its container. In a flex or block layout, ml-auto will create the maximum amount of space on the left, pushing the button to the right.