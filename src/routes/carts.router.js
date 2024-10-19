import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.post('/cart', cartController.createCart);
router.post('/cart/save', cartController.saveCart);
router.get('/cart/:id', cartController.getCartById);
router.get('/carts', cartController.getCarts);
router.put('/cart/:id', cartController.updateCart);
router.delete('/cart/:id', cartController.deleteCart);
router.delete('/cart/:cartId/product/:productId', cartController.removeProductFromCart);
router.get("/:cid/purchase", cartController.purchaseCart);

export default router;