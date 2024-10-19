import cartDao from "../dao/cart.dao.js";

class CartRepository {

    async createCart() {
        try {
            const newCart = await cartDao.createCart();
            return newCart;
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async saveCart(cartData) {
        try {
            const savedCart = await cartDao.saveCart(cartData);
            return savedCart;
        } catch (error) {
            throw new Error(`Error saving cart: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartDao.getCartById(id);
            return cart;
        } catch (error) {
            throw new Error(`Error fetching cart by ID ${id}: ${error.message}`);
        }
    }

    async getCarts() {
        try {
            const carts = await cartDao.getCarts();
            return carts;
        } catch (error) {
            throw new Error(`Error fetching all carts: ${error.message}`);
        }
    }

    async updateCart(id, cartData) {
        try {
            const updatedCart = await cartDao.updateCart(id, cartData);
            return updatedCart;
        } catch (error) {
            throw new Error(`Error updating cart with ID ${id}: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        return await cartDao.addProductToCart(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const updatedCart = await cartDao.removeProductFromCart(cartId, productId);
            return updatedCart;
        } catch (error) {
            throw new Error(`Error removing product ${productId} from cart ${cartId}: ${error.message}`);
        }
    }

    async deleteCart(id) {
        try {
            const deletedCart = await cartDao.deleteCart(id);
            return deletedCart;
        } catch (error) {
            throw new Error(`Error deleting cart with ID ${id}: ${error.message}`);
        }
    }
}

export default new CartRepository();