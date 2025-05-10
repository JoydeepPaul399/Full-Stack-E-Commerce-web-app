import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios= axios.create({
    baseURL: baseURL,
    withCredentials: true,

})

// Setting accessToken to the header
Axios.interceptors.request.use( async(config)=>{
    const accessToken= localStorage.getItem('accessToken')
    if(accessToken){
        config.headers.Authorization= `Bearer ${accessToken}`
    }
    return config
},
(error)=>{
    return Promise.reject(error)
}
)

// Extend the life span of access token with the help of refresh token
Axios.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        // The error.config is a reference to the original request configuration.
        let originalRequest= error.config

        if(error.response.status===401 && !originalRequest.retry){
            originalRequest.retry= true
            const refreshToken = localStorage.getItem("refreshToken")

            if(refreshToken){
                const newAccessToken = await refreshAccessToken(refreshToken)

                if(newAccessToken){
                    originalRequest.headers.Authorization= `Bearer ${newAccessToken}`
                    return Axios(originalRequest)
                }
            }
        }

        return Promise.reject(error)
    }
)

const refreshAccessToken= async(refreshToken)=>{
    try{
        const response= await Axios({
            ...SummaryApi.refreshToken,
            // HTTP headers are case-insensitive,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })
        const accessToken= response.data.data.accessToken
        localStorage.setItem('accessToken', accessToken)
        return accessToken
    }
    catch(error){
        console.log(error)
    }
}

export default Axios


// axios.create(): This method is used to create a custom instance of axios. The instance can have default configurations that can be reused across multiple requests. Here, we pass an object to configure this instance.

// Axios interceptors: Interceptors are functions that run before or after a request is sent, or before or after a response is received. Here, you're using a request interceptor, which runs before the request is made.