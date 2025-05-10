import ProductModel from "../model/product.model.js";

export const createproductController= async (req, res)=>{
    try {
        const { name, image, category, subCategory, unit, stock, price, discount, description, more_details }= req.body

        if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description  ){
            return res.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            })
        }

        const product= new ProductModel({
            name, image, category, subCategory, unit, stock, price, discount, description, more_details
        })

        const saveProduct= await product.save()

        return res.json({
            message: "Product created successfully!",
            error: false,
            success: true,
            data: saveProduct
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductController= async (req, res)=>{
    try {
        let {page, limit, search}= req.body

        if(!page){
            page= 1
        }

        if(!limit){
            limit=10
        }

        const query= search ? {
            $text: {
                $search: search
            }
        } : {}

        // pagination logic 
        const skip= (page - 1) * limit
        const [data, totalCount]= await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate("category subCategory") ,
            ProductModel.countDocuments(query)
        ])
        // The skip() function is used for pagination. It tells MongoDB how many documents to skip before returning the results.
        // The limit() function restricts the number of documents returned.

        return res.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount/limit),
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

export const getProductByCategory= async (req, res)=>{
    try {
        const {id}= req.body

        if(!id){
            return res.status(400).json({
                message: "Provide category Id",
                error: true,
                success: false
            })
        }

        const product= await ProductModel.find({category: {$in: id} }).limit(15)

        return res.json({
            message: "Category product list",
            data: product,
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

export const getProductByCategoryAndSubCategory= async (req, res)=>{
    try{
        let { categoryId, subCategoryId, page, limit }= req.body

        if(!categoryId || !subCategoryId){
            return res.status(400).json({
                message: "Provide categoryId and subCategoryId",
                error: true,
                success: false
            })
        }
        if(!page){
            page=1
        }
        if(!limit){
            limit=10
        }

        const query = {
            category: {$in: categoryId},
            subCategory: {$in: subCategoryId}
        }
        

        const skip= (page-1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ]);

        return res.status(200).json({
            message: "Product List", 
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            success: true,
            error: false
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

export const getProductDetails= async (req, res)=>{
    try {
        const {productId}= req.body
        
        if(!productId){
            return res.status(400).json({
                message: "Please provide the product id",
                error: true,
                success: false
            })
        }

        const product= await ProductModel.findOne({_id: productId});

        if(!product){
            return res.json({
                message: "No Product found in database",
                error: true,
                success: false
            })
        }
        
        return res.json({
            message: "Product details",
            data: product,
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

export const updateProductDetails= async (req, res)=>{
    try {
        const { _id }= req.body

        if(!_id){
            return res.status(400).json({
                message: "Provide product _id",
                error: true,
                success: false
            })
        }

        const updateProduct= await ProductModel.updateOne({_id: _id}, {
            $set: req.body
        }, { runValidators: true })

        return res.json({
            message: "Updated successfully!",
            error:false,
            success: true,
            data: updateProduct
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteProductById= async (req, res)=>{
    try {
        const { _id }= req.body
        if(!_id){
            return res.status(400).json({
                message: "Please provide product Id",
                error: true,
                success: false
            })
        }

        const deleteProduct= await ProductModel.deleteOne({_id: _id})
        if(!deleteProduct){
            return res.status(400).json({
                message: "Something went wrong!",
                error: true,
                success: false
            })
        }

        return res.json({
            message: "Product deleted successfully!",
            error: false,
            success: true,
            data: deleteProduct
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// search product 
export const searchProduct= async (req, res)=>{
    try {
        let {search, page, limit}= req.body

        if(!page){
            page=1
        }
        if(!limit){
            limit=10
        }

        const query= search ? {
            $text: {
                $search : search
            }
        } : {}

        // This is for pagination 
        const skip= (page-1) * limit

        const [data, dataCount]= await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate("category subCategory"),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: "Product data!",
            error: false,
            success: true,
            data: data,
            totalCount:dataCount,
            totalPage: Math.ceil(dataCount/limit),
            page: page,
            limit: limit
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}