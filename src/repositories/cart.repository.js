import cartDao from "../dao/cart.dao.js";
import CartDTO from "../dto/cart.dto.js";

class CartRepository {
    async createCart() {
        return await cartDao.saveCart({ products: [] });
    }

    async getCarts() {
        const carts = await cartDao.getCarts();
        return carts.map(cart => new CartDTO(cart));
    }

    async getCartById(id) {
        const cart = await cartDao.findById(id);
        return new CartDTO(cart);
    }

    async updateCart(id, cartData) {
        return await cartDao.update(id, cartData);
    }

    async updateProductsInCart(cartId, products) {
        const cart = await cartDao.updateProductsOfCart(cartId, products);
        return new CartDTO(cart);
    }

    async addProductInCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(item => item.productId === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await this.updateProductsInCart(cartId, cart.products);
    }

    async deleteProductOfCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        return await this.updateProductsInCart(cartId, cart.products);
    }

    async deleteCart(id) {
        return await cartDao.deleteCart(id);
    }
}

export default new CartRepository();