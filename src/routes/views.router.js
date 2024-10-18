import { Router } from "express";
import { adminOnly, userOnly } from "../middleware/auth.js";
import passport from "passport";
import ProductManager from "../dao/db/productManager-db.js";
import CartManager from "../dao/db/cartManager-db.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", passport.authenticate("jwt", { session: false }), userOnly, async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return { _id: _id.toString(), ...rest };
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            user: req.user,
            cart: req.user.cart,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), adminOnly, (req, res) => {
    res.render("realtimeproducts");
})

router.get("/carts", (req, res) => {
    res.render("carts");
})

router.get("/register", (req, res) => {
    res.render("register");
})

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCartById(cartId);

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map((item) => ({
            product: item.product.toObject(),
            quantity: item.quantity,
        }));

        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;