import SubCategoryModel from "../model/subCategory.model.js";

export const AddSubCategoryController= async (req, res)=>{
    try {
        const { name, image, category }= req.body

        if(!name || !image || !category || !category[0]){
            return res.status(400).json({
                message: "Provide name, image and category",
                error: true,
                success: false
            })
        }

        const payload= {
            name,
            image,
            category
        }

        const createSubCategory= new SubCategoryModel(payload)
        const save= await createSubCategory.save()

        return res.json({
            message: "Sub Category created",
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getSubCategoryController= async (req, res)=>{
    try {

        // Without .populate('category'), you'd only get the ID in the result.
        // With .populate('category'), Mongoose does a JOIN-like operation and fetches the full category data for each subcategory.
        const data= await SubCategoryModel.find().sort({createdAt: -1}).populate('category')
        return res.json({
            message: "Sub Category data fetched!",
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

export const updateSubCategoryController= async (req, res)=>{
    try {
        const { _id, name, image, category }= req.body

        if(!_id || !name || !image || !category){
            return res.json({
                message: "All fields are required",
                error: true,
                success: false
            })
        }
        
        const checkSub= await SubCategoryModel.findById(_id)
        if(!checkSub){
            return res.status(400).json({
                message: "Check Your id",
                error: true,
                success: false
            })
        }

        const updateSubCategory= await SubCategoryModel.findByIdAndUpdate(_id, {
            name,
            image,
            category
        })

        return res.json({
            message: "Updated successfully",
            error: false,
            success: true,
            data: updateSubCategory
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message ||error,
            error: true,
            success: false
        })
    }
}

export const deleteSubCategoryController= async (req, res)=>{
    try {
        const { _id }= req.body

        if(!_id){
            return res.json({
                message: "Provide the Id",
                error: true,
                success: false
            })
        }

        const deleteSubCategory= await SubCategoryModel.findByIdAndDelete(_id)
        
        return res.json({
            message: "Sub Category Deleted Successfully!",
            error: false,
            success: true,
            data: deleteSubCategory
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}