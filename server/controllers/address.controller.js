import AddressModel from "../model/address.model.js";
import UserModel from "../model/user.model.js";

export const addAddressController= async (req, res)=>{
    try {
        const userId= req.userId
        const {address_line, city, state, pincode, country, mobile}= req.body

        const createAddress= new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId: userId
        })

        const saveAddress= await createAddress.save()

        const AddUserAddressId= await UserModel.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            }
        })

        return res.json({
            message: "Address created successfully!",
            error: false,
            success: true,
            data: saveAddress
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAddressController= async (req, res)=>{
    try {
        const userId= req.userId

        const data= await AddressModel.find({userId: userId}).sort({"createdAt":-1})

        return res.json({
            message: "Avialble addresses",
            error: false,
            success: true,
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateAddressController= async (req, res)=>{
    try {
        const userId= req.userId
        const {_id, address_line, city, state, pincode, country, mobile}= req.body

        if (!_id || !address_line || !city || !state || !pincode || !country || !mobile) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        const updateAddress = await AddressModel.updateOne({_id: _id, userId: userId}, {
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        })

        return res.json({
            message: "Address Updated successfully",
            error: false,
            success: true,
            data: updateAddress
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteAddressController= async (req, res)=>{
    try {
        const userId= req.userId

        const {_id}= req.body

        const disableAddress= await AddressModel.updateOne({_id: _id, userId: userId}, {
            status: false
        })

        return res.json({
            message: "Address removed!",
            error: false,
            success: true,
            data: disableAddress
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}