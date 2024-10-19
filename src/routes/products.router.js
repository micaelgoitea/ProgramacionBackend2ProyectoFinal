import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

router.post("/", productController.createProduct);
router.get("/:pid", productController.getProductById);
router.get("/:pcode", productController.getProductByCode);
router.get("/", productController.getAllProducts);
router.get("/:pquery", productController.getProductByQuery);
router.put("/:pid", productController.updateProduct);
router.put("/:pid/stock", productController.updateProductStock);
router.delete("/:pid", productController.deleteProduct);

export default router;