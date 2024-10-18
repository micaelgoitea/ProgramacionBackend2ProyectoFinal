import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", cartController.createCart);

// Obtener un carrito por ID
router.get("/:cid", cartController.getCart);

// Agregar un producto al carrito
router.post("/:cid/product/:pid", cartController.addProductToCart);

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', cartController.deleteProductOfCart);

// Eliminar todos los productos del carrito
router.delete("/:cid/products", cartController.deleteAllProductsOfCart);

// Eliminar un carrito
router.delete("/:cid", cartController.deleteCart);

export default router;