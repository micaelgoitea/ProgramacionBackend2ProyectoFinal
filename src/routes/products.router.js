import express from "express";
import productController from "../controllers/product.controller.js"; 

const router = express.Router();

// Crear un nuevo producto
router.post("/", productController.createProduct);

// Obtener todos los productos
router.get("/", productController.getProducts); 

// Obtener un producto por ID
router.get("/:pid", productController.getProductById);

// Obtener un producto por código
router.get("/code/:code", productController.getProductByCode);

// Actualizar un producto
router.put("/:pid", productController.updateProduct); 

// Actualizar el stock de un producto
router.put("/:pid/stock", productController.updateStock);

// Eliminar un producto
router.delete("/:pid", productController.deleteProduct);

export default router;