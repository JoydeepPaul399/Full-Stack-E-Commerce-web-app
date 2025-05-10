import React, { useEffect, useState } from "react"

const useMobile= (breakpoint= 768)=>{
    // window.innerWidth gives the width of the device 
    const [isMobile, setIsMobile]= useState(window.innerWidth < breakpoint)

    const handleResize = ()=>{
        const checkpoint = window.innerWidth < breakpoint
        setIsMobile(checkpoint)
    }

    window.addEventListener('resize', handleResize)

    // useEffect(()=>{
    //     handleResize()

    //     window.addEventListener('resize', handleResize)

    //     return ()=>{
    //         window.removeEventListener('resize', handleResize)
    //     }
    // }, [])

    return [isMobile]
}

export default useMobile