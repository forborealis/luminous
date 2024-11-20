const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/products');
const sendEmail = require('../utils/email');

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
          `<li>${item.product.name} (Quantity: ${item.quantity}) - ₱${
            item.product.price * item.quantity
          }</li>`
      )
      .join('');

    const emailHtml = `
      <h1>Order Confirmation</h1>
      <p>Your order has been placed successfully. Here are the details:</p>
      <ul>
        ${productList}
      </ul>
      <p>Subtotal: ₱${totalAmount.toFixed(2)}</p>
      <p>Shipping Fee: ₱50.00</p>
      <p>Total: ₱${(totalAmount + 50).toFixed(2)}</p>
      <p>Status: <strong>Order Placed</strong></p>
    `;

    // Send email to the user
    await sendEmail({
      email: req.user.email, // Ensure the `req.user.email` is populated via authentication
      subject: 'Order Confirmation - Luminous Cosmetics',
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


// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;

//     const order = await Order.findById(orderId).populate('items.product user');
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     order.status = status;
//     await order.save();

//     // Prepare the email content
//     let emailMessage = '';
//     let emailSubject = 'Order Update - Luminous Cosmetics';
//     switch (status) {
//       case 'To Ship':
//         emailMessage = `${order.items[0].product.name} is to ship.`;
//         break;
//       case 'Shipped':
//         emailMessage = `${order.items[0].product.name} has been shipped.`;
//         break;
//       case 'Completed':
//         emailMessage = `
//           <h1 style="color: green;">Completed</h1>
//           <p>${order.items[0].product.name} has been successfully delivered.</p>`;
//         break;
//     }

//     await sendEmail({
//       email: order.user.email,
//       subject: emailSubject,
//       html: emailMessage,
//     });

//     res.status(200).json({ message: 'Order status updated successfully' });
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     res.status(500).json({ message: 'Error updating order status' });
//   }
// };
