import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

router.post("/", productController.createProduct);
router.get("/:id", productController.getProductById);
router.get("/code/:code", productController.getProductByCode);
router.get("/", productController.getAllProducts);
router.get("/query", productController.getProductByQuery);
router.put("/:id", productController.updateProduct);
router.put("/:id/stock", productController.updateProductStock);
router.delete("/:id", productController.deleteProduct);

export default router;