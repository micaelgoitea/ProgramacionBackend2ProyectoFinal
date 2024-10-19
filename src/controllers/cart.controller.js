import cartService from "../services/cart.service.js";
import productService from "../services/product.service.js";
import userService from "../services/user.service.js";
import TicketService from "../services/ticket.service.js";

class CartController {

    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            return res.status(201).json(newCart);
        } catch (error) {
            return res.status(500).json({ error: `Controller Error - creating cart: ${error.message}` });
        }
    }

    async saveCart(req, res) {
        const cartData = req.body;
        try {
            const savedCart = await cartService.saveCart(cartData);
            return res.status(201).json(savedCart);
        } catch (error) {
            return res.status(500).json({ error: `Controller Error - saving cart: ${error.message}` });
        }
    }

    async getCartById(req, res) {
        const { id } = req.params;
        try {
            const cart = await cartService.getCartById(id);
            if (!cart) return res.status(404).json({ error: 'Cart not found' });
            return res.status(200).json(cart);
        } catch (error) {
            return res.status(500).json({ error: `Controller Error - fetching cart by ID ${id}: ${error.message}` });
        }
    }

    async getCarts(req, res) {
        try {
            const carts = await cartService.getCarts();
            return res.status(200).json(carts);
        } catch (error) {
            return res.status(500).json({ error: `Controller Error - fetching all carts: ${error.message}` });
        }
    }

    async updateCart(req, res) {
        const { id } = req.params;
        const cartData = req.body;
        try {
            const updatedCart = await cartService.updateCart(id, cartData);
            if (!updatedCart) return res.status(404).json({ error: 'Cart not found' });
            return res.status(200).json(updatedCart);
        } catch (error) {
            return res.status(500).json({ error: `Controller Error - updating cart with ID ${id}: ${error.message}` });
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
            res.json(updatedCart.products);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async removeProductFromCart(req, res) {
        const { cartId, productId } = req.params;
        try {
            const updatedCart = await cartService.removeProductFromCart(cartId, productId);
            if (!updatedCart) return res.status(404).json({ error: 'Cart or product not found' });
            return res.status(200).json(updatedCart);
        } catch (error) {
            return res.status(500).json({ error: `Controller Error - removing product ${productId} from cart ${cartId}: ${error.message}` });
        }
    }

    async deleteCart(req, res) {
        const { id } = req.params;
        try {
            const deletedCart = await cartService.deleteCart(id);
            if (!deletedCart) return res.status(404).json({ error: 'Cart not found' });
            return res.status(200).json(deletedCart);
        } catch (error) {
            return res.status(500).json({ error: `Controller Error - deleting cart with ID ${id}: ${error.message}` });
        }
    }

    async purchaseCart(req, res) {
        const carritoId = req.params.cid;
        try {
            
            const carrito = await cartService.getCartById(carritoId);
            const arrayProductos = carrito.products;

            const productosNoDisponibles = [];
            const productosComprados = [];

            for (const item of arrayProductos) {
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (product.stock >= item.quantity) {
                    await productService.updateProductStock(productId, product.stock - item.quantity);
                    productosComprados.push(item);
                } else {
                    productosNoDisponibles.push(item);
                }
            }

            // Obtener el usuario del carrito
            const usuarioDelCarrito = await userService.getUserByCartId(carritoId);

            // Crear el ticket de compra
            const ticketData = {
                purchase_datetime: new Date(),
                amount: this.calcularTotal(productosComprados),
                purchaser: usuarioDelCarrito.username,
            };

            const ticket = await TicketService.createTicket(ticketData);

            // Actualizar el carrito con productos no disponibles
            await cartService.updateCart(carritoId, { products: productosNoDisponibles });
            
            return res.json({
                message: "Compra generada",
                ticket: {
                    id: ticket._id,
                    code: ticket.code,
                    amount: ticket.amount,
                    purchaser: ticket.purchaser,
                },
                productosNoDisponibles: productosNoDisponibles.map((item) => item.product),
            });
        } catch (error) {
            return res.status(500).json({ error: `Error del servidor al crear ticket: ${error.message}` });
        }
    }

    calcularTotal(productosComprados) {
        return productosComprados.reduce((total, item) => total + item.quantity * item.product.price, 0);
    }
}

export default new CartController();