import jwt from 'jsonwebtoken';
import UserModel from '../model/user.model.js';
// import dotenv from 'dotenv';

// dotenv.config()

const adminAuth= async(req, res, next)=>{
    try{
        // in case of mobile version cookie will not be there so accessing header. 
        // req?.header: If req is null or undefined, it won't throw an error; instead, it will return undefined.This is called optional chaining
        const token= req.cookies.accessToken || req?.headers?.authorization.split(" ")[1]; // ["Bearer", "token"]
        // console.log("token", token)
        if(!token){
            return res.status(401).json({
                message: "Provide token",

            })
        }

        const decode= await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        // console.log(decode)
        if(!decode){
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            })
        }

        const userType= await UserModel.findOne({_id: decode.id})
        console.log(decode.id)
        console.log(userType)

        if (!userType) {
            // console.log("Sending response")
            return res.status(404).json({
              message: "Only admins are authorized for this",
              success: false
            });
          }

        else if(userType.role!=="ADMIN"){
            // console.log("Unauthorized access - Not Admin");
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            })
        }
        // if decode is there we will get the userId which we used to while signing the jwt. And we will add userId in header to use it in next controller
        req.userId= decode.id;
        
        next()
    }
    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default adminAuth