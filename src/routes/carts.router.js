import { Router } from "express";
import CartModel from "../dao/models/cart.model.js";
import UserModel from "../dao/models/user.model.js"
import cartController from "../controllers/cart.controller.js";
import { calcularTotal } from "../utils/util.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", cartController.createCart);

// Agregar un producto al carrito
router.post("/:cid/product/:pid", cartController.addProductToCart);

// Obtener los productos del carrito
router.get("/:cid", cartController.getCartProducts);

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', cartController.deleteProductOfCart);

// Eliminar todos los productos del carrito
router.delete("/:cid/products", cartController.deleteAllProductsOfCart);

// Eliminar un carrito
router.delete("/:cid", cartController.deleteCart);

// Finalizar Compra
router.get("/:cid/purchase", async (req, res) => {
    const carritoId = req.params.cid;
    try {
        const carrito = await CartModel.findById(carritoId);
        const arrayProductos = carrito.products;

        const productosNoDisponibles = [];
        const productosComprados = [];

        for (const item of arrayProductos) {
            const productId = item.product;
            const product = await ProductModel.findById(productId);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                productosComprados.push(item);
            } else {
                productosNoDisponibles.push(item);
            }
        }

        const usuarioDelCarrito = await UserModel.findOne({ cart: carritoId });

        const ticket = new TicketModel({
            purchase_datetime: new Date(),
            amount: calcularTotal(productosComprados),
            purchaser: usuarioDelCarrito.username,
        });

        await ticket.save();

        carrito.products = productosNoDisponibles;

        await carrito.save();

        res.json({
            message: "Compra generada",
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
            },
            productosNoDisponibles: productosNoDisponibles.map((item) => item.product),
        });
    } catch (error) {
        res.status(500).send("Error del servidor al crear ticket");
    }
});

export default router;