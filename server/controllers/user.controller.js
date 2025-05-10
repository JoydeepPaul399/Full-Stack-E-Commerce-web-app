import UserModel from '../model/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../config/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generateAccessToken.js';
import generatedRefreshToken from '../utils/generateRefreshToken.js';
import uploadImageClodinary from '../utils/uploadImageClodinary.js';
import generateOtp from '../utils/generateOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';

// Register controller 
export async function registerUserController(req, res){
    try{
        const {name, email, password}= req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Provide name, email and password",
                error: true,
                success: false
            })
        }
        const user= await UserModel.findOne({email});
        if(user){
            return res.json({
                message: "Already registered email",
                error: true,
                success: false
            })
        }
        const salt= await bcryptjs.genSalt(10);
        const hashedPassword= await bcryptjs.hash(password, salt);

        const payload= {
            name,
            email,
            password: hashedPassword
        };
        
        const newUser= new UserModel(payload);
        const save= await newUser.save();

        const verifyEmailUrl= `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
        const verifyEmail= await sendEmail({
            sendTo: email,
            subject: "Verify email from binkeyit",
            html: verifyEmailTemplate({
                name, 
                url: verifyEmailUrl
            })
        })

        return res.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save
        })
    }
    catch(error){
        return res.status(500).json({
            message:error.message || error,
            error: true,
            success: false
        });
    }
}

// Verify email controller
export async function verifyEmailController(req, res) {
    try{
        const {code}= req.body;


        if(!code){
            return res.status(400).json({
                message: "Provide code",
                error: true,
                success: false
            })
        }
        const user= await UserModel.findOne({_id: code});
        if(!user){
            return res.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            })
        }

        const updateUser= await UserModel.updateOne({_id: code}, {verify_email: true});
        return res.json({
            message: "Email Verified Successfully",
            error: false,
            success: true
        })
    }
    catch(error){
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Login controller
export async function loginController(req, res){
    try{
        const {email, password}= req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "User is not registerd",
                error: true,
                success: false
            })
        }

        if(user.status !=="active"){
            return res.status(400).json({
                message: "User is not active",
                error: true,
                success: false
            })
        }

        const checkPassword= await bcryptjs.compare(password, user.password);
        if(!checkPassword){
            return res.status(400).json({
                message: "Check Your Password",
                error: true,
                success: false
            })
        }

        const accessToken= await generatedAccessToken(user._id);
        const refreshToken= await generatedRefreshToken(user._id)
        const cookieOption= {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
        res.cookie('accessToken',accessToken, cookieOption)
        res.cookie('refreshToken', refreshToken, cookieOption)

        return res.json({
            message: "Login Successfully",
            error: false,
            success: true,
            // Some mobile device cann't  access the cookie
            data:{
                accessToken, refreshToken
            }
        })


    }
    catch(error){
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Logout controller
export async function logoutController(req, res) {
    try{
        // we set userId using the auth Middleware 
        const userid= req.userId

        const cookieOption= {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
        res.clearCookie("accessToken", cookieOption);
        res.clearCookie("refreshToken", cookieOption);

        const removeRefreshToken= await UserModel.findByIdAndUpdate(userid, {refresh_token: ""});

        return res.json({
            message: "Logout successfully",
            error: false,
            success: true
        })
    }
    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// upload User Avatar
export async function uploadAvatar(req, res){
    try{
        const userId = req.userId
        const image= req.file;
        const upload= await uploadImageClodinary(image)
        // console.log("image", image)
        const updateUser= await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })
        return res.json({
            message: "Uploaded profile",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })
    }
    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Update user details 
export async function updateUserDetails(req, res){
    try{
        const userId= req.userId;
        const {name, email, mobile, password}= req.body;

        let hashedPassword=""

        if(password){
            const salt= await bcryptjs.genSalt(10)
            hashedPassword= await bcryptjs.hash(password, salt)
        }

        const updateUser= await UserModel.updateOne({_id: userId}, {
            ...(name && { name: name}),
            ...(email && {email: email}),
            ...(mobile && {mobile: mobile}),
            ...(hashedPassword && {password: hashedPassword}) 
            
        })

        return res.json({
            message: "Updated user details successfully",
            error: false,
            success: true,
            data: updateUser
        })

    }
    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Forgot password
export async function forgotPasswordController(req, res){
    try {
        const {email}= req.body;
        const user= await UserModel.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "Email is not registered", 
                error: true,
                success: false
            })
        }

        const otp= generateOtp();
        const expireTime= new Date() +60 * 60 * 1000 // new Date return in milisecond so we are converting it into 1 hour. 

        const update= await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Reset Password - Binkeyit",
            html: forgotPasswordTemplate(user.name, otp)
        })

        return res.json({
            message: "Check Your Email",
            email: email,
            error: false,
            success: true
        })

    }
    catch (error) {
        return res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// verify forgot password otp 
export async function verifyForgotPasswordOtp(req, res){
    try {
        const {email, otp}= req.body

        if(!email || !otp){
            return res.json({
                message: "Provide required field Email and OTP.",
                error: true,
                success: false
            })
        }

        const user= await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Email is not registered",
                error: true,
                success: false
            })
        }

        // Checking whether OTP time expired or not 
        const currentTime= new Date().toISOString()
        // if expiry time is less means time is over. So we will reject it
        if(user.forgot_password_expiry < currentTime){
            return res.status(400).json({
                message: "OTP Expired",
                error: true,
                success: false
            })
        }

        if(otp !== user.forgot_password_otp){
            return res.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        const updateUser= await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        })
        
        // If OTP is not expired. otp === user.forgot_password_otp then we will allow user to reset the password. 
        return res.json({
            message: "Verify OTP successfully",
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Reset the password 
export async function resetPassword(req, res){
    try {
        const {email, newPassword, confirmPassword}= req.body;
        if(!email || !newPassword || !confirmPassword ){
            return res.status(400).json({
                message: "Provide required field like email, password, newPassword",

            })
        } 

        const user= await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({
                message: "New Password and confirm password should be same",
                error: true,
                success: false
            })
        }
        const salt= await bcryptjs.genSalt(10)
        const hashedPassword= await bcryptjs.hash(newPassword, salt)

        const update= await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        console.log(update)

        return res.json({
            message: "Password updated successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Refresh Token controller 
export async function refreshToken(req, res){
    try {
        const refreshToken= req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1] // [Bearer token]
        if(!refreshToken){
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            })
        }

        const verifyToken= await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return res.json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }
        // In verifyToken we get the details we added early. This is done by verify function which makes it understandable
        console.log(verifyToken)
        const userId= verifyToken._id

        const newAccessToken= await generatedAccessToken(userId)
        const cookieOption= {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
        res.cookie("accessToken", newAccessToken, cookieOption)
        return res.json({
            message: "New Access Token is generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function userDetails(req, res){
    try{
        const userId= req.userId

        const user= await UserModel.findById(userId).select("-password -refresh_token")

        return res.json({
            message: "User details", 
            data: user,
            success: true,
            error: false
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false
        })
    }
}