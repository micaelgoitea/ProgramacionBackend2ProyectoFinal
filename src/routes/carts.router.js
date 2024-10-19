import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.get('/', cartController.getCarts);
router.put('/:cid', cartController.updateCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete('/:cid', cartController.deleteCart);
router.delete('/:cid/product/:pid', cartController.removeProductFromCart);
router.get("/:cid/purchase", cartController.purchaseCart);

export default router;