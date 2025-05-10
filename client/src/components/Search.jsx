import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import {TypeAnimation} from 'react-type-animation'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useMobile from '../hooks/useMobile';
import { Link } from 'react-router-dom';




const Search = () => {
    const location= useLocation()
    // Initailly false becuase we have rended this page in header 
    const [isSearchPage, setIsSearchPage]= useState(false)
    const [isMobile]= useMobile()
    const navigate= useNavigate()
    const params= useLocation()
    // console.log(params)
    const searchText= params.search.slice(3)

    useEffect(()=>{
      const isSearch= location.pathname === "/search"
      setIsSearchPage(isSearch)
  }, [location])

    const redirectToSearchPage= ()=>{
        navigate("/search")
    }

    const redirectHomePage= (e)=>{
      // e.stopPropagation() this is stop event bubbling in the dom we have added a event listner in the parent div of the button so child event enteres in parent and also parenet onclick runs. To stop this we used following. 
      e.stopPropagation()
      console.log("home")
      navigate("/")
    }

    const handleOnChange= (e)=>{
      // This value I will extract from searchpage component to make api request 
      const {value}= e.target
      const url= `/search?q=${value}`
      // console.log(value)
      navigate(url)
    }

    

    // console.log(isSearchPage)


  return (
    <div onClick={redirectToSearchPage} className='w-full min-w-[300px] lg:min-w-[420px] rounded-lg border border-gray-300 overflow-hidden flex items-center h-full text-neutral-600 bg-slate-50 cursor-pointer group focus-within:border-yellow-400 '>
      
      {
        (isSearchPage && isMobile)? (
          <button onClick={redirectHomePage} className='flex justify-center items-center h-full p-3 group-focus-within:text-yellow-400 '>
            <IoArrowBackCircleOutline size={30} />   
          </button>  
                 
        ) : (
          <button className='flex justify-center items-center h-full p-3 group-focus-within:text-yellow-400 '>
            <IoSearch size={22} />
          </button>
        )
      }
          
      
      <div className='w-full h-full'>
        {
            !isSearchPage ? (
                // not in search page
                /* we will use react-type animation to change the product in the bellow div npm i react-type-animation  */
                <div className='w-full h-full flex items-center'>
                <TypeAnimation sequence={[
                    "Search 'milk'",1000, "Search 'bread'", 1000, "Search 'sugar'", 1000, "Search 'panner'", 1000, "Search 'chocolate'", 1000, "Search 'curd'", 1000, "Search 'rice'", 1000, "Search 'egg'", 1000, "Search 'chips'", 1000
                ]} 
                wrapper='span'
                speed={50}
                repeat={Infinity}
                style={{fontSize: '1em', display: 'inline-block'}} />
                </div>
            )
            :(
                <div className='w-full h-full'>
                  <input type="text" name="search-item" id="search-item" placeholder='Search for the items' className='bg-transparent w-full border-none outline-none h-full' defaultValue={searchText} onChange={handleOnChange} autoFocus={true} />
                </div>
            )
        }
      </div>
      
      
      <div>
        
      </div>

    
    </div>
  )
}

export default Search
