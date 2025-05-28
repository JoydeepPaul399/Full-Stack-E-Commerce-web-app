import { Router } from "express";
import auth from "../middleware/auth.js";
import { CashOnDeliveryController, getOrderDetailsController, paymentController, webhookStripe } from "../controllers/order.controller.js";
import bodyParser from "body-parser";

const orderRouter= Router()

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryController)
orderRouter.post("/checkout", auth, paymentController)
// webhook needs raw binary data so we are parsing it 
orderRouter.post("/webhook", bodyParser.raw({type: "application/json"}) ,webhookStripe)
orderRouter.get("/order-list", auth, getOrderDetailsController)

export default orderRouter