const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/products');
const Review = require('../models/review');
const sendEmail = require('../utils/email');
const admin = require("../config/firebase-config");


// const sendPushNotification = async (fcmToken, title, body) => {
//   try {
//     const payload = {
//       notification: {
//         title,
//         body,
//       },
//     };

//     const response = await admin.messaging().sendToDevice(fcmToken, payload);
//     console.log("Push notification response:", response);
//   } catch (error) {
//     console.error("Error sending push notification:", error.message);
//   }
// };





// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in cart' });
    }

    cart.items.push({ product: productId, quantity });
    await cart.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// Fetch cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(200).json({ message: 'Cart is empty', items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cart' });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
    });
    await order.save();

    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Clear the cart
    await Cart.findOneAndDelete({ user: userId });

    // Prepare email content
    const productList = cart.items
    .map(
      (item) =>
        `<div class="item">
          <p>${item.product.name} x ${item.quantity}: ₱${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>`
    )
    .join('');

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
          border-bottom: 1px solid #dddddd;
        }
        .header h1 {
          margin: 0;
          color: #333333;
        }
        .content {
          padding: 20px 0;
        }
        .content p {
          margin: 10px 0;
          color: #555555;
        }
        .content .item {
          padding: 10px 0;
          border-bottom: 1px solid #dddddd;
        }
        .content .item:last-child {
          border-bottom: none;
        }
        .footer {
          text-align: center;
          padding: 10px 0;
          border-top: 1px solid #dddddd;
          color: #777777;
        }
        .totals {
          text-align: right;
          margin-top: 20px;
        }
        .totals p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Your order has been placed successfully. Here are the details:</p>
          ${productList}
          <div class="totals">
            <p><strong>Subtotal:</strong> ₱${totalAmount.toFixed(2)}</p>
            <p><strong>Shipping Fee:</strong> ₱50.00</p>
            <p><strong>Total:</strong> ₱${(totalAmount + 50).toFixed(2)}</p>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email to the user
    await sendEmail({
    email: req.user.email, 
    subject: 'Order Confirmation - Luminous',
    html: emailHtml,
    });

    res.status(200).json({ message: 'Order placed successfully', order });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing checkout' });
      }
    };

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.getCompletedOrders = async (req, res) => {
  try {
    console.log('getCompletedOrders hit');
    const userId = req.user.id;

    const completedOrders = await Order.find({ user: userId, status: 'Completed' })
      .populate('items.product', 'name images price')
      .lean();

    const userReviews = await Review.find({ userId }).select('productId').lean();

    const reviewedProductIds = new Set(userReviews.map((review) => review.productId.toString()));

    const unreviewedCompletedOrders = completedOrders
      .map((order) => ({
        ...order,
        items: order.items.filter((item) => !reviewedProductIds.has(item.product._id.toString())),
      }))
      .filter((order) => order.items.length > 0);

    res.status(200).json({ orders: unreviewedCompletedOrders });
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    res.status(500).json({ message: 'Error fetching completed orders' });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // Populate user details
      .populate('items.product', 'name images price'); // Populate product details

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};




exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate inputs
    if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    const allowedStatuses = ["Order Placed", "To Ship", "Shipped", "Completed", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `'${status}' is not a valid status` });
    }

    // Fetch the order and associated user
    const order = await Order.findById(orderId).populate("items.product user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Handle stock restoration if status is 'Cancelled'
    if (status === "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity; // Restore the stock
          await product.save(); // Save the updated product stock
        }
      }
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Prepare Email and Push Notification Messages
    const productList = order.items
      .map(
        (item) =>
          `<li>${item.product.name} (Quantity: ${item.quantity}) - ₱${
            item.product.price * item.quantity
          }</li>`
      )
      .join("");

      const emailContents = {
        "Order Placed": {
          subject: "Order Placed Confirmation",
          message: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #4CAF50;">Your Order Has Been Placed!</h1>
                <p>Dear ${order.user.name},</p>
                <p>Thank you for shopping with us. Your order has been successfully placed. Here are the details:</p>
                <div>${productList}</div>
                <p style="font-weight: bold;">Total Amount: ₱${order.totalAmount + 50}</p>
              </div>
            </div>
          `,
        },
        "To Ship": {
          subject: "Order Update: Preparing for Shipment",
          message: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #FFA500;">Your Order is Being Prepared for Shipment!</h1>
                <p>Dear ${order.user.name},</p>
                <p>Your order is now being prepared for shipment. Here are the details:</p>
                <div>${productList}</div>
              </div>
            </div>
          `,
        },
        "Shipped": {
          subject: "Order Shipped Notification",
          message: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #1E90FF;">Your Order Has Been Shipped!</h1>
                <p>Dear ${order.user.name},</p>
                <p>Your order is on its way. Here are the details:</p>
                <div>${productList}</div>
              </div>
            </div>
          `,
        },
        "Completed": {
          subject: "Thank You for Your Purchase",
          message: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #4CAF50;">Thank You for Your Purchase!</h1>
                <p>Dear ${order.user.name},</p>
                <p>We are thrilled to inform you that your order has been successfully completed. Here are the details:</p>
                <div>${productList}</div>
              </div>
            </div>
          `,
        },
        "Cancelled": {
          subject: "Order Cancellation Notice",
          message: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #FF0000;">Order Cancellation Notice</h1>
                <p>Dear ${order.user.name},</p>
                <p>Your order has been cancelled. Here are the details:</p>
                <div>${productList}</div>
              </div>
            </div>
          `,
        },
      };

    const pushMessages = {
      "Order Placed": `Hi ${order.user.name}, your order has been successfully placed.`,
      "To Ship": `Hi ${order.user.name}, your order is now being prepared for shipment.`,
      "Shipped": `Hi ${order.user.name}, your order has been shipped and is on its way.`,
      "Completed": `Hi ${order.user.name}, your order has been completed. Thank you for shopping with us!`,
      "Cancelled": `Hi ${order.user.name}, your order has been cancelled.`,
    };

    // Send Email Notification
    const emailSubject = emailContents[status]?.subject;
    const emailMessage = emailContents[status]?.message;

    if (emailSubject && emailMessage) {
      await sendEmail({
        email: order.user.email,
        subject: emailSubject,
        html: emailMessage,
      });
    }

    // Send Push Notification
    if (order.user.fcmToken) {
      const title = "Order Status Update";
      const body = pushMessages[status];
      const payload = {
        notification: {
          title,
          body,
        },
        token: order.user.fcmToken,
      };

      try {
        const response = await admin.messaging().send(payload);
        console.log("Push notification response:", response);
      } catch (pushError) {
        console.error("Error sending push notification:", pushError);
      }
    } else {
      console.warn("No FCM token available for the user.");
    }

    // Respond to the client
    res.status(200).json({
      message: "Order status updated successfully and notifications sent.",
      notification: `Order status updated to ${status} for order ID: ${orderId}.`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};
exports.getSalesData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Ensure startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    // Query the database for orders within the specified date range and group by day
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.json({ sales: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTotalOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    const totalOrders = orders.length; // Count the total number of orders
    res.json({ total: totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};