const generateOtp= ()=>{
    // return Math.floor(Math.random() * 900000) // This will return 0 to 900000
    return Math.floor(Math.random()*900000+ 100000); // This will return 100000 to 900000
}

export default generateOtp