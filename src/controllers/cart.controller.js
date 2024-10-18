import cartService from "../services/cart.service.js";

class CartController {

    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            console.error("Error al crear un nuevo carrito:", error);
            res.status(500).send("Error al crear un nuevo carrito");
        }
    }

    async getCart(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");
            res.json(cart);
        } catch (error) {
            console.error(`Error al obtener el carrito ${cid}:`, error);
            res.status(500).send("Error al obtener el carrito deseado");
        }
    }

    async addProductToCart(req, res) {
        const {cid, pid} = req.params; 
        const {quantity = 1} = req.body; 
        try {
            const cart = await cartService.getCartById(cid);
            if(!cart) return res.status(404).send("Carrito no encontrado");

            const existingProduct = cart.products.find(item => item.product.toString() === pid); 
            if(existingProduct) {
                existingProduct.quantity += quantity; 
            } else {
                cart.products.push({product: pid, quantity }); 
            }
            await cartService.updateCart(cid, cart); 
            res.json(cart);
        } catch (error) {
            res.status(500).send("Error interno del servidor"); 
        }
    }

    async deleteProductOfCart(req, res) {
        const { cid, pid } = req.params;
        try {
            const cart = await cartService.deleteProductOfCart(cid, pid);
            res.status(200).json(cart);
        } catch (error) {
            console.error(`Error al eliminar producto ${pid} del carrito ${cid}:`, error);
            res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
        }
    }

    async deleteAllProductsOfCart(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.deleteCart(cid);
            res.status(200).json(cart);
        } catch (error) {
            console.error(`Error al eliminar todos los productos del carrito ${cid}:`, error);
            res.status(500).send("Error al eliminar todos los productos del carrito");
        }
    }

    async deleteCart(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");
            await cartService.deleteCart(cid);
            res.status(200).send("Carrito eliminado correctamente");
        } catch (error) {
            console.error(`Error al eliminar el carrito ${cid}:`, error);
            res.status(500).send("Error al eliminar el carrito");
        }
    }
}

export default new CartController();