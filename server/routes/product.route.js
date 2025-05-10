import { Router } from "express";
import adminAuth from "../middleware/adminAuth.js";
import { createproductController, deleteProductById, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, searchProduct, updateProductDetails } from "../controllers/product.controller.js";

const productRouter= Router()

// Only admin user can create product 
productRouter.post("/create", adminAuth, createproductController)
productRouter.post("/get", getProductController)
productRouter.post("/get-product-by-category", getProductByCategory)
productRouter.post("/get-product-by-category-and-subcategory", getProductByCategoryAndSubCategory)
productRouter.post("/get-product-details", getProductDetails)
productRouter.put("/update-product-details",adminAuth, updateProductDetails)
productRouter.delete("/delete-product-by-id",adminAuth, deleteProductById)

// search product from search page
productRouter.post("/search-product", searchProduct)

export default productRouter