import CartModel from "../models/cart.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear un carrito de compras:", error);
            throw error;
        }
    }
    
    async getCartById(id) {
        try {
            const carritoBuscado = await CartModel.findById(id).populate('products.product', '_id title price');
            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese ID.");
            }
            return carritoBuscado;
        } catch (error) {
            console.error("Error al obtener el carrito por ID:", error);
            throw error;
        }
    }

    async getCarts() {
        try {
            return await CartModel.find();
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
            throw error;
        }
    }

    async addProductInCart(productId, cartId, quantity = 1) {
        try {
            const carritoBuscado = await this.getCartById(cartId);
            const productoAAgregar = carritoBuscado.products.find(item => item.product.toString() === productId);

            if (productoAAgregar) {
                productoAAgregar.quantity += quantity;
            } else {
                carritoBuscado.products.push({ product: productId, quantity });
            }

            await carritoBuscado.save();
            return carritoBuscado;

        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

    async updateProductQuantityInCart(cartId, productId, newQuantity) {
        try {
            const carritoBuscado = await this.getCartById(cartId);
            const productoEnCarrito = carritoBuscado.products.find(item => item.product.toString() === productId);

            if (!productoEnCarrito) {
                throw new Error("El producto no existe en el carrito.");
            }

            productoEnCarrito.quantity = newQuantity;
            await carritoBuscado.save();

            return carritoBuscado;

        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const carritoBuscado = await this.getCartById(cartId);
            carritoBuscado.products = carritoBuscado.products.filter(
                item => item.product.toString() !== productId
            );

            await carritoBuscado.save();
            return carritoBuscado;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }

    async deleteCart(id) {
        const deletedCart = await CartModel.findByIdAndDelete(id);
        if (!deletedCart) throw new Error('Cart not found');
        return deletedCart;
    }

}

export default CartManager;