import { Router } from "express";
import { adminOnly, userOnly } from "../middleware/auth.js";
import passport from "passport";
import ProductManager from "../dao/db/productManager-db.js";

const router = Router();
const productManager = new ProductManager();

router.get("/products", passport.authenticate("jwt", { session: false }), userOnly, async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages
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

export default router;