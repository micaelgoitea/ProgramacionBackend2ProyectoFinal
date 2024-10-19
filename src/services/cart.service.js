import cartRepository from "../repositories/cart.repository.js";

class CartService {

    async createCart() {
        try {
            const newCart = await cartRepository.createCart();
            return newCart;
        } catch (error) {
            throw new Error(`Service Error - creating cart: ${error.message}`);
        }
    }

    async saveCart(cartData) {
        try {
            const savedCart = await cartRepository.saveCart(cartData);
            return savedCart;
        } catch (error) {
            throw new Error(`Service Error - saving cart: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartRepository.getCartById(id);
            return cart;
        } catch (error) {
            throw new Error(`Service Error - fetching cart by ID ${id}: ${error.message}`);
        }
    }

    async getCarts() {
        try {
            const carts = await cartRepository.getCarts();
            return carts;
        } catch (error) {
            throw new Error(`Service Error - fetching all carts: ${error.message}`);
        }
    }

    async updateCart(id, cartData) {
        try {
            const updatedCart = await cartRepository.updateCart(id, cartData);
            return updatedCart;
        } catch (error) {
            throw new Error(`Service Error - updating cart with ID ${id}: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        return await cartRepository.addProductToCart(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const updatedCart = await cartRepository.removeProductFromCart(cartId, productId);
            return updatedCart;
        } catch (error) {
            throw new Error(`Service Error - removing product ${productId} from cart ${cartId}: ${error.message}`);
        }
    }

    async deleteCart(id) {
        try {
            const deletedCart = await cartRepository.deleteCart(id);
            return deletedCart;
        } catch (error) {
            throw new Error(`Service Error - deleting cart with ID ${id}: ${error.message}`);
        }
    }
}

export default new CartService();