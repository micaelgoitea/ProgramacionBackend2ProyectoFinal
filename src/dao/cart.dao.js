import CartModel from "./models/cart.model.js";

class CartDao {

    async createCart() {
        const newCart = new CartModel({ products: [] });
        return await newCart.save();
    }

    async findById(id) {
        const cart = await CartModel.findById(id).populate('products.product', '_id title price');
        if (!cart) throw new Error('Cart not found');
        return cart;
    }

    async saveCart(cartData) {
        const cart = new CartModel(cartData);
        return await cart.save();
    }

    async getCarts() {
        return await CartModel.find();
    }

    async update(id, cartData) {
        return await CartModel.findByIdAndUpdate(id, cartData);
    }

    async updateProductsOfCart(id, products) {
        const updatedCart = await CartModel.findByIdAndUpdate(id, { products: products }, { new: true });
        if (!updatedCart) throw new Error('Error al actualizar los productos del Carrito');
        return updatedCart;
    }

    async deleteProductOfCart(cartId, productId) {
        const cart = await this.findById(cartId);
        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        return await this.updateProductsOfCart(cartId, cart.products);
    }

    async deleteCart(id) {
        const deletedCart = await CartModel.findByIdAndDelete(id);
        if (!deletedCart) throw new Error('Cart not found');
        return deletedCart;
    }
}

export default new CartDao();