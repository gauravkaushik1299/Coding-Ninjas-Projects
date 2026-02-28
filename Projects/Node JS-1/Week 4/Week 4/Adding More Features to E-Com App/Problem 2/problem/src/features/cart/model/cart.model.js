// Please don't change the pre-written code
// Import the necessary modules here

let cartId = 0;
export class cartModel {
  constructor(userId, productId, quantity) {
    this.id = ++cartId;
    this.userId = userId;
    this.productId = productId;
    this.quantity = Number(quantity);
  }
}

const cartItems = [new cartModel(1, 2, 5), new cartModel(3, 3, 10)];

export const addToCart = (userId, productId, quantity) => {
  const existingItem = cartItems.find(
    (item) => item.userId === userId && item.productId === productId,
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cartItems.push(new cartModel(userId, productId, quantity));
  }

  return cartItems.filter((item) => item.userId === userId);
};

export const removeFromCart = (userId, cartItemId) => {
  const index = cartItems.findIndex(
    (item) => item.id === cartItemId && item.userId === userId,
  );

  if (index === -1) return null;

  const deletedItem = cartItems[index];
  cartItems.splice(index, 1);

  return deletedItem;
};
