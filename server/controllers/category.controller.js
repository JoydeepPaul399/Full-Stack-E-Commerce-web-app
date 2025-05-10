import CategoryModel from "../model/category.model.js";
import ProductModel from "../model/product.model.js";
import SubCategoryModel from "../model/subCategory.model.js";

export const AddCategoryController = async (req, res)=>{
    try{
        const {name, image}= req.body

        if(!name || !image){
            return res.status(400).json({
                message: "Please provide all fields",
                error: true,
                success: false
            })
        }

        // Saving the data to the database 
        const addCategory= new CategoryModel({
            name,
            image
        })

        const saveCategory= await addCategory.save()

        if(!saveCategory){
            return res.status(400).json({
                message: "Category not added",
                error: true,
                success: false
            })
        }
        
        return res.status(200).json({
            message:"Category added successfully",
            error: false,
            success: true
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getCategoryController= async (req, res)=>{
    try {
        // sort({ createdAt: -1}) -1: This indicates descending order. MongoDB sorts in descending order when -1 is used. It will sort the documents starting from the most recent date (the latest createdAt values).
        const data= await CategoryModel.find().sort({ createdAt: -1})

        return res.json({
            data: data,
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

export const updateCategoryController= async (req, res)=>{
    try {
        console.log("request reached")
        const {categoryId, name, image}= req.body

        const update= await CategoryModel.updateOne({_id: categoryId}, {
            name,
            image
        })

        return res.json({
            message: "Updated Category",
            success: true,
            error: false,
            data: update
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
        
    }
}

export const deleteCategoryController= async (req, res)=>{
    try {
        const {_id }= req.body
        // Checking the other models where I used Category if anything is there we can't delete it 
        const checkSubCategory= await SubCategoryModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        const checkProduct= await ProductModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if(checkSubCategory > 0 || checkProduct > 0){
            return res.status(400).json({
                message: "Already Category is in use. Cann't Deleted",
                error: true,
                success: false
            })
        }

        const deleteCategory= await CategoryModel.deleteOne({_id: _id})

        return res.json({
            message: "Deleted category successfully",
            data: deleteCategory,
            error: false,
            success: true
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true,
            success: false
        })
    }
}