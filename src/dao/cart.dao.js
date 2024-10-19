import CartModel from "./models/cart.model.js";

class CartDao {

    async createCart() {
        const newCart = new CartModel({ products: [] });
        return await newCart.save();
    }

    async saveCart(cartData) {
        const cart = new CartModel(cartData);
        return await cart.save();
    }

    async getCartById(id) {
        const cart = await CartModel.findById(id).populate('products.product', '_id title price');
        if (!cart) throw new Error('Cart not found');
        return cart;
    }

    async getCarts() {
        return await CartModel.find();
    }

    async updateCart(id, cartData) {
        const updatedCart = await CartModel.findByIdAndUpdate(id, cartData, { new: true });
        if (!updatedCart) throw new Error(`Failed to update cart with id ${id}`);
        return updatedCart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error('Cart not found');
        const updatedProducts = cart.products.filter(item => item.product.toString() !== productId);
        return await this.updateCart(cartId, { products: updatedProducts });
    }

    async deleteCart(id) {
        const deletedCart = await CartModel.findByIdAndDelete(id);
        if (!deletedCart) throw new Error(`Failed to delete cart with id ${id}`);
        return deletedCart;
    }
}

export default new CartDao();