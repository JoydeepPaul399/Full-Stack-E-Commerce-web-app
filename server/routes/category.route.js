import { Router } from "express";
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRouter= Router()

categoryRouter.post("/add-category",adminAuth, AddCategoryController)
categoryRouter.get("/get", getCategoryController)
categoryRouter.put("/update", adminAuth, updateCategoryController)
categoryRouter.delete("/delete", adminAuth,  deleteCategoryController)

export default categoryRouter