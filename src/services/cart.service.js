import cartRepository from "../repositories/cart.repository.js";

class CartService {

    async createCart() {
        return await cartRepository.createCart();
    }

    async getCartProducts(cartId) {
        return await cartRepository.getCartById(cartId);
    }

    async addProductInCart(cartId, productId, quantity) {
        return await cartRepository.addProductInCart(cartId, productId, quantity);
    }

    async getCarts() {
        return await cartRepository.getCarts();
    }

    async getCartById(cartId) {
        return await cartRepository.getCartById(cartId);
    }

    async deleteCart(cartId) {
        return await cartRepository.deleteCart(cartId);
    }

    async deleteProductOfCart(cartId, productId) {
        return await cartRepository.deleteProductOfCart(cartId, productId);
    }

    async updateCart(cartId, products) {
        return await cartRepository.updateCart(cartId, products);
    }
}

export default new CartService();