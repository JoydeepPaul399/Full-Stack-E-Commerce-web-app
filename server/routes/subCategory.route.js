import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subCategory.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const subCategoryRouter= Router()

subCategoryRouter.post("/create", adminAuth, AddSubCategoryController)
// We are using post method becuase we want to add pagination so that post method will be more effective to send the data between server to client. We are also not attaching auth middleware so that it can be send to all the users irrespective of wheather they are logged in or not. 
subCategoryRouter.post("/get", getSubCategoryController)
subCategoryRouter.put("/update", adminAuth, updateSubCategoryController)
subCategoryRouter.delete("/delete", adminAuth, deleteSubCategoryController)

export default subCategoryRouter