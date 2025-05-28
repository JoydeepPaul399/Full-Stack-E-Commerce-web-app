import CartProductModel from "../model/cartProduct.model.js";
import ProductModel from "../model/product.model.js";
import UserModel from '../model/user.model.js'

export const addToCartItemController= async (req, res)=>{
    try {
        const userId= req.userId
        const {productId}= req.body

        if(!productId){
            return res.status(402).json({
                message: "Provide Product Id",
                error: true,
                success: false
            })
        }

        // if item is already in cart we need to update it. 
        const checkItemCart= await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        if(checkItemCart){
            return res.status(400).json({
                message: "Item already in cart"
            })
        }

        const cartItem= new CartProductModel({
            quantity: 1, 
            userId: userId,
            productId: productId
        })

        const save= await cartItem.save()

        const updateCartUser= await UserModel.updateOne({_id: userId}, {
            $push: {
                shopping_cart: productId
            }
        })

        return res.json({
            message: "Product added successfully",
            data: save,
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

export const getCartItemController= async (req, res)=>{
    try {
        const userId= req.userId

        const cartItem= await CartProductModel.find({userId: userId}).populate('productId')

        return res.json({
            data: cartItem,
            error:false,
            success: true,
            message: "Cart Items"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCartItemQtyController= async (req, res)=>{
    try {
        const {userId}= req.userId
        const {_id, qty, productId}= req.body

        if(!_id || !qty){
            return res.status(400).json({
                message: "provide _id, qty",
                error: true,
                success: false
            })

        }

        // const productAvailability= await ProductModel.find({_id: productId})

        // if(productAvailability.stock<1){
        //     return res.json({
        //         message: "Stock is not available",
        //         error: true,
        //         success: false
        //     })
        // }


        const updateCartItem= await CartProductModel.updateOne({_id: _id}, {
            quantity: qty,
            userId: userId
        })

        return res.json({
            message: "Updated cart",
            error:false,
            success: true,
            data: updateCartItem
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCartItemQtyController= async (req, res)=>{
    try {
        const userId= req.userId
        const {_id}= req.body

        if(!_id){
            return res.status(400).json({
                message: "Provide _id",
                error: true,
                success: false
            })
        }

        const deleteCartItem= await CartProductModel.deleteOne({_id: _id, userId: userId})

        return res.json({
            message: "Item removed from cart!",
            error: false,
            success: true,
            data: deleteCartItem
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}