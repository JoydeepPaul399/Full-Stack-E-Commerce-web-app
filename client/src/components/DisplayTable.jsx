import React from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table'

const DisplayTable = ({ data, column }) => {

    const table = useReactTable({
        data,
        columns: column,
        getCoreRowModel: getCoreRowModel(),
      })
      

  return (
    <div>

<table className='w-full py-0 px-0 border-collapse'>
        <thead className='bg-black text-white '>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              <th>Sr. </th>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='border border-blue-200 whitespace-nowrap'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id}>
              <td className='border border-blue-200 px-2 py-2' key={index}>{index+1}</td>
              {row.getVisibleCells().map(cell => (
                <td className='border border-blue-200 px-2 py-2 ' key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        
      </table>
      


    </div>
  )
}

export default DisplayTable
