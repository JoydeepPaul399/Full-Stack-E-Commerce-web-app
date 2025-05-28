import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../provider/GlobalProvider'
import NoData from '../components/NoData'

const MyOrders = () => {
  const orders= useSelector(state=>state.orders.order)

  console.log(orders)
  return (
    <div>
      <div className='bg-white shadow-md p-4 font-semibold'>
        <h1>Order</h1>
      </div>
      {
        !orders[0] && (
          <NoData/>
        )
      }
      {
        orders.map((order, index)=>{
          return (
            <div key={index} className='rounded p-4 my-2 bg-blue-100' >
              <p className='text-sm'>Order No: {order?.orderId}</p>
              <div className='flex gap-3'>
                <img src={order.product_details.image[0]} className='w-14 h-14' alt="product" />
                <p className='font-medium'>{order.product_details.name}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default MyOrders
