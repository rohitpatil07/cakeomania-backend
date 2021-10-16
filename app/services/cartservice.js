import Cart from '../models/Cart.js';

const getCartData = async (user) => {
  try {
    const dbdata = await Cart.find({ user: user });
    return dbdata;
  } catch (error) {
    return { message: error };
  }
};

const addToCart = async (item, user, total_price) => {
  console.log(item);
  const cart = new Cart({
    items: item,
    user: user,
    total_price: total_price,
  });

  try {
    const response = await cart.save();
    return { respose: response, user: user };
  } catch (error) {
    const response = { message: error };
    return response;
  }
};

const removeFromCart = async (user, id) => {
  const response = await Cart.deleteOne({ user: user, 'items.0._id': id });
  return response;
};

export default { getCartData, addToCart, removeFromCart };
