// Please don't change the pre-written code
// Import the necessary modules here

import { addToCart, removeFromCart } from "../model/cart.model.js";

export const addToCartController = (req, res) => {
  const userId = req.userId; // from JWT
  const productId = Number(req.query.productId);
  const quantity = Number(req.query.quantity);

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      msg: "invalid input",
    });
  }

  const items = addToCart(userId, productId, quantity);

  return res.status(200).json({
    success: true,
    item: items,
  });
};

export const removeFromCartController = (req, res) => {
  const userId = req.userId; // from JWT
  const cartItemId = Number(req.params.itemId);

  const deletedItem = removeFromCart(userId, cartItemId);

  if (!deletedItem) {
    return res.status(403).json({
      success: false,
      msg: "operation not allowed",
    });
  }

  return res.status(200).json({
    success: true,
    deletedCartItem: deletedItem,
  });
};
