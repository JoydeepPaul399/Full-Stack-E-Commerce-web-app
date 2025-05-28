import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider';


const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress]= useState(false)
  const [openEdit, setOpenEdit]= useState(false)
  const [editData, setEditData]= useState({

  })
  const {fetchAddress}= useGlobalContext()

  const handleDisableAddress= async (id)=>{
    try {
      const response= await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })

      if(response.data.success){
        toast.success("Address removed")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div>
      <div className='bg-white shadow-lg px-2 py-2 my-2 flex justify-between items-center gap-4'>
        <h2 className='font-semibold'>Address</h2>
        <button className=' border border-amber-300 px-4 py-1 rounded hover:bg-amber-400' onClick={()=>setOpenAddress(true)}>Add Address</button>
      </div>
      <div className='bg-blue-50 grid gap-4' >
        {
          addressList.map((address, index) => {
            return (
                <div key={index} className={`border rounded bg-blue-100 border-blue-200 p-3 flex gap-3 hover:bg-blue-200 group ${!address.status && 'hidden'} `}>
                  
                  <div className='w-full '>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country}-{address.pincode}</p>
                    <p>{address.mobile}</p>
                  </div>

                  <button onClick={()=>{
                    setOpenEdit(true)
                    setEditData(address)
                  }} className=' hover:bg-green-300 h-fit rounded'>
                    <MdEdit size={25}/>
                  </button>
                  <button onClick={()=>handleDisableAddress(address._id)} className=' h-fit hover:bg-red-400 rounded'>
                    <MdDelete size={25} />
                  </button>
                </div>
            )
          })
        }
        
      </div>

      {
        openAddress && (
          <AddAddress close={()=>setOpenAddress(false)}/>
        )
      }

      {
        openEdit && (
          <EditAddressDetails close={()=>setOpenEdit(false)} data={editData} />
        )
      }
    </div>
  )
}

export default Address
