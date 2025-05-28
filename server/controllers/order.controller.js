import stripe from "../config/stripe.js";
import CartProductModel from "../model/cartProduct.model.js";
import OrderModel from "../model/order.model.js";
import UserModel from "../model/user.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryController(req, res){
    try {
        const userId= req.userId
        const { list_items, totalAmt, addressId, subTotalAmt  }= req.body

        // throw new Error("Throwing error!")

        // console.log("list items are ", list_items)

        if (!list_items?.length || !addressId || !totalAmt || !subTotalAmt) {
            return res.status(400).json({
                message: "Missing required fields",
                error: true,
                success: false
            });
        }

        const payload= list_items.map(el=>{
            return ({
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    image: el.productId.image
                },
                paymentId:"",
                payment_status:"CASH ON DELIVERY",
                delivery_address:addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt
            })
        })

        // console.log("payload is ", payload)

        const generateOrder= await OrderModel.insertMany(payload)
        
        // Order is placed now we need to remove the items from the cart 
        const removeCartItems= await CartProductModel.deleteMany({userId: userId})
        const updateInUser= await UserModel.updateOne({_id: userId}, {
            shopping_cart: []
        })


        return res.json({
            message: "Order placed successfully",
            error: false,
            success: true,
            data: generateOrder
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const calculateDiscount= (price, discount=1)=>{
    const discountAmount=Math.ceil((Number(price) * Number(discount)) / 100)
    const actualPrice= Number(price)- Number(discountAmount)

    return actualPrice
}

// this is the flow how stripe works
// [User Clicks "Buy"] → [Frontend Calls Backend] → [Backend talks to Stripe] → [Stripe returns Payment Page URL] → [User Pays] → [Success or Failure Page]

// Checkout Session	A Stripe object to create a one-time payment
// PaymentIntent	Used in custom UIs (Stripe Elements)
// Webhook	Stripe tells your server “Payment success!” after it happens
// Secret Key	Private key to use Stripe securely (in your backend only)
// Publishable Key	Public key used in frontend for Stripe Elements
export async function paymentController(req, res) {
    try {
        const userId= req.userId
        const { list_items, totalAmt, addressId, subTotalAmt  }= req.body

        const user= await UserModel.findById(userId)

        // We need to format each product as Stripe-compatible line item 
        const line_items= list_items.map(item=>{
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: calculateDiscount(item.productId.price, item.productId.discount) * 100
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })

        // used to configure the Stripe Checkout Session.
        const params= {
            submit_type: 'pay',
            mode: "payment",
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        }


        // This line is where you create a Stripe Checkout Session using the parameters (params)
        const session= await stripe.checkout.sessions.create(params)


        // Sends the Stripe session object as a JSON response to the frontend.
        return res.status(200).json(session)



        // You get user info and cart data from the request.

        // Transform cart items into Stripe-compatible line items.

        // Configure checkout session params including payment methods, success/cancel URLs.

        // Create a Stripe checkout session.

        // Return that session to the frontend.

        // Handle errors cleanly.

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// http://localhost:8080/api/order/webhook

// export async function webhookStripe(req, res){

    
//     const event= req.body
//     const endPointSecret= process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

//     console.log("event is ", event)

//     switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object;
//         //   console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);

//         const lineItems= await stripe.checkout.sessions.listLineItems(session.id)

//         console.log("line_items are ", lineItems)
//         break;
//     // case 'payment_method.attached':
//     //   const paymentMethod = event.data.object;
//     //   // Then define and call a method to handle the successful attachment of a PaymentMethod.
//     //   // handlePaymentMethodAttached(paymentMethod);
//     //   break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   res.send();
// }

const getOrderProductItems= async (lineItems, userId, session)=>{
    const productList= []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product= await stripe.products.retrieve(item.price.product)

            const payload= {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    image: product.images
                },
                paymentId: session.payment_intent,
                payment_status:session.payment_status,
                delivery_address:session.metadata.addressId,
                subTotalAmt: item.amount_total/100,
                totalAmt: item.amount_total/100
            }

            productList.push(payload)
        }
    }

    console.log("This is the productList", productList)

    return productList
}

export async function webhookStripe(req, res) {
  const sig = req.headers['stripe-signature'];
  const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  let event;

  // Verify webhook signature and construct event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

//   console.log("Stripe event received:", event.type);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      try {
        const userId= session.metadata.userId
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        // console.log("line_items are ", lineItems);

        const orderProduct= await getOrderProductItems(lineItems, userId, session)
        const order= await OrderModel.insertMany(orderProduct)

        if(order){
            // const removeCartItems= UserModel.findByIdAndUpdate(userId, {
            //     shopping_cart: []
            // })
            // const removeCartProductDB= CartProductModel.deleteMany(userId)

            await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
            await CartProductModel.deleteMany({ userId });
        }
      } catch (err) {
        console.error("Error fetching line items:", err.message);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  res.status(200).send();
}

export async function getOrderDetailsController(req, res){
    try {
        const userId= req.userId
        const orderDetails= await OrderModel.find({userId: userId}).sort({createdAt: -1}).populate("delivery_address")

        return res.json({
            message: "Order details fetched",
            error: false,
            success: true,
            data: orderDetails
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}